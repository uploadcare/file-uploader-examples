'use client';

import { useState } from 'react';

import FileUploader from '../_lib/FileUploader.js';
import { useTheme } from '../_lib/ThemeProvider.js';
import moonIcon from '../_lib/icons/moon.png';
import sunIcon from '../_lib/icons/sun.png';
import st from './FormView.module.css';
import MOCK_DATA from './mocks.js';

export default function FormView() {
  const [title, setTitle] = useState(MOCK_DATA.title);
  const [text, setText] = useState(MOCK_DATA.text);
  const [photos, setPhotos] = useState(MOCK_DATA.photos);
  const [sentFormObject, setSentFormObject] = useState(null);

  const { theme, toggle } = useTheme();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSentFormObject({ title, text, photos });
  };

  return (
    <div className={st.root}>
      <header className={st.header}>
        <h1 className={st.viewTitle}>New blog post</h1>
        <button className={st.themeToggle} type="button" onClick={toggle}>
          <img
            alt="Switch to dark theme"
            style={{ display: theme === 'dark' ? 'none' : 'block' }}
            src={sunIcon.src}
            width="16"
            height="16"
          />
          <img
            alt="Switch to light theme"
            style={{ display: theme === 'light' ? 'none' : 'block' }}
            src={moonIcon.src}
            width="14"
            height="14"
          />
        </button>
      </header>

      {!sentFormObject && (
        <form onSubmit={handleFormSubmit}>
          <div className={st.field}>
            <label className={st.label} htmlFor="title">
              Title
            </label>
            <input
              className={st.input}
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={st.field}>
            <label className={st.label} htmlFor="text">
              Text
            </label>
            <textarea
              className={st.input}
              id="text"
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className={st.field}>
            <label className={st.label} htmlFor="photos-uploader">
              Photos
            </label>
            <FileUploader
              uploaderCtxName="my-uploader-form"
              files={photos}
              onChange={setPhotos}
              theme={theme}
            />
          </div>

          <div className={st.field}>
            <button className={st.button} type="submit">
              Publish
            </button>
          </div>
        </form>
      )}

      {!!sentFormObject && (
        <pre className={st.result}>
          <code>{JSON.stringify(sentFormObject, null, 2)}</code>
        </pre>
      )}
    </div>
  );
}
