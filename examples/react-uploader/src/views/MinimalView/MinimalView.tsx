import type { OutputFileEntry } from '@uploadcare/file-uploader';

import * as UC from '@uploadcare/file-uploader';
import { useEffect, useRef, useState } from 'react';

import { useUnsplashPlugin } from '../../components/Unsplash/useUnsplashPlugin';
import st from './MinimalView.module.css';

UC.defineComponents(UC);

type UploadError = { name: string; message: string };

export default function MinimalView() {
  const [files, setFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const ctxProviderRef = useRef<UC.UploadCtxProvider>(null);
  const configRef = useUnsplashPlugin();

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    // Listen for upload-collection updates. The `change` event delivers the
    // full collection on every transition, so we re-derive both successful
    // and failed entries on each call.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    const handleChangeEvent = (e: UC.EventMap['change']) => {
      setFiles([
        ...e.detail.allEntries.filter((f) => f.status === 'success'),
      ] as OutputFileEntry<'success'>[]);
      setErrors(
        e.detail.allEntries
          .filter((f) => f.status === 'failed')
          .map((f) => ({
            name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
            message: f.errors?.[0]?.message ?? 'Upload failed',
          })),
      );
    };

    ctxProvider.addEventListener('change', handleChangeEvent);
    return () => {
      ctxProvider.removeEventListener('change', handleChangeEvent);
    };
  }, []);

  return (
    <div>
      <uc-config
        ref={configRef}
        ctx-name="my-uploader-2"
        pubkey="a6ca334c3520777c0045"
        sourceList="local, url, camera, dropbox, unsplash"
      ></uc-config>
      <uc-file-uploader-minimal ctx-name="my-uploader-2"></uc-file-uploader-minimal>
      <uc-upload-ctx-provider
        ctx-name="my-uploader-2"
        ref={ctxProviderRef}
      ></uc-upload-ctx-provider>

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
