import "./App.css";
import { useState } from "react";
import "@uploadcare/uploader/build/regular/uc-uploader.css";
import "@uploadcare/uploader/build/regular/uc-uploader.min.js";

function App() {
  const [files, setFiles] = useState([]);
  const handleUploaderEvent = (e) => {
    const { data } = e.detail;
    setFiles(data);
  };
  return (
    <div className="wrapper">
      <div className="uploader">
        <uc-uploader class="uc-wgt-common"></uc-uploader>

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
