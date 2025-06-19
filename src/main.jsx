import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';     // or './components/Game.jsx'
import './index.css';           // global styles (optional)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
