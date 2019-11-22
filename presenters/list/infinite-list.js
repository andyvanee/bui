import { LitElement, html, css } from 'lit-element'
import '../../elements/empty-state'

customElements.define('b-infinite-list', class extends LitElement {

    createRenderRoot(){ return this }

    // static get styles(){return css`
    //     :host {
    //         display: block
    //     }
    // `}
    
    constructor(){
        super()
        this.pageAt = 0
        this.threshold = 400
    }

    firstUpdated(){
        // after first updating, reset and get content
        this.reset()
    }
    
    connectedCallback(){
        super.connectedCallback()
        this.addEventListener('scroll', this.onScroll, true)
    }

    disconnectedCallback(){
        super.disconnectedCallback()
        this.removeEventListener('scroll', this.onScroll, true)
    }

    async reset(){
        this.pageAt = 0
        this.scrollTop = 0
        this.prevModel = null
        this.innerHTML = ''
        
        await this.getContent()
    }

    onScroll(){

        let delta = this.scrollHeight - this.scrollTop - this.offsetHeight
        let down = !this._scrollDelta || delta < this._scrollDelta

        this._scrollDelta = delta

        if( !down || delta == 0 ) return
        
        if( delta <= this.threshold )
            this.getContent()
    }

    async getContent(){
        
        if( !this.dataSource ) return

        if( this._fetching ) return;

        let pageAt = this.pageAt

        this._fetching = true
        let models = await this.dataSource.fetch(pageAt)
        this.addContent(models)
        this._fetching = null

        if( pageAt == 0 ){
            this.dispatchEvent(new CustomEvent('content-changed',{
                detail: {data: this.dataSource},
                bubbles: true, 
                composed: true
            }))
        }
    }

    get rowElement(){return this.getAttribute('row') || 'div'}
    get emptyElement(){return this.getAttribute('empty') || 'b-empty-state'}

    addContent(models){
        
        this.pageAt += models.length

        if( this.pageAt == 0 ){
            this.emptyView = this.emptyView || document.createElement(this.emptyElement)
            this.emptyView.dataSource = this.dataSource
            let term = this.dataSource.filters&&this.dataSource.filters.term
            this.emptyView.value = term ? `No results for “${term}”` : (this.getAttribute('placeholder') || 'No results')
            this.appendChild(this.emptyView)
            return 
        }

        models.forEach(model=>{

            let divider = this.divider && this.divider(this.prevModel, model)
            if( divider ){
                this.appendChild(divider)
            }

            let el = document.createElement(this.rowElement)
            el.model = model
            this.appendChild(el)
            this.prevModel = model
        })
    }

})

export default customElements.get('b-infinite-list')