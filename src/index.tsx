import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
// import { Provider } from 'react-redux';
import App from './App';
import 'normalize.css';
// import store from './store/store';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);

// reportWebVitals();
