<p align="center">
  <a href="https://uploadcare.com?ref=github-vue-example-readme">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/3b610a0a-780c-4750-a8b4-3bf4a8c90389/logo-transparent-inverted.svg">
      <img width="250" alt="Uploadcare logo" src="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com?ref=github-vue-example-readme">Website</a> • 
  <a href="https://uploadcare.com/docs/start/quickstart?ref=github-vue-example-readme">Quick Start</a> • 
  <a href="https://uploadcare.com/docs?ref=github-vue-example-readme">Docs</a> • 
  <a href="https://uploadcare.com/blog?ref=github-vue-example-readme">Blog</a> • 
  <a href="https://discord.gg/mKWRgRsVz8?ref=github-vue-example-readme">Discord</a> •
  <a href="https://twitter.com/Uploadcare?ref=github-vue-example-readme">Twitter</a>
</p>

# Vue file uploading examples

[![Edit vue-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/file-uploader-examples/tree/main/examples/vue-uploader/)

This is an example project of implementing a file uploader in a Vue application with [Uploadcare File Uploader](https://github.com/uploadcare/file-uploader).

## Run this demo locally

```bash
# clone this repo and go to the cloned folder

$ cd examples/vue-uploader

$ npm install
# or `yarn install`, if you wish

$ npm run start
# or `yarn start`
```

## Installation

All you need to do is to install [`@uploadcare/file-uploader`](https://www.npmjs.com/package/@uploadcare/file-uploader) from npm
via your favorite Node package manager.

The package provides TypeScript types, so you do not need to install `@types/anything` if you need a proper typing.

[Read more about installation](https://uploadcare.com/docs/file-uploader/installation/) in the Uploadcare documentation.

## Configuration

Please, read the [File Uploader documentation](https://uploadcare.com/docs/file-uploader/).

## Integration notes

### Vue + Web Components

File Uploader is native to the Web but not to Vue. However, Vue does everything to make solutions based on Web Components
to work properly with it. 

To help Vue to figure out where you're using Web Components, you have to specify 
[`compilerOptions.isCustomElement` option](https://vuejs.org/api/application.html#app-config-compileroptions). 
In this example we have done it inside [the Vite config file](vite.config.js).

You may like to read [Vue and Web Components](https://vuejs.org/guide/extras/web-components.html) doc, 
if you want to know more about using custom elements in Vue.

### Options API vs. Composition API

One of the examples, “Real-life form”, contains a [FileUploader](src/components/FileUploader) component
which provides Vue-friendly API for the rest of the example. There is a File Uploader inside this component and nowhere else.

However, Vue 3 supports two different API styles: Options API and Composition API. We do not know which one you prefer,
so we have implemented the example twice.

By default we use Options API because the whole app is built with it. But you're free to switch the `import` path 
in [FormView.vue](src/views/FormView/FormView.vue) from [FileUploader.options.vue](src/components/FileUploader/FileUploader.options.vue)
to [FileUploader.composition.vue](src/components/FileUploader/FileUploader.composition.vue) to ensure that it works too.

### Styling

If your styling solution may provide class string or style object, feel free to use them on components like
`uc-file-uploader-regular` and override default class using CSS variables.

Otherwise you may go “full override” way and pass a string with styles to a File Uploader type of your choice.

[Read more about styling](https://uploadcare.com/docs/file-uploader/styling/) in the File Uploader docs.

## Contribution

You’re always welcome to contribute:

* Create [issues](https://github.com/uploadcare/file-uploader-examples/issues) every time you feel something is missing or goes wrong.
* Provide your feedback or drop us a support request at <a href="mailto:hello@uploadcare.com">hello@uploadcare.com</a>.
* Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/uploadcare) with "uploadcare" tag if others can have these questions as well.
* Star this repo if you like it ⭐️
