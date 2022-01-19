import "./App.css";
import { useState } from "react";
import "@uploadcare/upload-blocks/build/uc-basic.css";
import "@uploadcare/upload-blocks";

function cssOptions(options) {
  let result = {};
  for (let [key, value] of Object.entries(options)) {
    let kebabKey = key
      .split("")
      .map((char) =>
        char.toUpperCase() === char ? `-${char.toLowerCase()}` : char
      )
      .join("");

    result[`--ctx-${kebabKey}`] = typeof value === "string" ? `"value"` : value;
  }
  return result;
}

function App() {
  const [files, setFiles] = useState([]);
  const handleUploaderEvent = (e) => {
    const { data } = e.detail;
    setFiles(data);
  };
  const options = cssOptions({
    name: "my-uploader",
    pubkey: "demopublickey",
    multiple: 1,
    confirmUpload: 1,
    imgOnly: 0,
    accept: "",
    store: 1,
    cameraMirror: 0,
    sourceList: "local, url, camera, draw, dropbox, gdrive, facebook",
    maxFiles: 10,
  });

  return (
    <div className="wrapper">
      <div style={options}>
        <uc-simple-btn class="uc-wgt-common"></uc-simple-btn>

        <uc-modal strokes class="uc-wgt-common">
          <uc-activity-icon slot="heading"></uc-activity-icon>
          <uc-activity-caption slot="heading"></uc-activity-caption>
          <uc-start-from>
            <uc-source-list wrap></uc-source-list>
            <uc-drop-area></uc-drop-area>
          </uc-start-from>
          <uc-upload-list></uc-upload-list>
          <uc-camera-source></uc-camera-source>
          <uc-url-source></uc-url-source>
          <uc-external-source></uc-external-source>
          <uc-upload-details></uc-upload-details>
          <uc-confirmation-dialog></uc-confirmation-dialog>
        </uc-modal>

        <uc-message-box class="uc-wgt-common"></uc-message-box>
        <uc-progress-bar class="uc-wgt-common"></uc-progress-bar>

        <uc-data-output
          fire-event
          class="uc-wgt-common"
          onDataOutput={handleUploaderEvent}
        ></uc-data-output>
      </div>
      <div className="output">
        {files.map((file) => (
          <img
            key={file.uuid}
            src={`https://ucarecdn.com/${file.uuid}/-/preview/-/scale_crop/400x400/`}
            width="200"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
