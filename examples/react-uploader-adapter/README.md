<p align="center">
  <a href="https://uploadcare.com?ref=github-react-example-readme">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/3b610a0a-780c-4750-a8b4-3bf4a8c90389/logo-transparent-inverted.svg">
      <img width="250" alt="Uploadcare logo" src="https://ucarecdn.com/1b4714cd-53be-447b-bbde-e061f1e5a22f/logo-safespace-transparent.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com?ref=github-react-example-readme">Website</a> • 
  <a href="https://uploadcare.com/docs/start/quickstart?ref=github-react-example-readme">Quick Start</a> • 
  <a href="https://uploadcare.com/docs?ref=github-react-example-readme">Docs</a> • 
  <a href="https://uploadcare.com/blog?ref=github-react-example-readme">Blog</a> • 
  <a href="https://discord.gg/mKWRgRsVz8?ref=github-react-example-readme">Discord</a> •
  <a href="https://twitter.com/Uploadcare?ref=github-react-example-readme">Twitter</a>
</p>

# React File Uploader with Uploadcare Blocks

[![Edit react-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/blocks-examples/tree/main/examples/react-uploader/)

This is an example project of implementing a file uploader in a React application with [Uploadcare Blocks](https://github.com/uploadcare/blocks).

## Run this demo locally

```bash
# clone this repo and go to the cloned folder

$ cd examples/react-uploader-adapter

$ npm install
# or `yarn install`, if you wish

$ npm run start
# or `yarn start`
```

## Installation

All you need to do is to install [`@uploadcare/react-uploader`](https://www.npmjs.com/package/@uploadcare/react-uploader) from npm
via your favorite Node package manager.

[Read more about installation](https://www.npmjs.com/package/@uploadcare/react-uploader/) in the Uploadcare documentation.

## Configuration

Please, read the [File Uploader documentation](https://uploadcare.com/docs/file-uploader/).

## Integration notes

Blocks are native to the Web but not to React. It's easy to use Blocks in a React app, but note that a part of your solution will encapsulate non-React code.

E.g. in one of the examples we created a [FileUploader](src/components/FileUploader/FileUploader.tsx) component 
which provides React-friendly API for the rest of the view. There are Blocks inside of this component and nowhere else.

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
