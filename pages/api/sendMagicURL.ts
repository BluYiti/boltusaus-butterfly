import { NextApiRequest, NextApiResponse } from 'next';
import { Client, Account } from 'appwrite';

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // Your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string); // Your Appwrite project ID

const account = new Account(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, email, name } = req.body;

    console.log('Received request to send Magic URL:', { userId, email, name });

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    try {
      // Step 1: Check if we're on localhost or production
      const isLocalhost = process.env.NODE_ENV !== 'production';
      const redirectUrl = isLocalhost
        ? 'http://localhost:3000/auth/login'  // Use localhost URL in development
        : 'https://cloud.appwrite.io/magic'; // Use production URL if needed

      // Step 2: Create Magic URL token (Use the valid redirect URL)
      const magicURL = await account.createMagicURLToken(userId, email, redirectUrl);

      console.log('Magic URL token created:', magicURL);

      // Step 3: Send the Magic URL via email
      res.status(200).json({ message: 'Magic URL email sent successfully' });
    } catch (error) {
      console.error('Error creating Magic URL token:', error);
      res.status(500).json({ error: 'Failed to create Magic URL token' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
