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

// Upload profile picture
export const uploadProfilePicture = async (fileId: string, file: File): Promise<string | null> => {
    try {
        // Create a new file in the "Images" bucket with a unique ID for the user
        await storage.createFile('Images', fileId, file);
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return null;
    }
};


// Upload profile picture
export const uploadProfilePictureCollection = async (userId: string, photoId: string, collection: string): Promise<string | null> => {
    try {
        // Create a new file in the "Images" bucket with a unique ID for the user
        const result = await databases.updateDocument(
            'Butterfly-Database', // databaseId
            collection, // collectionId
            userId, // documentId
            {profilepic: photoId}, //data
        );

        // Return the file ID if upload was successful
        return "Successfully set profilepic";
    } catch (error) {
        console.error('Error setting profilepic:', error);
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
        return response.documents[0]?.$id || null; // Assuming response.documents contains an array and psychoId is a field
    } catch (error) {
        console.error('Error fetching psychotherapist ID:', error);
        return null;
    }
};

// Overwrite psychotherapist profile picture
export const overwriteProfilePicture = async (userId: string, file: File): Promise<string | null> => {
    try {
        // Fetch the psychotherapist's current profile picture ID
        const response = await databases.listDocuments('Butterfly-Database', 'Psychotherapist', [
            Query.equal('userId', userId),
        ]);
        const currentProfilePicId = response.documents[0]?.profilepic || null;

        // Delete the existing profile picture if it exists
        if (currentProfilePicId) {
            await storage.deleteFile('Images', currentProfilePicId);
        }

        // Upload the new profile picture
        const newProfilePicId = await uploadProfilePicture(userId, file);

        // Update the psychotherapist's record with the new profile picture ID
        if (newProfilePicId) {
            await databases.updateDocument(
                'Butterfly-Database',
                'Psychotherapist',
                response.documents[0].$id,
                { profilepic: newProfilePicId }
            );
            return newProfilePicId;
        }

        return null;
    } catch (error) {
        console.error('Error overwriting psychotherapist profile picture:', error);
        return null;
    }
};



