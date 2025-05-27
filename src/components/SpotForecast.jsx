// src/components/SpotForecast.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SurfSpot from '../SurfSpot';

export default function SpotForecast() {
    const { name, lat, lng } = useParams();
    const [hours, setHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const spot = new SurfSpot(decodeURIComponent(name), lat, lng);
        spot.getForecast()
            .then(data => setHours(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [name, lat, lng]);

    if (loading) return <p>Loading forecast for {decodeURIComponent(name)}…</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="spot-forecast">
            <h2>Forecast for {decodeURIComponent(name)}</h2>
            <Link to="/">← Back</Link>

            <table>
                <thead>
                <tr>
                    <th>Hour</th>
                    <th>Wave Height (m)</th>
                    <th>Swell Height (m)</th>
                    <th>Swell Period (s)</th>
                    <th>Wave Dir (°)</th>
                    <th>Wind Speed (m/s)</th>
                    <th>Wind Dir (°)</th>
                </tr>
                </thead>
                <tbody>
                {hours.map((h, i) => {
                    const hour = new Date(h.time).getHours();
                    return (
                        <tr key={i}>
                            <td>{hour}:00</td>
                            <td>{h.waveHeight?.noaa?.toFixed(2) ?? '—'}</td>
                            <td>{h.swellHeight?.noaa?.toFixed(2) ?? '—'}</td>
                            <td>{h.swellPeriod?.noaa?.toFixed(0) ?? '—'}</td>
                            <td>{h.waveDirection?.noaa?.toFixed(0) ?? '—'}</td>
                            <td>{h.windSpeed?.noaa?.toFixed(1) ?? '—'}</td>
                            <td>{h.windDirection?.noaa?.toFixed(0) ?? '—'}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
