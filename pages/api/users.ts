import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Users } from 'node-appwrite';

// Initialize Appwrite client
const appwriteClient = new Client();

appwriteClient
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

const users = new Users(appwriteClient);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all users using Appwrite's Users API
    const result = await users.list();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
