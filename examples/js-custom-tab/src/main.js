import * as UC from "@uploadcare/file-uploader";
import { CustomFileUploader } from "./CustomFileUploader.js";
import { CustomSourceBtn } from "./CustomSourceBtn.js";
import { UnsplashSource } from "./UnsplashSource.js";
import './style.css';

UC.defineComponents({
  ...UC,
  CustomFileUploader,
  UnsplashSource,
  SourceBtn: CustomSourceBtn,
});

if (!import.meta.env.VITE_UNSPLASH_TOKEN) {
  throw new Error("VITE_UNSPLASH_TOKEN is not defined");
}