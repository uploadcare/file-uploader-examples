import { FileUploaderRegular } from "@uploadcare/file-uploader";

export class CustomFileUploader extends FileUploaderRegular {}
CustomFileUploader.template = /* HTML */ `
  <uc-simple-btn set="@hidden: isHidden"></uc-simple-btn>

  <uc-modal id="start-from" strokes block-body-scrolling>
    <uc-start-from>
      <uc-drop-area with-icon clickable></uc-drop-area>
      <uc-source-list role="list" wrap></uc-source-list>
      <button type="button" l10n="start-from-cancel" class="uc-secondary-btn" set="onclick: *historyBack"></button>
      <uc-copyright></uc-copyright>
    </uc-start-from>
  </uc-modal>

  <uc-modal id="upload-list" strokes block-body-scrolling>
    <uc-upload-list></uc-upload-list>
  </uc-modal>
  
  <uc-modal id="unsplash" strokes block-body-scrolling>
    <uc-unsplash-source token="${import.meta.env.VITE_UNSPLASH_TOKEN}"></uc-unsplash-source>
  </uc-modal>
`;
