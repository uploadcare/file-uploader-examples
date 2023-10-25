import * as LR from '@uploadcare/blocks';
import cs from 'classnames';
import { ChangeEventHandler, FormEventHandler, useCallback, useState } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';

import sunImage from './assets/sun.png';
import moonImage from './assets/moon.png';

import FileUploader from './FileUploader/FileUploader';

import st from './App.module.scss';
import MOCK_DATA from './mocks';
import { File } from './types';

LR.registerBlocks(LR);

type FormType = {
  title: string;
  text: string;
  photos: File[];
}

export default function App() {
  const [title, setTitle] = useState<FormType['title']>(MOCK_DATA.title);
  const [text, setText] = useState<FormType['text']>(MOCK_DATA.text);
  const [photos, setPhotos] = useState<FormType['photos']>(MOCK_DATA.photos);

  const [sentFormObject, setSentFormObject] = useState<FormType | null>(null);

  const handleTitleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => setTitle(e.target.value),
    [setTitle],
  );
  const handleTextChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    e => setText(e.target.value),
    [setText],
  );
  const handleFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    setSentFormObject({
      title,
      text,
      photos,
    });
  }, [title, text, photos, setSentFormObject]);

  return (
    <div className={st.app}>
      <header className={st.header}>
        <h1 className={st.viewTitle}>New blog post</h1>
        <Toggle
          defaultChecked={true}
          className={st.themeToggle}
          icons={{
            checked: <img src={sunImage} width="16" height="16"/>,
            unchecked: <img src={moonImage} width="14" height="14"/>,
          }}
        />
      </header>

      {!sentFormObject && (
        <form className={st.form} onSubmit={handleFormSubmit}>
          <div className={st.field}>
            <label className={st.label} htmlFor="title">Title</label>
            <input
              className={cs(st.input, st.titleInput)}
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          <div className={st.field}>
            <label className={st.label} htmlFor="text">Text</label>
            <textarea
              className={st.input}
              id="text"
              rows={10}
              value={text}
              onChange={handleTextChange}
            />
          </div>

          <div className={st.field}>
            <label className={st.label}>Photos</label>
            <FileUploader
              uploaderClassName={st.fileUploader}
              files={photos}
              onChange={setPhotos}
              maxAllowedFiles={10}
            />
          </div>

          <div className={st.field}>
            <button className={st.button} type="submit">Publish</button>
          </div>
        </form>
      )}

      {!!sentFormObject && (
        <pre className={st.result}>
          <code>
            {JSON.stringify(sentFormObject, null, 2)}
          </code>
        </pre>
      )}
    </div>
  );
}
