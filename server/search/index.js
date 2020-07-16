require('../../util/promise.series')
const Fuse = require('fuse.js')

const SearchTypes = new Map()

class SearchAPI {

    constructor(attrs, req){
        Object.assign(this, attrs)
        this.req = req
    }

    get limit(){ return 100 }

    static get api(){return {
		routes: [
			['get', '/search/:term', 'searchDefault'],
            ['get', '/search/:type/:term', 'searchType']
		]
	}}

    static add(type){
        if( !type.name )
            return console.error('SearchType must have a `name`')

        SearchTypes.set(type.name, type)
    }

    async searchType(){

        if( !this.db ) throw new Error('Missing `this.db`')
        
        let SearchType = SearchTypes.get(this.type)

        if( !SearchType ) throw Error('Invalid search type')
            
        return new SearchType(this.req, this.db).search(this.term)
    }

    // default searches all "types"
    async searchDefault(){
        // TODO: allow types to be set by query param or filters?
        // not needed yet so we'll leave out for now
        let types = Array.from(SearchTypes.keys())
        return this.searchTypes(types)
    }

    async searchTypes(types=['book']){

        if( !this.db ) throw new Error('Missing `this.db`')
        
        let data = []

        // perform searches for each "type"
        await Promise.series(types, async type=>{
            let SearchType = SearchTypes.get(type)
            if( SearchType ){
                let res = await new SearchType(this.req, this.db).query(this.term)
                data.push(...res)
            }
        })

        // further reduce and sort the results from a string search
        // by matching the `term` agaist the `label` returned from the search types
        let fuse = new Fuse(data, {
            threshold: 0.2,
            includeScore: true,
            keys: ["label"]
        })
        let result = fuse.search(this.term)

        // get list of IDs, grouped by type
        let byType = {}
        result.forEach(row=>{
            byType[row.item.type] = byType[row.item.type] || []
            byType[row.item.type].push(row.item.id)
        })

        // hydrate the IDs with real data
        for( let type in byType ){
            let SearchType = SearchTypes.get(type)
            let typeData = await new SearchType(this.req, this.db).hydrate(byType[type])
            byType[type] = typeData.groupBy('id')
        }

        // add the hydrated data to the sorted results
        let res = result.map(row=>{
            let rowData = byType[row.item.type][row.item.id]
            rowData.search = Object.assign({
                score: row.score,
                weight: row.item.weight
            }, rowData.search||{})
            return rowData
        })

        // dedupe
        let uniqIds = {}
        res = res.filter(row=>{
            let id = row.type+row.id
            if( uniqIds[id] ) return false
            return uniqIds[id] = true
        })

        // final sort
        // sort data taking in account each type's "weight" (higher weight = more important)
        res = res.sort((a,b)=>{

            let aDelta =  1 + (-1 / (a.search.weight||0))
            let bDelta =  1 + (-1 / (b.search.weight||0))

            // sort by fuse.js score and the weight
            let scoreSort = (a.search.score+bDelta) - (b.search.score+aDelta)

            if( scoreSort !== 0 ) return scoreSort

            // different types, maintain current sort
            if( a.type != b.type ) return 0

            let SearchType = SearchTypes.get(a.type)
            if( SearchType && SearchType.finalSort )
                return SearchType.finalSort(a, b)
            
            return 0
        })
        
        if( this.limit > 0 )
            res = res.slice(0, this.limit)

        return res
    }
}


module.exports = SearchAPI