import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- change here
import App from './App';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);