import { useState, useCallback, useRef, useEffect } from "react";
import * as LR from "@uploadcare/uc-blocks";

/*
 * Order of css imports is important. User styles should be loaded after the main theme
 * Or config selector should be more specific.
 *
 * Use minified version because codesandbox can't bundle raw css with relative imports.
 * It's better to use '@uploadcare/uc-blocks/blocks/themes/lr-basic/index.css' instead
 */
import "@uploadcare/uc-blocks/web/lr-basic.min.css";
import st from "./App.module.css";

LR.registerBlocks(LR);

function App() {
  const outputRef = useRef();
  const handleUploaderEvent = useCallback((e) => {
      console.log('event', e);
  }, []);

  useEffect(() => {
    let el = outputRef.current;
      el.addEventListener("lr-data-output", handleUploaderEvent);
    return () => {
      el.removeEventListener("lr-data-output", handleUploaderEvent);
    };
  }, [handleUploaderEvent]);

  const classNames = ["lr-wgt-common", st.uploaderCfg, st.wrapper].join(" ");
  const onClick = () => {
      console.log('open modal', outputRef)
      outputRef.current.initFlow()
  }
  const ctxName = 'my-context'

  // 1) not working with force ctx-name to each element
  // 2) modal opened, but uploads not working, also tab-list not clickable
  return (
    <div className={classNames}>
        <button className={st.button} onClick={onClick}>upload</button>
        <lr-modal ctx-name={ctxName}>
            <lr-activity-icon slot='heading' />
            <lr-activity-caption slot='heading' />
            <lr-start-from ctx-name={ctxName}>
                <lr-source-list />
                <lr-drop-area />
            </lr-start-from>
            <lr-upload-list ctx-name={ctxName} />
            <lr-camera-source ctx-name={ctxName} />
            <lr-url-source ctx-name={ctxName} />
            <lr-external-source ctx-name={ctxName} />
            <lr-upload-details ctx-name={ctxName} />
            <lr-confirmation-dialog ctx-name={ctxName} />
            <lr-cloud-image-editor ctx-name={ctxName} />
        </lr-modal>
    
        <lr-message-box ctx-name={ctxName} />
        <lr-progress-bar ctx-name={ctxName} />

      <lr-data-output
        ref={outputRef}
        use-event
        class={classNames}
        ctx-name={ctxName}
      ></lr-data-output>
    </div>
  );
}

export default App;
