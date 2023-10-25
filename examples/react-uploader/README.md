# Blocks ❤️ React

[![Edit react-uploader](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/uploadcare/blocks-examples/tree/main/examples/react-uploader/)

## Integration notes

Please, read [File Uploader documentation](https://uploadcare.com/docs/file-uploader/) first.

It is easy to use Blocks in React app, because they are native to the Web. 
However, you need to understand that they are not native to React.

So, if you integrate Blocks with React, you need to decide which part of your solution will encapsulate non-React code.

In this example we have created [FileUploader](./src/FileUploader/FileUploader.tsx) component 
which provides React-friendly API for the rest of the app. There are Blocks inside of this component and nowhere else.

### Installation

All you need to do is to install [`@uploadcare/blocks`](https://www.npmjs.com/package/@uploadcare/blocks) from npm
via your favorite Node package manager.

The package provides TypeScript types, so you do not need to install `@types/anything` if you need a proper typing.

[Read more about installation]((https://uploadcare.com/docs/file-uploader/installation/)) in the File Uploader documentation.

### Non-React things you should know about

The most common way to “communicate” with File Uploader written via Blocks is by [events](https://uploadcare.com/docs/file-uploader/data-and-events/).
You will find them in the example. This may not be the way React apps live nowadays, but it's easy to handle using 
hooks like [`useEffect`](https://react.dev/reference/react/useEffect).

Another one thing to note is the attributes. 
Please note, some attributes required by Blocks are kebab-cased, not camelCased as usual for React world.

Plus, due to the fact that Blocks are native to Web, we use `class` attribute instead of `className`.

Finally, you are able to invoke [[some methods of File Uploader](https://uploadcare.com/docs/file-uploader/api/) 
to control its behavior. This is also non common to React world, but feel free to use them if you need.

### Styling

If your styling solution may provide class string or style object, feel free to use them on blocks like 
`lr-file-uploader-regular` and override default class using CSS variables.

Otherwise you may go “full override” way and pass a string with styles to a File Uploader type of your choice.

[Read more about styling](https://uploadcare.com/docs/file-uploader/styling/) in the File Uploader docs.
