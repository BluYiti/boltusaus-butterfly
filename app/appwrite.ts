import { Client, Account, Databases, Storage, ID, Query, Functions } from 'appwrite';

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
const functions = new Functions(client);

// JWT Function: Create a JWT for the current authenticated user
async function createJWT() {
  try {
    const jwtResponse = await account.createJWT();
    return jwtResponse.jwt; // Return the generated JWT
  } catch (error) {
    console.error('Error creating JWT:', error);
    throw error;
  }
}

// JWT Function: Verify JWT (for backend or token validation)
async function verifyJWT() {
  try {
    const session = await account.getSession('current'); // Fetch the current session
    return session; // Returns the current session details
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw error;
  }
}

// Function to fetch session
async function getSession() {
  try {
    const session = await account.getSession('current');
    return session; // Returns the current session
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
}

// Initialize the Appwrite SDK using named export if applicable
const sdk = new Client(); // Replace Appwrite with Client if it's not constructible

sdk
  .setEndpoint(APPWRITE_ENDPOINT) // Use the environment variable for the API Endpoint
  .setProject(PROJECT_ID); // Use the environment variable for the project ID

// Export the initialized services, JWT functions, and SDK for use in other modules
export { client, account, databases, storage, functions, ID, Query, createJWT, verifyJWT, getSession, sdk };
