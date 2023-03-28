import * as LR from "@uploadcare/blocks";
import { CustomFileUploader } from "./CustomFileUploader.js";
import { CustomSourceBtn } from "./CustomSourceBtn.js";
import { UnsplashSource } from "./UnsplashSource.js";

LR.registerBlocks({
  ...LR,
  CustomFileUploader,
  UnsplashSource,
  SourceBtn: CustomSourceBtn,
});

const app = document.querySelector("#app");

const uploader = document.createElement("lr-custom-file-uploader");
if (!import.meta.env.VITE_UNSPLASH_TOKEN) {
  throw new Error("VITE_UNSPLASH_TOKEN is not defined");
}
uploader.style.setProperty(
  "--cfg-unsplash-token",
  `"${import.meta.env.VITE_UNSPLASH_TOKEN}"`
);
app.appendChild(uploader);
