import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

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

// Initialize services (but only after the client is set)
let account: Account, databases: Databases, storage: Storage, functions: Functions;

if (typeof window !== "undefined") {
  client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);
  // Initialize services on the client-side
  account = new Account(client); // For user authentication and sessions
  databases = new Databases(client); // For database operations
  storage = new Storage(client); // For file storage operations
  functions = new Functions(client); // For serverless functions
}

// Subscribe to all databases and buckets (only in client-side)
if (typeof window !== "undefined") {
  client.subscribe('databases.*.collections.*.documents.*', response => {
    if (response.events.includes('databases.*.collections.*.documents.*.create')) {
      // Log when a new document is created
      console.log('New document created:', response.payload);
    } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
      // Log when a document is updated
      console.log('Document updated:', response.payload);
    } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
      // Log when a document is deleted
      console.log('Document deleted:', response.payload);
    }
  });

  client.subscribe('buckets.*.files.*', response => {
    if (response.events.includes('buckets.*.files.*.create')) {
      // Log when a new file is uploaded
      console.log('New file uploaded:', response.payload);
    } else if (response.events.includes('buckets.*.files.*.update')) {
      // Log when a file is updated
      console.log('File updated:', response.payload);
    } else if (response.events.includes('buckets.*.files.*.delete')) {
      // Log when a file is deleted
      console.log('File deleted:', response.payload);
    }
  });

  // Subscribe specifically to the Bookings collection
  client.subscribe(`databases.${"Butterfly-Database"}.collections.${"Bookings"}.documents`, (response) => {
    if (response.events.includes("databases.*.collections.*.documents.*.update")) {
      console.log("Booking updated:", response.payload);
      // You can trigger a re-fetch of the booking data here
    }
  });
}

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
