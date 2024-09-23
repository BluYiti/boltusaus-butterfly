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
  if (req.method === 'DELETE') {
    // Handle DELETE request for user deletion
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      // Use the Appwrite Admin SDK to delete the user
      await users.delete(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } else {
    // If request method is not DELETE, return a 405 (Method Not Allowed)
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
