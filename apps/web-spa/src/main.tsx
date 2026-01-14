import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
// @ts-expect-error
import '@nsiod/share-ui/css'

import { Buffer } from 'buffer'

if (!window.Buffer) {
  window.Buffer = Buffer
}

// Main entry point for the application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App>
              <Home />
            </App>
          }
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
