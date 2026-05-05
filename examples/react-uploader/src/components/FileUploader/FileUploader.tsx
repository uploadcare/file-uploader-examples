import type { OutputFileEntry } from '@uploadcare/file-uploader';
import * as UC from '@uploadcare/file-uploader';
import { useCallback, useEffect, useRef, useState } from 'react';

import { unsplashPlugin } from '../Unsplash/unsplashPlugin';
import st from './FileUploader.module.css';

UC.defineComponents(UC);

type FileUploaderProps = {
  uploaderClassName: string;
  uploaderCtxName: string;
  files: OutputFileEntry[];
  onChange: (files: OutputFileEntry[]) => void;
  theme: 'light' | 'dark';
};

type UploadError = { name: string; message: string };

export default function FileUploader({
  files,
  uploaderClassName,
  uploaderCtxName,
  onChange,
  theme,
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const [errors, setErrors] = useState<UploadError[]>([]);
  const ctxProviderRef = useRef<UC.UploadCtxProvider>(null);
  const configRef = useRef<UC.Config & { unsplashAccessKey?: string }>(null);

  useEffect(() => {
    const config = configRef.current;
    if (!config) return;

    // Register the custom Unsplash source plugin.
    // Plugin API docs: https://uploadcare.com/docs/file-uploader/plugins/example/
    config.plugins = [unsplashPlugin];
    config.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  }, []);

  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry['uuid']) => onChange(files.filter((f) => f.uuid !== uuid)),
    [files, onChange],
  );

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    // Keep only successful entries in local state (committed on `modal-close`),
    // and surface any failed entries as user-facing errors.
    // Events docs: https://uploadcare.com/docs/file-uploader/events/
    const handleChangeEvent = (e: UC.EventMap['change']) => {
      setUploadedFiles([
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

  useEffect(() => {
    const config = configRef.current;
    if (!config) return;

    // Copy tweak for this demo's "photos" vocabulary.
    // Localization docs: https://uploadcare.com/docs/file-uploader/localization/
    config.localeDefinitionOverride = {
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
      } as Record<string, string>,
    };
    return () => {
      config.localeDefinitionOverride = null;
    };
  }, []);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    // The app updates its own form state on modal close, then resets uploader state.
    const resetUploaderState = () => {
      const api = ctxProviderRef.current?.getAPI();
      api?.setCurrentActivity(null);
      api?.setModalState(false);
      api?.removeAllFiles();
    };

    const handleModalCloseEvent = () => {
      /*
        Only commit and reset when there is at least one successful
        upload. Otherwise (modal closed without finishing or with all
        uploads failed) we keep whatever in-progress / errored entries
        the uploader has so the user can retry on next open.
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
  }, [files, onChange, uploadedFiles]);

  return (
    <div className={st.root}>
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
        class={`${uploaderClassName} uc-${theme}`}
      ></uc-file-uploader-regular>

      <uc-upload-ctx-provider ref={ctxProviderRef} ctx-name={uploaderCtxName} />

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
