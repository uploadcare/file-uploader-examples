import * as LR from '@uploadcare/blocks';
import React, { useEffect, useRef, useState } from 'react';

import '@uploadcare/blocks/web/lr-file-uploader-regular.min.css';
import st from './styles.module.css';

LR.registerBlocks(LR);

function Regular() {
  const [isClient, setIsClient] = useState(false)
  const [files, setFiles] = useState([]);
  const ctxProviderRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e) => {
      console.log('change event payload:', e);

      setFiles([...e.detail.allEntries.filter(f => f.status === 'success')]);
    };

    /*
      Note: Event binding is the main way to get data and other info from File Uploader.
      There plenty of events you may use.

      See more: https://uploadcare.com/docs/file-uploader/events/
     */
    ctxProvider.addEventListener('change', handleChangeEvent);
    return () => {
      ctxProvider.removeEventListener('change', handleChangeEvent);
    };
  }, [setFiles]);

  return (
    <div className={st.pageWrapper}>
      <p className={st.paragraph}>
        <a href="/" className={st.link}>← All Next.js Examples</a>
      </p>
      <hr className={st.separator}/>

      {isClient && (
        <>
          <lr-config
            ctx-name="my-uploader-2"
            pubkey="a6ca334c3520777c0045"
            sourceList="local, url, camera, dropbox"
          ></lr-config>
          <lr-file-uploader-regular
            ctx-name="my-uploader-2"
            class="uc-light"
          ></lr-file-uploader-regular>
          <lr-upload-ctx-provider
            ctx-name="my-uploader-2"
            ref={ctxProviderRef}
          ></lr-upload-ctx-provider>
        </>
      )}

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

export default Regular;

function formatSize(bytes) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
