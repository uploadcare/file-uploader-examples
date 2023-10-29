import React, { useCallback, useEffect, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import { OutputFileEntry } from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

import st from './FileUploader.module.scss';
import cssOverrides from './FileUploader.overrides.css?inline';
import cs from 'classnames';

/*
  Note: File Uploader styles are scoped due to ShadowDOM usage.
  There are two ways to override them. One way is used on the line below,
  another one is to set a custom class to File Uploader,
  and use CSS variables to update styles.

  See more: https://uploadcare.com/docs/file-uploader/styling/
 */
LR.FileUploaderRegular.shadowStyles = cssOverrides;

LR.registerBlocks(LR);

type FileUploaderProps = {
  uploaderClassName: string;
  files: OutputFileEntry[];
  onChange: (files: OutputFileEntry[]) => void;
  theme: 'light' | 'dark';
}

export default function FileUploader({ files, uploaderClassName, onChange, theme }: FileUploaderProps) {
  /*
    Note: Here we use a counter to reset File Uploader state.
    It's not necessary though. We use it here to show users
    a fresh version of File Uploader every time they open it.

    Another way is to sync File Uploader state with an external store.
    You can manipulate File Uploader using API calls like `addFileFromObject`, etc.

    See more: https://uploadcare.com/docs/file-uploader/api/
   */
  const [resetCounter, setResetCounter] = useState(0);

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry['uuid']) => onChange(files.filter(f => f.uuid !== uuid)),
    [files, onChange],
  );

  useEffect(() => {
    const resetUploaderState = () => setResetCounter(v => v + 1);

    const handleUploadEvent = (e: CustomEvent<{ data: OutputFileEntry[] }>) => {
      if (e.detail?.data) {
        const newUploadedFiles = e.detail.data.filter(file => file.isUploaded && !files.find(f => f.uuid === file.uuid));
        onChange([...files, ...newUploadedFiles]);
      }
    };

    const handleDoneFlow = () => {
      resetUploaderState();
    };

    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/data-and-events/#events
     */
    window.addEventListener('LR_DATA_OUTPUT', handleUploadEvent);
    window.addEventListener('LR_DONE_FLOW', handleDoneFlow);

    return () => {
      window.removeEventListener('LR_DATA_OUTPUT', handleUploadEvent);
      window.removeEventListener('LR_DONE_FLOW', handleDoneFlow);
    };
  }, [files, onChange]);


  return (
    <div className={st.root}>
      <React.Fragment key={resetCounter}>
        {/*
           Note: `lr-config` is the main block we use to configure File Uploader.
           It's important to all the context-related blocks to have the same `ctx-name` attribute.

           See more: https://uploadcare.com/docs/file-uploader/configuration/
           Available options: https://uploadcare.com/docs/file-uploader/options/

           Also note: Some options currently are not available via `lr-config`,
           but may be set via CSS properties. E.g. `darkmode`.

           Here they are: https://github.com/uploadcare/blocks/blob/main/blocks/themes/lr-basic/config.css
        */}
        <lr-config
          ctx-name={`uploader-ctx-${resetCounter}`}
          pubkey="demopublickey"
          multiple={true}
          sourceList="local, url, camera, dropbox, gdrive"
          confirmUpload={false}
          removeCopyright={true}
          imgOnly={true}
        ></lr-config>

        <lr-file-uploader-regular
          ctx-name={`uploader-ctx-${resetCounter}`}
          css-src={blocksStyles}
          class={cs(uploaderClassName, { [st.darkModeEnabled]: theme === 'dark' })}
        ></lr-file-uploader-regular>
      </React.Fragment>

      <div className={st.previews}>
        {files.map((file) => (
          <div key={file.uuid} className={st.preview}>
            <img
              className={st.previewImage}
              key={file.uuid}
              src={`https://ucarecdn.com/${file.uuid}/-/preview/-/resize/x200/`}
              width="100"
              alt={file.originalFilename || ''}
              title={file.originalFilename || ''}
            />

            <button
              className={st.previewRemoveButton}
              type="button"
              onClick={() => handleRemoveClick(file.uuid)}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
