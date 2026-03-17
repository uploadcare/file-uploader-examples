import { OutputFileEntry } from '@uploadcare/file-uploader';
import { ChangeEventHandler, MouseEventHandler, FormEventHandler, useCallback, useEffect, useState } from 'react';

import sunImage from '../../assets/sun.png';
import moonImage from '../../assets/moon.png';

import FileUploader from '../../components/FileUploader/FileUploader';

import st from './FormView.module.css';
import MOCK_DATA from './mocks';

type FormType = {
  title: string;
  text: string;
  photos: OutputFileEntry[];
}

export default function FormView() {
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

  const [theme, setTheme] = useState<'light' | 'dark'>(document.body.classList.contains('theme--dark') ? 'dark' : 'light');

  const handleThemeChange = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
    setTheme(theme => theme === 'dark' ? 'light' : 'dark');
  }, [setTheme]);

  useEffect(() => {
    document.body.classList.remove('theme--light');
    document.body.classList.remove('theme--dark');
    document.body.classList.add(`theme--${theme}`);
  }, [theme]);

  return (
    <div className={st.root}>
      <header className={st.header}>
        <h1 className={st.viewTitle}>New blog post</h1>
        <button
          className={st.themeToggle}
          type="button"
          onClick={handleThemeChange}
        >
          <img
            style={{ display: theme === 'dark' ? 'none' : 'block ' }}
            src={sunImage as string}
            width="16"
            height="16"
          />
          <img
            style={{ display: theme === 'light' ? 'none' : 'block ' }}
            src={moonImage as string}
            width="14"
            height="14"
          />
        </button>
      </header>

      {!sentFormObject && (
        <form onSubmit={handleFormSubmit}>
          <div className={st.field}>
            <label className={st.label} htmlFor="title">Title</label>
            <input
              className={st.input}
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
              theme={theme}
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
