import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.js';
import reportWebVitals from './utils/reportWebVitals.js';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
