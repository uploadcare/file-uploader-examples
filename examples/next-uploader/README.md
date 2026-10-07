<p align="center">
  <a href="https://uploadcare.com?ref=github-next-example-readme">
    <picture>
      <source media="(prefers-color-scheme: light)" srcset="https://ucarecdn.com/27eed822-4a34-4347-b227-a89df2e7bf47/uploadcare-logo.svg">
      <source media="(prefers-color-scheme: dark)" srcset="https://ucarecdn.com/dfd6c07b-fd17-4559-8803-bc98f92b564b/uploadcare-logo-inverted.svg">
      <img width=250 alt="Uploadcare logo" src="https://ucarecdn.com/27eed822-4a34-4347-b227-a89df2e7bf47/uploadcare-logo.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://uploadcare.com?ref=github-next-example-readme">Website</a> •
  <a href="https://uploadcare.com/docs/start/quickstart?ref=github-next-example-readme">Quick Start</a> •
  <a href="https://uploadcare.com/docs?ref=github-next-example-readme">Docs</a> •
  <a href="https://uploadcare.com/blog?ref=github-next-example-readme">Blog</a> •
  <a href="https://twitter.com/Uploadcare?ref=github-next-example-readme">Twitter</a>
</p>

# Next.js file uploading example

[![Edit next-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/file-uploader-examples/tree/main/examples/next-uploader/)

This is an example project of implementing a file uploader in a Next.js application with [Uploadcare File Uploader](https://github.com/uploadcare/file-uploader)

## Requirements

- Node ≥ 22 and npm ≥ 10

## Setup

The demo runs out of the box — both keys ship pre-filled with working
demo values. You'll want to replace them when forking for real use:

1. **Uploadcare public key** — `pubkey="a6ca334c3520777c0045"` in `app/_lib/FileUploader.js` (and the route pages) points at our shared sandbox. Replace it with a key from [your Uploadcare dashboard](https://app.uploadcare.com/projects/-/api-keys/).

2. **Unsplash access key** — `.env` is committed with a working demo Unsplash token. To use your own (free, from <https://unsplash.com/developers>), edit `.env` and replace the `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` value.

## Run this demo locally

```bash
# clone this repo and go to the cloned folder

$ cd examples/next-uploader

$ npm install
# or `yarn install`, if you wish

$ npm run start
# or `yarn start`
```

## Contribution

You’re always welcome to contribute:

* Create [issues](https://github.com/uploadcare/file-uploader-examples/issues) every time you feel something is missing or goes wrong.
* Provide your feedback or drop us a support request at <a href="mailto:hello@uploadcare.com">hello@uploadcare.com</a>.
* Ask questions on [Stack Overflow](https://stackoverflow.com/questions/tagged/uploadcare) with "uploadcare" tag if others can have these questions as well.
* Star this repo if you like it ⭐️
