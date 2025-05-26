// src/SurfSpot.js
export default class SurfSpot {
    constructor(name, lat, lng) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.apiKey = process.env.REACT_APP_STORMGLASS_API_KEY;
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
            { headers: { Authorization: "70b18d1e-e830-11ef-806a-0242ac130003-70b18d8c-e830-11ef-806a-0242ac130003" } }
        );
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json = await res.json();
        return json.hours;  // array of 24 hourly objects
    }
}
