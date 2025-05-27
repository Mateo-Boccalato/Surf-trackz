// src/SurfSpot.js
export default class SurfSpot {
    constructor(name, lat, lng) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
        this.apiKey = "3066740c-7f6e-11ef-8a8f-0242ac130004-30667470-7f6e-11ef-8a8f-0242ac130004";
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
