import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/global.css';
import GastosApp from './GastosApp';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GastosApp />
  </React.StrictMode>,
);
