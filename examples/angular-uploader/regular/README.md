<p align="center">
  <a href="https://uploadcare.com/?ref=github-angular-regular-example-readme">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/3b610a0a-780c-4750-a8b4-3bf4a8c90389/logo-transparent-inverted.svg">
      <img width="250" alt="Uploadcare logo" src="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com?ref=github-angular-regular-example-readme">Website</a> • 
  <a href="https://uploadcare.com/docs/start/quickstart?ref=github-angular-regular-example-readme">Quick Start</a> • 
  <a href="https://uploadcare.com/docs?ref=github-angular-regular-example-readme">Docs</a> • 
  <a href="https://uploadcare.com/blog?ref=github-angular-regular-example-readme">Blog</a> • 
  <a href="https://discord.gg/mKWRgRsVz8?ref=github-angular-regular-example-readme">Discord</a> •
  <a href="https://twitter.com/Uploadcare?ref=github-angular-regular-example-readme">Twitter</a>
</p>

# Angular File Uploader with Uploadcare Blocks

[![Edit angular-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/blocks-examples/tree/main/examples/angular-uploader/regular/)

This is an example project of implementing a file uploader in an Angular application with [Uploadcare Blocks](https://github.com/uploadcare/blocks).

## Run this demo locally

```bash
# clone this repo and go to the cloned folder

$ cd examples/angular-uploader/regular

$ npm install
# or `yarn install`, if you wish

$ npm run dev
# or `yarn dev`
```

## Installation

All you need to do is to install [`@uploadcare/blocks`](https://www.npmjs.com/package/@uploadcare/blocks) from npm
via your favorite Node package manager.

[Read more about installation](https://uploadcare.com/docs/file-uploader/installation/) in the Uploadcare documentation.

## Configuration

Please, read the [File Uploader documentation](https://uploadcare.com/docs/file-uploader/).

## Integration notes

### Angular + Web Components

Blocks are native to the Web but not to Angular. However, Angular does everything to make solutions based on Web Components
to work properly with it. 

To help Angular to figure out where you're using Web Components, you have to set
`schemas` property of the file uploader component to `[CUSTOM_ELEMENTS_SCHEMA]`, where `CUSTOM_ELEMENTS_SCHEMA` 
is a special schema imported from `@angular/core`.
In this example we have done it inside [the file-uploader component](./src/app/file-uploader/file-uploader.component.ts).

You may like to read [custom element schemas](https://angular.dev/guide/components/advanced-configuration#custom-element-schemas) doc, 
if you want to know more about using custom elements in Angular.

### Styling

If your styling solution may provide class string or style object, feel free to use them on blocks like
`lr-file-uploader-regular` and override default class using CSS variables.

Otherwise you may go “full override” way and pass a string with styles to a File Uploader type of your choice.

[Read more about styling](https://uploadcare.com/docs/file-uploader/styling/) in the File Uploader docs.

## Contribution

You’re always welcome to contribute:

* Create [issues](https://github.com/uploadcare/blocks/issues) every time you feel something is missing or goes wrong.
* Provide your feedback or drop us a support request at <a href="mailto:hello@uploadcare.com">hello@uploadcare.com</a>.
* Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/uploadcare) with "uploadcare" tag if others can have these questions as well.
* Star this repo if you like it ⭐️
