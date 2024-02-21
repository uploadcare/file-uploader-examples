import React, { useEffect, useRef, useState } from 'react';

import * as LR from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-minimal.min.css?url';
import { OutputFileEntry } from '@uploadcare/blocks';

import st from './MinimalView.module.css';

LR.registerBlocks(LR);

export default function MinimalView() {
  const [files, setFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const ctxProviderRef = useRef<InstanceType<LR.UploadCtxProvider>>(null);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (e: LR.EventMap['change']) => {
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
      <lr-config
        ctx-name="my-uploader"
        pubkey="2b7f257e8ea0817ba746"
      ></lr-config>
      <lr-file-uploader-minimal
        ctx-name="my-uploader"
        css-src={blocksStyles}
      ></lr-file-uploader-minimal>
      <lr-upload-ctx-provider
        ctx-name="my-uploader"
        ref={ctxProviderRef}
      ></lr-upload-ctx-provider>

      <div className={st.previews}>
        {files.map((file) => (
          <div key={file.uuid}>
            <img
              className={st.previewImage}
              key={file.uuid}
              src={`${file.cdnUrl}/-/preview/-/resize/x400/`}
              width="200"
              height="200"
              alt={file.fileInfo.originalFilename || ''}
              title={file.fileInfo.originalFilename || ''}
            />

            <span className={st.previewTitle}>
              {file.fileInfo.originalFilename}, {formatSize(file.fileInfo.size)}
            </span>
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
