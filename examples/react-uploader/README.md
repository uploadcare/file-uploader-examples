<p align="center">
  <a href="https://uploadcare.com/?ref=github-react-example-readme">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="./assets/media/logo-safespace-transparent.svg">
      <source media="(prefers-color-scheme: dark)" srcset="./assets/media/logo-transparent-inverted.svg">
      <img width=250 alt="Uploadcare logo" src="./assets/media/logo-safespace-transparent.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com?ref=github-readme">Website</a> • 
  <a href="https://uploadcare.com/docs/start/quickstart?ref=github-readme">Quick Start</a> • 
  <a href="https://uploadcare.com/docs?ref=github-readme">Docs</a> • 
  <a href="https://uploadcare.com/blog?ref=github-readme">Blog</a> • 
  <a href="https://discord.gg/mKWRgRsVz8?ref=github-readme">Discord</a> •
  <a href="https://twitter.com/Uploadcare?ref=github-readme">Twitter</a>
</p>

# React File Uploader with Uploadcare Blocks

[![Edit react-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/blocks-examples/tree/main/examples/react-uploader/)

This is an example project of implementing a file uploader in a React application with [Uploadcare Blocks](https://github.com/uploadcare/blocks).

## Run this demo locally

```bash
# close this repo and go to the cloned folder

$ cd examples/react-uploader

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

## Configutration

Please, read the [File Uploader documentation](https://uploadcare.com/docs/file-uploader/).

## Integration notes

Blocks are native to the Web but not to React. It's easy to use Blocks in a React app, but note that a part of your solution will encapsulate non-React code.

In this example we created a [FileUploader](./src/FileUploader/FileUploader.tsx) component 
which provides React-friendly API for the rest of the app. There are Blocks inside of this component and nowhere else.

### Non-React things you should know about

1. Communicate with Blocks File Uploader with [events](https://uploadcare.com/docs/file-uploader/data-and-events/).
   You will find them in the example. It's easy to handle using hooks like [`useEffect`](https://react.dev/reference/react/useEffect).

2. Use `class` attribute instead of `className`.

3. Some attributes required by Blocks are kebab-cased, not camelCased as usual for React world.

4. You are able to invoke [some methods of File Uploader](https://uploadcare.com/docs/file-uploader/api/) 
   to control its behavior.

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
