import React, { useState } from 'react';

import st from './styles.module.css';
import { FileUploaderMinimal } from "@uploadcare/react-uploader"
import "@uploadcare/react-uploader/core.css"


function Minimal() {
  const [files, setFiles] = useState([]);

  const handleChangeEvent = (files) => {
    console.log('change event payload:', files);

    setFiles([...files.allEntries.filter(f => f.status === 'success')]);
  };

  return (
    <div className={st.pageWrapper}>
      <p className={st.paragraph}>
        <a href="/" className={st.link}>← All Next.js Examples</a>
      </p>
      <hr className={st.separator} />

      <FileUploaderMinimal onChange={handleChangeEvent} pubkey="a6ca334c3520777c0045" />

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

export default Minimal;

function formatSize(bytes) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
