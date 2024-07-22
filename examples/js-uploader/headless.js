import * as UC from "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.js";
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css";
import "./styles.css";

UC.registerBlocks(UC);

const providerNode = document.getElementById("my-uploader-provider");
const previewsNode = document.getElementById("previews");
const customButtonNode = document.getElementById("custom-button");

/*
  Note: Here we use provider's API to init flow File Uploader state.
  We use it here to show users how to use headless mode and work with File Uploader.

  See more: https://uploadcare.com/docs/file-uploader/api/
 */
const api = providerNode.getAPI()
const initFlow = () => api.initFlow();
customButtonNode.addEventListener("click", initFlow);

/*
  Note: Event binding is the main way to get data and other info from File Uploader.
  There plenty of events you may use.

  See more: https://uploadcare.com/docs/file-uploader/events/
 */
providerNode.addEventListener("change", handleChangeEvent);

function handleChangeEvent(e) {
  console.log("change event payload:", e);

  renderFiles(e.detail.allEntries.filter((f) => f.status === "success"));
}

function renderFiles(files) {
  const renderedFiles = files.map((file) => {
    const fileNode = document.createElement("div");
    fileNode.setAttribute("class", "preview-wrapper");

    const imgNode = document.createElement("img");
    imgNode.setAttribute("class", "preview-image");
    imgNode.setAttribute("src", file.cdnUrl + "/-/preview/-/resize/x400/");
    imgNode.setAttribute("width", "200");
    imgNode.setAttribute("height", "200");
    imgNode.setAttribute("alt", file.fileInfo.originalFilename);
    imgNode.setAttribute("title", file.fileInfo.originalFilename);

    const imgNameNode = document.createElement("p");
    imgNameNode.setAttribute("class", "preview-data");
    imgNameNode.textContent = `${file.fileInfo.originalFilename}`;

    const imgSizeNode = document.createElement("p");
    imgSizeNode.setAttribute("class", "preview-data");
    imgSizeNode.textContent = `${formatSize(file.fileInfo.size)}`;

    fileNode.append(imgNode, imgNameNode, imgSizeNode);

    return fileNode;
  });

  previewsNode.replaceChildren(...renderedFiles);
}

function formatSize(bytes) {
  if (!bytes) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
