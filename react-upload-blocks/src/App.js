import { useState } from "react";
import "@uploadcare/uploader/build/regular/uc-uploader.css";
import "@uploadcare/uploader/build/regular/uc-uploader.min.js";
import st from "./App.module.css";
// Order of css imports is important. User styles should be loaded after the main theme
// Or config selector should be more specific.

function App() {
  const [files, setFiles] = useState([]);
  const handleUploaderEvent = (e) => {
    const { data } = e.detail;
    setFiles(data);
  };
  const uploaderClassList = ["uc-wgt-common", st.uploaderCfg].join(" ");

  return (
    <div className={st.wrapper}>
      <uc-uploader class={uploaderClassList}></uc-uploader>

      <uc-data-output
        fire-event
        class={uploaderClassList}
        onDataOutput={handleUploaderEvent}
      ></uc-data-output>

      <div className={st.output}>
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
