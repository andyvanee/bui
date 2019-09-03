# Custom Elements

Although custom elements are globally accessible after initially imported, 
it is best practice to import elements when you need them.

```js
import 'blackstone-ui/elements/btn'
let btn = document.createElement('b-btn')

// or
import Btn from 'blackstone-ui/elements/btn'
let btn = new Btn()
```
***

## `<b-paper>`

A white box with rounded corners and a shadow.

<!--
<b-paper>Paper element</b-paper>
-->

#### Attributes
- `color` - blue, green, red, orange, yellow, purple
- `border` - only if a color is set
- `dense` - less padding
- `compact` - no padding
- `empty` - no background and a dashed border
- `outline` - no shadow, just border

## `<b-btn>`

<!--
<b-btn>Default Button</b-btn>
<b-btn color="blue">Blue Button</b-btn>
<b-btn color="red" outline>Outline Button</b-btn>
<b-btn text>Text Button</b-btn>
-->

#### Attributes
- `icon`
- `color`
- `outline`
- `text` - no button outline until hover
- `clear`
- `pill`

#### Properties
- `spin` - set to `true` to show a spinner

## `<b-icon>`

Display an svg icon – [See a full list of icons](../docs/icons.md)

<!--
<b-icon name="user"></b-icon>
<b-icon name="cog"></b-icon>
-->

```html
<b-icon name="user"></b-icon>
<b-icon name="cog"></b-icon>
```

## `<b-hr>`
A line divider

<!--
<b-hr></b-hr>
<br>
Label 1 <b-hr vert></b-hr> Label 2
-->

#### Attributes
- `short` - makes the line short (not full width)
- `vert` - changes to a vertical line

## `<b-sub>`
A subdued (or sub text) text element that is slightly smaller and lighter in color

<!--
<b-sub>Subdued text</b-sub>
-->

## `<b-label>`

Default is an uppercase, bold, and slightly subdued (gray) text block for labeling.
Can be altered to display as filled, outlined, or as a badge.

<!--
<b-label>Default Label</b-label>&nbsp;&nbsp;
<b-label filled>Filled Label</b-label>&nbsp;&nbsp;
<b-label outline>Outline Label</b-label>&nbsp;&nbsp;
<b-label badge>Badge Label</b-label>
<br><br>
<b-label divider>Label Divider</b-label>
<br>
<b-label divider="center">Label Divider</b-label>
-->

#### Attributes
- `xs` - xtra small
- `sm` - small
- `lg` - large
- `filled`, `filled="color"`
- `badge`, `badge="color"`
- `outline`, `outline="color"`
- `divider`, `divider="[center,right]"`

#### Style hooks
- `--dividerThickness`

## `<b-empty-state>`

Use to show a message when a view is empty. **NOTE:** make sure the parent 
element has `position:relative` (or absolute)

<!--
<b-empty-state static>Nothing to show</b-empty-state>
-->

#### Attributes
- `xs` - xtra small
- `sm` - small
- `md` - medium
- `lg` - large
- `static` - removes absolute pos and 100% height

## `<b-spinner>`

An animated circle spinner to represent progress

<!--
<b-spinner></b-spinner>&nbsp;&nbsp;
<b-spinner style="--size: 2em;"></b-spinner>
-->

#### Style Hooks

- `--size`

## `<b-spinner-overlay>`

Shows an overlay over the parent element with a `b-spinner` and optional label

<!--
<div>
    Some content here
    <b-spinner-overlay show></b-spinner-overlay>
</div>
-->

>**Note:** if the spinner is at the top level of a shadowroot, it will link itself
> to the host element as `host.spinner`

#### Attributes
- `show`
- `label`
- `lg` - make spinner large
- `dark` 

#### Style Hooks
- `--spinnerBgd`
- `--spinnerColor`
- `--spinnerSize`

## `<b-uploader>`

Lets files be dropped onto an element.

<!--
Drag a file and drop it here
<b-uploader></b-uploader>
-->

Watches for files to be dragged over it's parent element;
shows help text to let user know they can drop the file; shows upload progress.

Views should hook into the `change` event to test for valid files, make the user
confirm (optional), and then instruct the uploader to upload the selected files.

Example usage

```html
<b-uploader accept="image/*" multiple placeholder="Drop to upload images"></b-uploader>
```

```js
let uploader = document.querySelector('b-uploader')
uploader.addEventListener('change', e=>{
    
    if( e.detail.invalid ){
        return console.log(e.detail.invalid)
    
    uploader.upload({url:'/api/upload'}).then(resp=>{
        console.log('upload finished with resp:', resp)
    })
})

// a native OS file picker can be opened too
uploader.chooseFile()
```

#### Attributes
- `disabled`
- `accept` - same syntax as [input[type="file"]](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept)
- `multiple`
- `placeholder` - the text to display when dragging file over
- `url` - where to upload the file (optional if setting in `.upload()` method)
- `auto-upload` - url must be set for this to work

#### Methods
- `.chooseFile()` - opens the browser exploer for choosing a file
- `.upload({url='', method='POST', fileKey='file', formData={}})`
    - `url` must be set as an attribute or given to the `upload` method

#### Events
- `change` - when files are selected (via selection or drop)
- `upload` - when all selected files finish uploading

#### Styles
- `--hoverBgd`
- `--uploadingBgd`
- `--progressBgd`

## `<b-embed>`
For embedding iframes and videos (like youtube) that responsively scale

```html
<b-embed url="https://www.youtube.com/watch?v=sK1ODp0nDbM"></b-embed>
```
<!--
<b-embed url="https://www.youtube.com/watch?v=sK1ODp0nDbM"></b-embed>
-->

## `<b-carousel>`
A slider/carousel element that will show one of the nested elements at time.
A set of dots will be shown to represent the number of slides available.

<!--
<b-carousel>
    <b-paper block>Slide 1</b-paper>
    <b-paper block>Slide 2</b-paper>
    <b-paper block>Slide 3</b-paper>
</b-carousel>
-->

Currently a very simple implementation with no animation or sliding.
Maybe later we'll introduce animation and more features, like nav arrows

##### Styles
- `--dotSize`
- `--dotPadding`
- `--dotMargin`
- `--dotExpand` - transform scale

## `<b-timer>`

Displays a runnning timer

<!--
<b-timer running></b-timer>
-->

#### Attributes
- `time` - current time in milliseconds
- `ms` - whether to show milliseconds
- `running` - should the timer be progressing