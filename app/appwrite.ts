import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Check for necessary environment variables
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error(
    `Missing environment variables for Appwrite configuration.
     Please define NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_PROJECT_ID in your .env file.`
  );
}

// Ensure variables are treated as strings
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID as string;

// Set endpoint and project ID for the client
client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

// Initialize services
const account = new Account(client); // For user authentication and sessions
const databases = new Databases(client); // For database operations
const storage = new Storage(client); // For file storage operations

// Export the initialized services for use in other modules
export { client, account, databases, storage, ID };
