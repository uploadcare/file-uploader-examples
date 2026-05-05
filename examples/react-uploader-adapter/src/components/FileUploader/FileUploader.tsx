import type { OutputCollectionState, OutputFileEntry } from '@uploadcare/react-uploader';
import {
  FileUploaderRegular as FileUploaderRegularBase,
  type UploadCtxProvider,
} from '@uploadcare/react-uploader';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';

import { unsplashPlugin } from '../Unsplash/unsplashPlugin';

const FileUploaderRegular = FileUploaderRegularBase as React.ComponentType<
  React.ComponentProps<typeof FileUploaderRegularBase> & {
    unsplashAccessKey?: string;
  }
>;

import st from './FileUploader.module.css';
import cssOverrides from './FileUploader.overrides.module.css';

type FileUploaderProps = {
  uploaderClassName: string;
  files: OutputFileEntry[];
  onChange: (files: OutputFileEntry[]) => void;
  theme: 'light' | 'dark';
};

type UploadError = { name: string; message: string };

// Localization override for the demo's "photos" wording.
// Localization docs: https://uploadcare.com/docs/file-uploader/localization/
const localeDefinitionOverride = {
  en: {
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
    photo__one: 'photo',
    photo__many: 'photos',
    photo__other: 'photos',
  },
};

export default function FileUploader({
  files,
  uploaderClassName,
  onChange,
  theme,
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const ctxProviderRef = useRef<UploadCtxProvider>(null);

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry['uuid']) => onChange(files.filter((f) => f.uuid !== uuid)),
    [files, onChange],
  );

  const resetUploaderState = () => {
    const api = ctxProviderRef.current?.getAPI();
    api?.setCurrentActivity(null);
    api?.setModalState(false);
    api?.removeAllFiles();
  };

  const handleModalCloseEvent = () => {
    // Persist uploaded entries in outer form state when dialog closes.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    /*
      Only commit and reset when there is at least one successful upload.
      Otherwise (modal closed without finishing or with all uploads failed)
      we keep whatever in-progress / errored entries the uploader has so
      the user can retry on next open.
     */
    if (uploadedFiles.length === 0) return;

    onChange([...files, ...uploadedFiles]);
    setUploadedFiles([]);
    resetUploaderState();
  };

  const handleChangeEvent = (collection: OutputCollectionState) => {
    setUploadedFiles(
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
        // Register custom Unsplash tab for the adapter-based uploader.
        // Plugin docs: https://uploadcare.com/docs/file-uploader/plugins/example/
        imgOnly
        multiple
        removeCopyright
        confirmUpload={false}
        localeDefinitionOverride={localeDefinitionOverride}
        apiRef={ctxProviderRef}
        onModalClose={handleModalCloseEvent}
        onChange={handleChangeEvent}
        pubkey="a6ca334c3520777c0045"
        sourceList="local, url, camera, dropbox, gdrive, unsplash"
        plugins={[unsplashPlugin]}
        unsplashAccessKey={import.meta.env.VITE_UNSPLASH_ACCESS_KEY}
        className={uploaderClassName}
        classNameUploader={`${cssOverrides.fileUploader} uc-${theme}`}
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
              key={file.uuid}
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
