import { useState, useCallback, useRef, useEffect } from "react";
import * as UC from "@uploadcare/uc-blocks";

// Order of css imports is important. User styles should be loaded after the main theme
// Or config selector should be more specific.
import "@uploadcare/uc-blocks/web/uc-basic.min.css";
import st from "./App.module.css";

UC.registerBlocks(UC);

function App() {
  let dataOutputRef = useRef();
  const [files, setFiles] = useState([]);
  const handleUploaderEvent = useCallback((e) => {
    const { data } = e.detail;
    setFiles(data);
  }, []);

  useEffect(() => {
    let el = dataOutputRef.current;
    el.addEventListener("data-output", handleUploaderEvent);
    return () => {
      el.removeEventListener("data-output", handleUploaderEvent);
    };
  }, [handleUploaderEvent]);

  const classNames = ["uc-wgt-common", st.uploaderCfg].join(" ");

  return (
    <div className={st.wrapper}>
      <uc-file-uploader-regular class={classNames}></uc-file-uploader-regular>

      <uc-data-output
        ref={dataOutputRef}
        fire-event
        class={classNames}
        onEvent={handleUploaderEvent}
      ></uc-data-output>

      <div className={st.output}>
        {files.map((file) => (
          <img
            key={file.uuid}
            src={`https://ucarecdn.com/${file.uuid}/-/preview/-/scale_crop/400x400/`}
            width="200"
            alt="Preview"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
