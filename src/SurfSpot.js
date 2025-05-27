// src/SurfSpot.js
export default class SurfSpot {
    constructor(name, lat, lng) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.apiKey = process.env.REACT_APP_STORMGLASS_API_KEY;
        if (!this.apiKey) {
            throw new Error('Stormglass API key not found in environment variables');
        }
    }

    async getForecast() {
        const params = [
            'windSpeed',
            'windDirection',
            'waveHeight',
            'waveDirection',
            'swellHeight',
            'swellPeriod'
        ].join(',');

        const res = await fetch(
            `https://api.stormglass.io/v2/weather/point?lat=${this.lat}&lng=${this.lng}&params=${params}`,
            { headers: { Authorization: this.apiKey } }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        return json.hours;  // array of 24 hourly objects
    }
}
