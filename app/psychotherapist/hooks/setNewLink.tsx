import { databases, Query } from '@/appwrite';

interface GoogleMeetLink {
  client: string;
  psychotherapist: string;
  link: string;
}

export const setNewLink = async (clientId: string, psychotherapist: string, link: string): Promise<boolean> => {
  try {
    console.log(`Setting new Google Meet link for client ID ${clientId}...`);

    // Check if a document already exists for this clientId
    const existingDocuments = await databases.listDocuments('Butterfly-Database', 'MeetLink', [
      Query.equal('client', clientId)
    ]);

    if (existingDocuments.documents.length > 0) {
      // Update the existing document
      const documentId = existingDocuments.documents[0].$id; // Get the existing document's ID

      await databases.updateDocument('Butterfly-Database', 'MeetLink', documentId, {
        link,
        psychotherapist
      });

      console.log(`Updated existing Google Meet link for client ID ${clientId}.`);
    } else {
      // Create a new document if none exists
      await databases.createDocument('Butterfly-Database', 'MeetLink', 'unique()', {
        client: clientId,
        psychotherapist,
        link
      });

      console.log(`Created new Google Meet link for client ID ${clientId}.`);
    }

    return true;
  } catch (error) {
    console.error(`Error setting Google Meet link for client ID ${clientId}:`, error);
    return false;
  }
};
