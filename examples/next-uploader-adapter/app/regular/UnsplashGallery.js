'use client';

import { useEffect, useRef, useState } from 'react';

import { searchUnsplash } from './unsplashApi.js';
import st from './unsplashGallery.module.css';

export function UnsplashGallery({ uploaderApi, accessKey }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('Loading…');
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    setStatus('Loading…');
    setItems([]);

    searchUnsplash(query, accessKey, controller.signal)
      .then((results) => {
        setItems(results);
        setStatus(results.length === 0 ? 'No results' : '');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setStatus(err.message);
      });

    return () => controller.abort();
  }, [query, accessKey]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery(inputRef.current?.value.trim() ?? '');
  };

  const handlePick = (item) => {
    uploaderApi.addFileFromUrl(item.fullUrl, {
      fileName: `unsplash-${item.id}.jpg`,
      source: 'unsplash',
    });
    uploaderApi.setCurrentActivity('upload-list');
    uploaderApi.setModalState(true);
  };

  return (
    <>
      <div className="uc-ui-activity-header">
        <button
          type="button"
          className="uc-ui-icon-btn"
          title="Back"
          aria-label="Back"
          onClick={() => uploaderApi.historyBack()}
        >
          <uc-icon name="back"></uc-icon>
        </button>
        <div>
          <uc-icon name="unsplash"></uc-icon>
          <span>Unsplash</span>
        </div>
        <button
          type="button"
          className="uc-ui-icon-btn"
          title="Close"
          aria-label="Close"
          onClick={() => uploaderApi.setModalState(false)}
        >
          <uc-icon name="close"></uc-icon>
        </button>
      </div>

      <div className={st.body}>
        <form className={`uc-ui-toolbar ${st.search}`} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="search"
            name="query"
            placeholder="Search Unsplash"
            autoComplete="off"
            defaultValue={query}
          />
          <button type="submit" className="uc-ui-primary-btn">
            Search
          </button>
        </form>

        <div className={st.status}>{status}</div>

        <div className={st.grid}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={st.item}
              title={`${item.description} — by ${item.author}`}
              onClick={() => handlePick(item)}
            >
              <img
                src={item.thumbUrl}
                alt={item.description}
                width={item.width}
                height={item.height}
                loading="lazy"
              />
              <span className={st.author}>{item.author}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
