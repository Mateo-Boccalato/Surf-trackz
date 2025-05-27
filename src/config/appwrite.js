import { Client, Account, Databases } from 'appwrite';

const client = new Client();

// Initialize the Appwrite client
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Changed to the correct Appwrite endpoint
    .setProject('67c4d7320027a171897c');

export const account = new Account(client);
export const databases = new Databases(client);

// Collection IDs with correct Appwrite IDs
export const SURF_SPOTS_COLLECTION_ID = '6835f43a0033f7dd31f7'; // Updated to the correct collection ID
export const DATABASE_ID = '6835f1080030a74608e2'; // Updated to the correct database ID

export { client }; 