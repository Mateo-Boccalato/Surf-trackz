// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Grab the root element where the app will mount
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the App component into the root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
