import { useState, useCallback, useRef, useEffect } from "react";
import * as LR from "@uploadcare/blocks";
import st from "./App.module.css";
import { PACKAGE_VERSION } from "@uploadcare/blocks";

LR.registerBlocks(LR);

function App() {
  const dataOutputRef = useRef<LR.DataOutput>();
  // TODO: We need to export all data output types
  const [files, setFiles] = useState<any[]>([]);

  // TODO: We need to export all the event types
  const handleUploaderEvent = useCallback((e: CustomEvent<any>) => {
    const { data } = e.detail;
    setFiles(data);
  }, []);

  return (
    <div className={st.wrapper}>
      <lr-config
        ctx-name="my-uploader"
        pubkey="demopublickey"
        multiple={true}
        confirm-upload={true}
        source-list="local, url, camera, dropbox, gdrive"
        multiple-max={10}
      ></lr-config>

      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src={`https://unpkg.com/@uploadcare/blocks@${PACKAGE_VERSION}/web/file-uploader-regular.min.css`}
      ></lr-file-uploader-regular>

      <lr-data-output
        ctx-name="my-uploader"
        ref={dataOutputRef}
        use-event
        hidden
        class={st.uploaderCfg}
        onEvent={handleUploaderEvent}
      ></lr-data-output>

      <div className={st.output}>
        {files.map((file) => (
          <img
            key={file.uuid}
            src={`https://ucarecdn.com/${file.uuid}/${
              file.cdnUrlModifiers || ""
            }-/preview/-/scale_crop/400x400/`}
            width="200"
            alt="Preview"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
