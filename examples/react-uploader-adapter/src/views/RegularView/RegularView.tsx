import React, { useState } from 'react';

import { FileUploaderRegular } from '@uploadcare/react-uploader';
import { OutputFileEntry } from '@uploadcare/blocks';
import "@uploadcare/react-uploader/core.css"

import st from './RegularView.module.css';


export default function RegularView() {
  const [files, setFiles] = useState<OutputFileEntry<'success'>[]>([]);

  const handleChangeEvent = (files) => {
    console.log('change event payload:', files);

    setFiles([...files.allEntries.filter(f => f.status === 'success')] as OutputFileEntry<'success'>[]);
  };

  return (
    <div>
      <FileUploaderRegular onChange={handleChangeEvent} pubkey="a6ca334c3520777c0045"/>

      <div className={st.previews}>
        {files.map((file) => (
          <div key={file.uuid} className={st.previewWrapper}>
            <img
              className={st.previewImage}
              key={file.uuid}
              src={`${file.cdnUrl}/-/preview/-/resize/x400/`}
              width="200"
              height="200"
              alt={file.fileInfo.originalFilename || ''}
              title={file.fileInfo.originalFilename || ''}
            />

            <p className={st.previewData}>
              {file.fileInfo.originalFilename}
            </p>
            <p className={st.previewData}>
              {formatSize(file.fileInfo.size)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatSize(bytes: number | null) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
