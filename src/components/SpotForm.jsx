// src/components/SpotForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpotForm() {
    const [name, setName] = useState('');
    const [lat, setLat]   = useState('');
    const [lng, setLng]   = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (!name || !lat || !lng) return alert('All fields required');
        navigate(`/spot/${encodeURIComponent(name)}/${lat}/${lng}`);
    }

    return (
        <form onSubmit={handleSubmit} className="spot-form">
            <input
                placeholder="Spot name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Latitude"
                value={lat}
                onChange={e => setLat(e.target.value)}
            />
            <input
                type="number"
                placeholder="Longitude"
                value={lng}
                onChange={e => setLng(e.target.value)}
            />
            <button type="submit">View Forecast</button>
        </form>
    );
}
