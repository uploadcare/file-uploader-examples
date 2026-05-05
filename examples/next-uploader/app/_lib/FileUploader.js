'use client';

import * as UC from '@uploadcare/file-uploader';
import { useCallback, useEffect, useRef, useState } from 'react';

import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';

import { unsplashPlugin } from '../regular/unsplashPlugin.js';
import st from './FileUploader.module.css';

UC.defineComponents(UC);

const PHOTO_LOCALE = {
  en: {
    photo__one: 'photo',
    photo__many: 'photos',
    photo__other: 'photos',

    'upload-file': 'Upload photo',
    'upload-files': 'Upload photos',
    'choose-file': 'Choose photo',
    'choose-files': 'Choose photos',
    'drop-files-here': 'Drop photos here',
    'select-file-source': 'Select photo source',
    'edit-image': 'Edit photo',
    'no-files': 'No photos selected',
    'caption-edit-file': 'Edit photo',
    'files-count-allowed': 'Only {{count}} {{plural:photo(count)}} allowed',
    'files-max-size-limit-error': 'Photo is too big. Max photo size is {{maxFileSize}}.',
    'header-uploading': 'Uploading {{count}} {{plural:photo(count)}}',
    'header-succeed': '{{count}} {{plural:photo(count)}} uploaded',
    'header-total': '{{count}} {{plural:photo(count)}} selected',
  },
};

export default function FileUploader({ uploaderCtxName, files, onChange, theme }) {
  const [isClient, setIsClient] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const ctxProviderRef = useRef(null);
  const configRef = useRef(null);

  // The uc-* custom elements register themselves on mount and rewrite their
  // own attributes / shadow DOM, which doesn't survive React hydration —
  // gate them on isClient so they only ever render in the browser.
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const config = configRef.current;
    if (!config) return;

    // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    config.plugins = [unsplashPlugin];
    config.unsplashAccessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  }, [isClient]);

  const handleRemoveClick = useCallback(
    (uuid) => onChange(files.filter((f) => f.uuid !== uuid)),
    [files, onChange],
  );

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    // Mirrors the latest `change` event so we can read the staged uploads
    // when committing on `modal-close`.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    const handleChangeEvent = (e) => {
      setUploadedFiles([...e.detail.allEntries.filter((f) => f.status === 'success')]);
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
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const config = configRef.current;
    if (!config) return;

    // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
    config.localeDefinitionOverride = PHOTO_LOCALE;
    return () => {
      config.localeDefinitionOverride = null;
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const resetUploaderState = () => {
      const api = ctxProvider.getAPI();
      api.setCurrentActivity(null);
      api.setModalState(false);
      api.removeAllFiles();
    };

    const handleModalCloseEvent = () => {
      /*
        Only commit and reset when there is at least one successful
        upload. Otherwise (modal closed without finishing or all uploads
        failed) we keep whatever in-progress / errored entries the
        uploader has so the user can retry on next open.
       */
      if (uploadedFiles.length === 0) return;

      onChange([...files, ...uploadedFiles]);
      setUploadedFiles([]);
      resetUploaderState();
    };

    ctxProvider.addEventListener('modal-close', handleModalCloseEvent);
    return () => {
      ctxProvider.removeEventListener('modal-close', handleModalCloseEvent);
    };
  }, [isClient, files, onChange, uploadedFiles]);

  return (
    <div className={st.root}>
      {isClient && (
        <>
          <uc-config
            ref={configRef}
            ctx-name={uploaderCtxName}
            pubkey="a6ca334c3520777c0045"
            multiple={true}
            sourceList="local, url, camera, dropbox, gdrive, unsplash"
            confirmUpload={false}
            removeCopyright={true}
            imgOnly={true}
          ></uc-config>

          <uc-file-uploader-regular
            ctx-name={uploaderCtxName}
            class={`${st.uploader} uc-${theme}`}
          ></uc-file-uploader-regular>

          <uc-upload-ctx-provider ref={ctxProviderRef} ctx-name={uploaderCtxName} />
        </>
      )}

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
          <div key={file.uuid} className={st.preview}>
            <img
              className={st.previewImage}
              src={`${file.cdnUrl}/-/preview/-/resize/x200/`}
              width="100"
              alt={file.fileInfo?.originalFilename || ''}
              title={file.fileInfo?.originalFilename || ''}
            />
            <button
              className={st.previewRemoveButton}
              type="button"
              onClick={() => handleRemoveClick(file.uuid)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
