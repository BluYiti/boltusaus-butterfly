import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Users } from 'node-appwrite';

// Initialize the Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) 
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string);

// Initialize the Users service
const users = new Users(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userID, prefs } = req.body;

    try {
      // Use the Admin SDK to update user preferences
      const updatedUser = await users.updatePrefs(userID, prefs);
      res.status(200).json({ message: 'User preferences updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user preferences:', error);
      res.status(500).json({ error: 'Failed to update user preferences' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
