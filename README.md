# Textly

A plugin for markdown-it that wraps content in css classes.

# Usage

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