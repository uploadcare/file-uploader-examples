import * as LR from "@uploadcare/blocks";
import { CustomFileUploader } from "./CustomFileUploader.js";
import { CustomSourceBtn } from "./CustomSourceBtn.js";
import { UnsplashSource } from "./UnsplashSource.js";
import cssSrc from './style.css?url';

LR.registerBlocks({
  ...LR,
  CustomFileUploader,
  UnsplashSource,
  SourceBtn: CustomSourceBtn,
});

const uploader = document.querySelector("lr-custom-file-uploader");
uploader.setAttribute('css-src', cssSrc);
if (!import.meta.env.VITE_UNSPLASH_TOKEN) {
  throw new Error("VITE_UNSPLASH_TOKEN is not defined");
}

// TODO: move to lr-config also
uploader.style.setProperty(
  "--cfg-unsplash-token",
  `"${import.meta.env.VITE_UNSPLASH_TOKEN}"`
);
