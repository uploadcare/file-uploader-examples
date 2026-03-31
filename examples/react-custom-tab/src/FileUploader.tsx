import * as LR from "@uploadcare/blocks";
import "@uploadcare/blocks/web/lr-file-uploader-regular.min.css";
import st from "./FileUploader.module.css";
import { MyCustomActivity } from "./MyCustomActivity";
import { useEffect, useRef } from "react";

class MyCustomSourceBtn extends LR.SourceBtn {
  initTypes() {
    super.initTypes();
    this.registerType({
      type: "my-custom-source-type",
      activity: "my-custom-activity",
      icon: "my-custom-icon",
    });
  }
}

class MyCustomFileUploaderRegular extends LR.FileUploaderRegular {}
MyCustomFileUploaderRegular.template = /* HTML */ `
  <lr-simple-btn></lr-simple-btn>

  <lr-modal strokes block-body-scrolling>
    <lr-start-from>
      <lr-drop-area with-icon clickable></lr-drop-area>
      <lr-source-list wrap></lr-source-list>
      <button
        type="button"
        l10n="start-from-cancel"
        class="secondary-btn"
        set="onclick: *historyBack"
      ></button>
      <lr-copyright></lr-copyright>
    </lr-start-from>
    <lr-upload-list></lr-upload-list>
    <lr-camera-source></lr-camera-source>
    <lr-url-source></lr-url-source>
    <lr-external-source></lr-external-source>
    <lr-cloud-image-editor-activity></lr-cloud-image-editor-activity>
    <lr-my-custom-activity></lr-my-custom-activity>
  </lr-modal>

  <lr-progress-bar-common></lr-progress-bar-common>
`;

LR.registerBlocks({
  ...LR,
  MyCustomActivity,
  SourceBtn: MyCustomSourceBtn,
  FileUploaderRegular: MyCustomFileUploaderRegular,
});

export function FileUploader() {
  const configRef = useRef<InstanceType<typeof LR.Config>>(null);

  useEffect(() => {
    if(!configRef.current) return

    configRef.current.localeDefinitionOverride = {
      en: {
        "src-type-my-custom-source-type": "My custom source type",
      }
    }
  })

  return (
    <div className={st.wrapper}>
      <lr-config
      ref={configRef}
        ctx-name="my-uploader"
        pubkey="demopublickey"
        sourceList="local, my-custom-source-type"
      ></lr-config>
      <lr-upload-ctx-provider ctx-name="my-uploader"></lr-upload-ctx-provider>
      <lr-file-uploader-regular ctx-name="my-uploader"></lr-file-uploader-regular>
    </div>
  );
}
