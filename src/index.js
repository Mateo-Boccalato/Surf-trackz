// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Grab the root element where the app will mount
const container = document.getElementById('root');
const root = createRoot(container);

// Render the App component into the root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
