# Textly

A plugin for [markdown-it](https://markdown-it.github.io/) that wraps content in spans with one or more space-delimited css classes.

`[[my-class]] your text here [[my-class]]`
will render

```html
<span class="my-class">
    your text here
</span>
```

`[[my-class another-class]] some other text [[my-class another-class]]`
will render

```html
<span class="my-class another-class">
    some other text
</span>
```

## Usage

```javascript
var md = require('markdown-it')()
            .use(require('textly'));
md.render(/*...*/)
```
