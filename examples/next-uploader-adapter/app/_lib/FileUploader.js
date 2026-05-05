'use client';

import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import { useCallback, useRef, useState } from 'react';
import '@uploadcare/react-uploader/core.css';

import { unsplashPlugin } from '../regular/unsplashPlugin.js';
import st from './FileUploader.module.css';

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

export default function FileUploader({ files, onChange, theme }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const ctxProviderRef = useRef(null);

  const handleRemoveClick = useCallback(
    (uuid) => onChange(files.filter((f) => f.uuid !== uuid)),
    [files, onChange],
  );

  // Mirrors the latest `change` event so we can read the staged uploads
  // when committing on `modal-close`.
  // Events docs: https://uploadcare.com/docs/file-uploader/events/
  const handleChangeEvent = (collection) => {
    setUploadedFiles([...collection.allEntries.filter((f) => f.status === 'success')]);
    setErrors(
      collection.allEntries
        .filter((f) => f.status === 'failed')
        .map((f) => ({
          name: f.fileInfo?.originalFilename ?? f.externalUrl ?? 'File',
          message: f.errors?.[0]?.message ?? 'Upload failed',
        })),
    );
  };

  const handleModalCloseEvent = () => {
    /*
      Only commit and reset when there is at least one successful upload.
      Otherwise (modal closed without finishing or all uploads failed)
      keep whatever in-progress / errored entries the uploader has so the
      user can retry on next open.
     */
    if (uploadedFiles.length === 0) return;

    onChange([...files, ...uploadedFiles]);
    setUploadedFiles([]);

    const api = ctxProviderRef.current?.getAPI();
    api?.setCurrentActivity(null);
    api?.setModalState(false);
    api?.removeAllFiles();
  };

  return (
    <div>
      <FileUploaderRegular
        // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
        imgOnly
        multiple
        removeCopyright
        confirmUpload={false}
        // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
        localeDefinitionOverride={PHOTO_LOCALE}
        apiRef={ctxProviderRef}
        onModalClose={handleModalCloseEvent}
        onChange={handleChangeEvent}
        pubkey="a6ca334c3520777c0045"
        sourceList="local, url, camera, dropbox, gdrive, unsplash"
        plugins={[unsplashPlugin]}
        unsplashAccessKey={process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}
        classNameUploader={`${st.uploader} uc-${theme}`}
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
