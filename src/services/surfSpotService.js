import { databases } from '../config/appwrite';
import { ID, Query } from 'appwrite';
import { DATABASE_ID, SURF_SPOTS_COLLECTION_ID } from '../config/appwrite';

export const surfSpotService = {
    async createSurfSpot(spotData) {
        try {
            console.log('Creating surf spot with data:', {
                databaseId: DATABASE_ID,
                collectionId: SURF_SPOTS_COLLECTION_ID,
                data: spotData
            });

            const document = await databases.createDocument(
                DATABASE_ID,
                SURF_SPOTS_COLLECTION_ID,
                ID.unique(),
                {
                    name: spotData.name,
                    latitude: spotData.latitude,
                    longitude: spotData.longitude,
                    userId: spotData.userId,
                    lastUpdated: new Date().toISOString(),
                    forecastData: '', // Initialize forecast as empty string
                    lastForecastUpdate: null // Track when the forecast was last updated
                }
            );

            console.log('Created surf spot:', document);
            return document;
        } catch (error) {
            console.error('Error creating surf spot:', error);
            throw new Error(error.message || 'Failed to create surf spot');
        }
    },

    async getUserSurfSpots(userId) {
        try {
            console.log('Fetching surf spots for user:', userId);
            const response = await databases.listDocuments(
                DATABASE_ID,
                SURF_SPOTS_COLLECTION_ID,
                [Query.equal('userId', userId)]
            );
            console.log('Fetched surf spots:', response.documents);
            return response.documents;
        } catch (error) {
            console.error('Error fetching surf spots:', error);
            throw new Error(error.message || 'Failed to fetch surf spots');
        }
    },

    async updateSurfSpot(spotId, spotData) {
        try {
            console.log('Updating surf spot:', spotId, spotData);
            
            // If there's forecast data, stringify it
            const updateData = {
                ...spotData,
                lastUpdated: new Date().toISOString(),
            };

            if (spotData.forecast) {
                updateData.forecastData = JSON.stringify(spotData.forecast);
                delete updateData.forecast;
            }

            const document = await databases.updateDocument(
                DATABASE_ID,
                SURF_SPOTS_COLLECTION_ID,
                spotId,
                updateData
            );
            console.log('Updated surf spot:', document);
            return document;
        } catch (error) {
            console.error('Error updating surf spot:', error);
            throw new Error(error.message || 'Failed to update surf spot');
        }
    },

    async deleteSurfSpot(spotId) {
        try {
            console.log('Deleting surf spot:', spotId);
            await databases.deleteDocument(
                DATABASE_ID,
                SURF_SPOTS_COLLECTION_ID,
                spotId
            );
            console.log('Deleted surf spot:', spotId);
            return true;
        } catch (error) {
            console.error('Error deleting surf spot:', error);
            throw new Error(error.message || 'Failed to delete surf spot');
        }
    },

    async getForecast(spotId) {
        try {
            // First, get the spot details
            const spot = await databases.getDocument(
                DATABASE_ID,
                SURF_SPOTS_COLLECTION_ID,
                spotId
            );

            // Check if we have a recent forecast (less than 1 hour old)
            const lastUpdate = spot.lastForecastUpdate ? new Date(spot.lastForecastUpdate) : null;
            const now = new Date();
            
            // Try to parse existing forecast data
            let existingForecast = null;
            try {
                if (spot.forecastData) {
                    existingForecast = JSON.parse(spot.forecastData);
                }
            } catch (e) {
                console.warn('Failed to parse existing forecast data:', e);
            }

            if (lastUpdate && (now - lastUpdate) < 3600000 && existingForecast) {
                return existingForecast;
            }

            // If no recent forecast, fetch new data from Stormglass
            const params = [
                'windSpeed',
                'windDirection',
                'waveHeight',
                'waveDirection',
                'swellHeight',
                'swellPeriod'
            ].join(',');

            const res = await fetch(
                `https://api.stormglass.io/v2/weather/point?lat=${spot.latitude}&lng=${spot.longitude}&params=${params}`,
                { headers: { Authorization: "3066740c-7f6e-11ef-8a8f-0242ac130004-30667470-7f6e-11ef-8a8f-0242ac130004" } }
            );
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const json = await res.json();
            return json.hours;
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw new Error(error.message || 'Failed to fetch forecast');
        }
    }
}; 