<p align="center">
  <a href="https://uploadcare.com?ref=github-svelte-app-example-readme">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/3b610a0a-780c-4750-a8b4-3bf4a8c90389/logo-transparent-inverted.svg">
      <img width="250" alt="Uploadcare logo" src="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com?ref=github-svelte-app-example-readme">Website</a> • 
  <a href="https://uploadcare.com/docs/start/quickstart?ref=github-svelte-app-example-readme">Quick Start</a> • 
  <a href="https://uploadcare.com/docs?ref=github-svelte-app-example-readme">Docs</a> • 
  <a href="https://uploadcare.com/blog?ref=github-svelte-app-example-readme">Blog</a> • 
  <a href="https://discord.gg/mKWRgRsVz8?ref=github-svelte-app-example-readme">Discord</a> •
  <a href="https://twitter.com/Uploadcare?ref=github-svelte-app-example-readme">Twitter</a>
</p>

# Svelte File Uploader with Uploadcare Blocks

[![Edit svelte-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/blocks-examples/tree/main/examples/svelte-uploader/app-example/)

This is an example project of implementing a file uploader in a Svelte application with [Uploadcare Blocks](https://github.com/uploadcare/blocks).

## Run this demo locally

```bash
# clone this repo and go to the cloned folder

$ cd examples/svelte-uploader/app-example

$ npm install
# or `yarn install`, if you wish

$ npm run dev
# or `yarn dev`
```

## Installation

All you need to do is to install [`@uploadcare/blocks`](https://www.npmjs.com/package/@uploadcare/blocks) from npm
via your favorite Node package manager.

The package provides TypeScript types, so you do not need to install `@types/anything` if you need a proper typing.

[Read more about installation](https://uploadcare.com/docs/file-uploader/installation/) in the Uploadcare documentation.

## Configuration

Please, read the [File Uploader documentation](https://uploadcare.com/docs/file-uploader/).

## Integration notes

Blocks are native to the Web, which makes them native to Svelte too.

In this example we created a [FileUploader](srcib/FileUploader/FileUploader.svelte) component
which provides Svelte-friendly API for the rest of the app. There are Blocks inside of this component and nowhere else.

### Styling

If your styling solution may provide class string or style object, feel free to use them on blocks like
`lr-file-uploader-regular` and override default class using CSS variables.

Otherwise you may go “full override” way and pass a string with styles to a File Uploader type of your choice.

[Read more about styling](https://uploadcare.com/docs/file-uploader/styling/) in the File Uploader docs.

## Contribution

You’re always welcome to contribute:

* Create [issues](https://github.com/uploadcare/blocks-examples/issues) every time you feel something is missing or goes wrong.
* Provide your feedback or drop us a support request at <a href="mailto:hello@uploadcare.com">hello@uploadcare.com</a>.
* Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/uploadcare) with "uploadcare" tag if others can have these questions as well.
* Star this repo if you like it ⭐️
