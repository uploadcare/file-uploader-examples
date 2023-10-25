import React, { useCallback, useEffect, useState } from 'react';
import * as LR from '@uploadcare/blocks';
import { PACKAGE_VERSION } from '@uploadcare/blocks';

import { File } from '../types';

import st from './FileUploader.module.scss';
import cssOverrides from './FileUploader.overrides.css?inline';
import cs from 'classnames';

LR.FileUploaderRegular.shadowStyles = cssOverrides;

LR.registerBlocks(LR);

type FileUploaderProps = {
  uploaderClassName: string;
  files: File[];
  onChange: (files: File[]) => void;
  maxAllowedFiles: number;
  theme: 'light' | 'dark';
}

export default function FileUploader({ files, uploaderClassName, onChange, maxAllowedFiles, theme }: FileUploaderProps) {
  const [resetCounter, setResetCounter] = useState(0);

  const handleRemoveClick = useCallback(
    (uuid: File['uuid']) => onChange(files.filter(f => f.uuid !== uuid)),
    [files, onChange],
  );

  useEffect(() => {
    const resetUploaderState = () => setResetCounter(v => v + 1);

    const handleUploadEvent = (e: CustomEvent<{ data: File[] }>) => {
      if (e.detail?.data) {
        onChange([...files, ...e.detail.data]);
      }
    };

    const handleDoneFlow = () => {
      resetUploaderState();
    };

    window.addEventListener('LR_DATA_OUTPUT', handleUploadEvent);
    window.addEventListener('LR_DONE_FLOW', handleDoneFlow);

    return () => {
      window.removeEventListener('LR_DATA_OUTPUT', handleUploadEvent);
      window.removeEventListener('LR_DONE_FLOW', handleDoneFlow);
    };
  }, [files, onChange]);

  maxAllowedFiles = maxAllowedFiles - files.length;

  const isMultipleAllowed = maxAllowedFiles > 1;

  return (
    <div className={st.root}>
      <lr-config
        ctx-name={`uploader-ctx-${resetCounter}`}
        pubkey="demopublickey"
        multiple={isMultipleAllowed}
        sourceList="local, url, camera, dropbox, gdrive"
        multipleMax={maxAllowedFiles}
        confirmUpload={false}
        removeCopyright={true}
        imgOnly={true}
      ></lr-config>

      <lr-file-uploader-regular
        ctx-name={`uploader-ctx-${resetCounter}`}
        css-src={`https://unpkg.com/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
        class={cs(uploaderClassName, { [st.darkModeEnabled]: theme === 'dark' })}
      ></lr-file-uploader-regular>

      <div className={st.previews}>
        {files.map((file) => (
          <div key={file.uuid} className={st.preview}>
            <img
              className={st.previewImage}
              key={file.uuid}
              src={`https://ucarecdn.com/${file.uuid}/-/preview/-/resize/x200/`}
              width="100"
              alt={file.originalFilename}
              title={file.originalFilename}
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
