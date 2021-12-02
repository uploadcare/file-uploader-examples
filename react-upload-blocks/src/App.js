import "./App.css";
import { useState } from "react";
import "./upload-blocks/uc-basic.css";
import "./upload-blocks/upload-blocks.js";

function App() {
  const [files, setFiles] = useState([]);
  const handleUploaderEvent = (e) => {
    const { data } = e.detail;
    setFiles(data);
  };
  return (
    <div className="wrapper">
      <div className="uploader">
        <uc-simple-btn className="uc-wgt-common"></uc-simple-btn>

        <uc-modal className="uc-wgt-common" strokes>
          <uc-source-select>
            <uc-source-list wrap></uc-source-list>
            <uc-drop-area></uc-drop-area>
          </uc-source-select>
          <uc-upload-list></uc-upload-list>
          <uc-camera-source></uc-camera-source>
          <uc-url-source></uc-url-source>
          <uc-external-source></uc-external-source>
          <uc-upload-details></uc-upload-details>
          <uc-confirmation-dialog></uc-confirmation-dialog>
          <uc-cloud-image-editor></uc-cloud-image-editor>
        </uc-modal>

        <uc-message-box className="uc-wgt-common"></uc-message-box>
        <uc-progress-bar className="uc-wgt-common"></uc-progress-bar>

        <uc-data-output
          fire-event
          className="uc-wgt-common"
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
