import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OutputFileEntry } from '@uploadcare/blocks';
import { FileUploaderRegular, type UploadCtxProvider } from '@uploadcare/react-uploader';

import st from './FileUploader.module.scss';
import cssOverrides from './FileUploader.overrides.module.css';
import cs from 'classnames';

type FileUploaderProps = {
  uploaderClassName: string;
  files: OutputFileEntry[];
  onChange: (files: OutputFileEntry[]) => void;
  theme: 'light' | 'dark';
}

const localeDefinitionOverride = {
  en: {
    "upload-file": "Upload photo",
    "upload-files": 'Upload photos',
    "choose-file": 'Choose photo',
    "choose-files": 'Choose photos',
    "drop-files-here": 'Drop photos here',
    "select-file-source": 'Select photo source',
    "edit-image": 'Edit photo',
    "no-files": 'No photos selected',
    "caption-edit-file": 'Edit photo',
    "files-count-allowed": 'Only {{count}} {{plural:photo(count)}} allowed',
    "files-max-size-limit-error": 'Photo is too big. Max photo size is {{maxFileSize}}.',
    "header-uploading": 'Uploading {{count}} {{plural:photo(count)}}',
    "header-succeed": '{{count}} {{plural:photo(count)}} uploaded',
    "header-total": '{{count}} {{plural:photo(count)}} selected',
    "photo__one": 'photo',
    "photo__many": 'photos',
    "photo__other": 'photos',
  }
}

export default function FileUploader({ files, uploaderClassName, onChange, theme }: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<OutputFileEntry<'success'>[]>([]);
  const ctxProviderRef = useRef<InstanceType<UploadCtxProvider>>(null);


  const handleRemoveClick = useCallback(
    (uuid: OutputFileEntry['uuid']) => onChange(files.filter(f => f.uuid !== uuid)),
    [files, onChange],
  );

  const resetUploaderState = () => ctxProviderRef.current?.uploadCollection.clearAll();

  const handleModalCloseEvent = () => {
    resetUploaderState();

    onChange([...files, ...uploadedFiles])

    setUploadedFiles([]);
  };


  const handleChangeEvent = (files) => {
    setUploadedFiles([...files.allEntries.filter(f => f.status === 'success')] as OutputFileEntry<'success'>[]);
  }

  return (
    <div className={st.root}>
      <FileUploaderRegular
        imgOnly
        multiple
        removeCopyright
        confirmUpload={false}
        localeDefinitionOverride={localeDefinitionOverride}
        apiRef={ctxProviderRef}
        onModalClose={handleModalCloseEvent}
        onChange={handleChangeEvent}
        pubkey="a6ca334c3520777c0045"
        className={cs(uploaderClassName)}
        classNameUploader={cs(cssOverrides.fileUploader, { [st.darkModeEnabled]: theme === 'dark' })}
      />
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
            >×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
