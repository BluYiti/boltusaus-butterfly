// userService.ts

import { databases, Query, storage } from '@/appwrite'; // Adjust import path as needed

// Fetch user status
export const fetchUserStatus = async (userId: string): Promise<string | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Client', [
            Query.equal('userid', userId),
        ]);
        return response.documents[0]?.status || null; // Assuming response.documents contains an array
    } catch (error) {
        console.error('Error fetching user status:', error);
        return null;
    }
};

// Fetch user state
export const fetchUserState = async (userId: string): Promise<string | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Client', [
            Query.equal('userid', userId),
        ]);
        return response.documents[0]?.state || null; // Assuming response.documents contains an array
    } catch (error) {
        console.error('Error fetching user state:', error);
        return null;
    }
};

// Fetch profile image URL
export const fetchProfileImageUrl = async (profilepicId: string): Promise<string | null> => {
    try {
        if (profilepicId) {
        // Retrieve the file URL using Appwrite's getFileView
        const url = storage.getFileView('Images', profilepicId);
        return url; // Return the image URL
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile image URL:", error);
        return null;
    }
};

// Fetch Certificate
export const downloadCertificate = async (imageId: string, name: string) => {
    try {
      const file = await storage.getFile('Images', imageId);
      const url = storage.getFileDownload('Images', imageId); 

      console.log('Fetched file:', file); // Log the fetched file
  
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}_AM Peralta_Referral-Certificate.pdf`; // You can customize the filename here
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
};

// Fetch psychotherapist ID
export const fetchPsychoId = async (userId: string): Promise<string | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Psychotherapist', [
            Query.equal('userId', userId),
        ]);
        return response.documents[0]?.psychoId || null; // Assuming response.documents contains an array and psychoId is a field
    } catch (error) {
        console.error('Error fetching psychotherapist ID:', error);
        return null;
    }
};

// Fetch psychotherapist ID
export const fetchClientId = async (userId: string): Promise<string | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Client', [
            Query.equal('userid', userId),
        ]);
        return response.documents[0]?.$id || null;
    } catch (error) {
        console.error('Error fetching client ID:', error);
        return null;
    }
};

// Fetch client's psychotherapy
export const fetchClientPsycho = async (userId: string): Promise<string | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Client', [
            Query.equal('psychotherapist', userId),
        ]);
        return response.documents[0]?.psychoId || null;
    } catch (error) {
        console.error('Error fetching clients psychotherapist :', error);
        return null;
    }
};

// Update psychotherapist in the Client collection
export const updateClientPsychotherapist = async (clientId: string, psychoId: string): Promise<boolean> => {
    try {
        const response = await databases.updateDocument(
            'Butterfly-Database',      // Database ID
            'Client',                  // Collection ID
            clientId,                  // Document ID (clientId)
            {
                psychotherapist: psychoId,  // The new psychotherapist ID to be set
            }
        );
        
        console.log('Client updated successfully:', response);
        return true;  // Return true if the update was successful
    } catch (error) {
        console.error('Error updating psychotherapist:', error);
        return false;  // Return false if an error occurred
    }
};
