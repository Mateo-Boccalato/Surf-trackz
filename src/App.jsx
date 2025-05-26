// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpotForm from './components/SpotForm';
import SpotForecast from './components/SpotForecast';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SpotForm />} />
                <Route path="/spot/:name/:lat/:lng" element={<SpotForecast />} />
            </Routes>
        </Router>
    );
}

export default App;
