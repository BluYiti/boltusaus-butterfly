import { Client, Account } from 'appwrite';

const client = new Client();

// Check for environment variables
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("Missing environment variables for Appwrite configuration.");
}

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) // Set your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID); // Set your project ID

const account = new Account(client);

export { client, account };

export { ID } from 'appwrite'; // Allows you to generate unique IDs
