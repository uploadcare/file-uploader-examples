# uc-blocks ❤️ Vue

[![Edit vue-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/uc-blocks-examples/tree/main/examples/vue-uploader/)

## Integration notes

Since uc-block is based on custom elements, you need to let Vue know that
certain elements should be treated as custom elements.
It is done by specifying the `compilerOptions.isCustomElement` like this:

```js
compilerOptions.isCustomElement = (tag) => tag.startsWith("uc-")
```

All uc-blocks elements are prefixed with `lr-`.

See more about custom elements in the [Vue documentation](https://vuejs.org/guide/extras/web-components.html#using-custom-elements-in-vue).

