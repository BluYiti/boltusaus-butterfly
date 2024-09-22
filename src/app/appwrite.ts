import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client();

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error(
    `Missing environment variables for Appwrite configuration.
     Please define NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_PROJECT_ID in your .env file.`
  );
}

// Ensure variables are treated as strings
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID as string;

client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage, ID };
