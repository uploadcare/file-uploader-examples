import { FileUploaderRegular } from "@uploadcare/file-uploader";

export class CustomFileUploader extends FileUploaderRegular {}
CustomFileUploader.template = /* HTML */ `
  <uc-simple-btn></uc-simple-btn>

  <uc-modal strokes block-body-scrolling>
    <uc-start-from>
      <uc-drop-area with-icon clickable></uc-drop-area>
      <uc-source-list wrap></uc-source-list>
      <uc-copyright></uc-copyright>
    </uc-start-from>
    <uc-upload-list></uc-upload-list>
    <uc-camera-source></uc-camera-source>
    <uc-url-source></uc-url-source>
    <uc-external-source></uc-external-source>
    <uc-cloud-image-editor-activity></uc-cloud-image-editor-activity>
    <uc-unsplash-source token="${import.meta.env.VITE_UNSPLASH_TOKEN}"></uc-unsplash-source>
  </uc-modal>

  <uc-message-box></uc-message-box>
  <uc-progress-bar-common></uc-progress-bar-common>
`;
