import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App.jsx';
import { listen } from './socket';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

listen("error", console.error)