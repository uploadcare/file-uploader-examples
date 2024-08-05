import React from 'react'
import ReactDOM from 'react-dom/client'

import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import '@uploadcare/file-uploader/web/uc-file-uploader-minimal.min.css';
import './index.css'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
