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