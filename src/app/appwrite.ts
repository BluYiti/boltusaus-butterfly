import { Client, Account } from 'appwrite';

const client = new Client();

// This code checks for environmentables for appwrite configuration
if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !process.env.NEXT_PUBLIC_PROJECT_ID) {
  throw new Error("Missing environment variables for Appwrite configuration.");
}

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);


const account = new Account(client);

export { client, account };

export {ID} from 'appwrite'