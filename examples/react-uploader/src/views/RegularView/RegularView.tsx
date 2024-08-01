import React, { useEffect, useRef, useState } from 'react';

import * as UC from '@uploadcare/file-uploader';
import { OutputFileEntry } from '@uploadcare/file-uploader';

import st from './RegularView.module.css';

UC.defineComponents(UC);

export default function RegularView() {
  const [files, setFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const ctxProviderRef = useRef<InstanceType<UC.UploadCtxProvider>>(null);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e: UC.EventMap['change']) => {
      console.log('change event payload:', e);

      setFiles([...e.detail.allEntries.filter(f => f.status === 'success')] as OutputFileEntry<'success'>[]);
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
    <div>
      <uc-config
        ctx-name="my-uploader-3"
        pubkey="a6ca334c3520777c0045"
        sourceList="local, url, camera, dropbox"
      ></uc-config>
      <uc-file-uploader-regular
        ctx-name="my-uploader-3"
      ></uc-file-uploader-regular>
      <uc-upload-ctx-provider
        ctx-name="my-uploader-3"
        ref={ctxProviderRef}
      ></uc-upload-ctx-provider>

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
