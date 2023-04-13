import { useState, useCallback, useRef, useEffect } from "react";
import * as LR from "@uploadcare/blocks";
import st from "./App.module.css";
import { PACKAGE_VERSION } from "@uploadcare/blocks/env";

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

  useEffect(() => {
    const el = dataOutputRef.current;

    // TODO: Augment global custom event types
    el?.addEventListener(
      "lr-data-output",
      handleUploaderEvent as EventListenerOrEventListenerObject
    );
    return () => {
      el?.removeEventListener(
        "lr-data-output",
        handleUploaderEvent as EventListenerOrEventListenerObject
      );
    };
  }, [handleUploaderEvent]);

  return (
    <div className={st.wrapper}>
      <lr-file-uploader-regular
        class={st.uploaderCfg}
        css-src={`https://unpkg.com/@uploadcare/blocks@${PACKAGE_VERSION}/web/file-uploader-regular.min.css`}
      >
        <lr-data-output
          ref={dataOutputRef}
          use-event
          hidden
          class={st.uploaderCfg}
          onEvent={handleUploaderEvent}
        ></lr-data-output>
      </lr-file-uploader-regular>

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
