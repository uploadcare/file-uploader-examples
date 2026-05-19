import type { OutputCollectionState, OutputFileEntry } from '@uploadcare/react-uploader';

import { FileUploaderRegular as FileUploaderRegularBase } from '@uploadcare/react-uploader';
import type React from 'react';
import { useState } from 'react';
import '@uploadcare/react-uploader/core.css';

import { unsplashPlugin } from '../../components/Unsplash/unsplashPlugin';
import st from './RegularView.module.css';

/*
  The adapter typings don't yet surface custom config props registered by
  plugins (`unsplashAccessKey` here), so we widen the component type locally.
 */
const FileUploaderRegular = FileUploaderRegularBase as React.ComponentType<
  React.ComponentProps<typeof FileUploaderRegularBase> & {
    unsplashAccessKey?: string;
  }
>;

type UploadError = { name: string; message: string };

export default function RegularView() {
  const [files, setFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const [errors, setErrors] = useState<UploadError[]>([]);

  // The adapter exposes `onChange` instead of the raw `change` event.
  // The collection delivers all entries on every transition, so we re-derive
  // both successful and failed entries on each call.
  // Events docs: https://uploadcare.com/docs/file-uploader/events/
  const handleChangeEvent = (collection: OutputCollectionState) => {
    setFiles(
      collection.allEntries.filter((f) => f.status === 'success') as OutputFileEntry<'success'>[],
    );
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
    <div>
      <FileUploaderRegular
        onChange={handleChangeEvent}
        pubkey="a6ca334c3520777c0045"
        sourceList="local, url, camera, dropbox, unsplash"
        // Custom Unsplash source plugin.
        // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
        plugins={[unsplashPlugin]}
        unsplashAccessKey={import.meta.env.VITE_UNSPLASH_ACCESS_KEY}
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

function formatSize(bytes: number | null) {
  if (!bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
