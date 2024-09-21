import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Users } from 'node-appwrite'; // Correct import for Node.js SDK

// Initialize Appwrite client
const appwriteClient = new Client();

appwriteClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // Your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string) // Your Appwrite project ID
  .setKey(process.env.APPWRITE_API_KEY as string); // Your API key (server-side only)

const users = new Users(appwriteClient); // Initialize Users service

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all users using Appwrite's Users API
    const result = await users.list();
    res.status(200).json(result); // Return JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
