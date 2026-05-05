'use client';

import { FileUploaderMinimal } from '@uploadcare/react-uploader/next';
import { useState } from 'react';
import '@uploadcare/react-uploader/core.css';

import { unsplashPlugin } from '../regular/unsplashPlugin.js';
import st from '../styles.module.css';

function Page() {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  // The adapter exposes `onChange` instead of the raw `change` event.
  // The collection delivers all entries on every transition, so we re-derive
  // both successful and failed entries on each call.
  // Events docs: https://uploadcare.com/docs/file-uploader/events/
  const handleChangeEvent = (collection) => {
    setFiles([...collection.allEntries.filter((f) => f.status === 'success')]);
    setErrors(
      collection.allEntries
        .filter((f) => f.status === 'failed')
        .map((f) => ({
          name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
          message: f.errors?.[0]?.message ?? 'Upload failed',
        })),
    );
  };

  return (
    <div className={st.pageWrapper}>
      <p className={st.paragraph}>
        <a href="/" className={st.link}>
          ← All Next.js Examples
        </a>
        {' · '}
        <a
          href="https://uploadcare.com/docs/integrations/nextjs-file-uploader/"
          className={st.link}
        >
          Integration docs
        </a>
      </p>
      <hr className={st.separator} />

      <FileUploaderMinimal
        // Register custom Unsplash source plugin.
        // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
        onChange={handleChangeEvent}
        pubkey="a6ca334c3520777c0045"
        sourceList="local, url, camera, dropbox, unsplash"
        plugins={[unsplashPlugin]}
        unsplashAccessKey={process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}
      />

      {errors.length > 0 && (
        <div className={st.errors}>
          {errors.map((err) => (
            <p key={`${err.name}:${err.message}`} className={st.error} role="alert">
              {err.name}: {err.message}
            </p>
          ))}
        </div>
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

            <p className={st.previewData}>{file.fileInfo.originalFilename}</p>
            <p className={st.previewData}>{formatSize(file.fileInfo.size)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;

function formatSize(bytes) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
