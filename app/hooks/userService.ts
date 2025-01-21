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
        await databases.updateDocument(
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

// Fetch client ID
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
        const response = await databases.getDocument('Butterfly-Database', 'Client', userId);
        return response?.psychotherapist.$id ?? null; // Returns null if psychotherapist is undefined
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

export const restrictSelectingTherapist = async (clientId: string) => {
    try {
        await databases.updateDocument('Butterfly-Database','Client', clientId, {
            allowTherapistChange: false
        });
    } catch (error) {
        console.error('Error restricting therapist selection :', error);
    }
}


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

// Upload receipt image to the "Images" bucket
export const uploadReceiptImage = async (file: File): Promise<{ id: string } | null> => {
    try {
        // Generate a unique ID for the file or use a fileId of your choice
        const fileId = `receipt_${Date.now()}`;

        // Upload the file to the "Images" bucket
        const result = await storage.createFile('Images', fileId, file);

        // Return the file ID (receiptId) if the upload was successful
        return { id: result.$id };  // Assuming the response includes a `$id` field
    } catch (error) {
        console.error('Error uploading receipt image:', error);
        return null;
    }
};

// Fetch receipt image URL
export const fetchReceiptImage = async (receiptId: string): Promise<string | null> => {
    try {
        if (receiptId) {
            // Retrieve the file URL using Appwrite's getFileView
            const url = storage.getFileView('Images', receiptId);
            return url; // Return the image URL
        }
        return null;
    } catch (error) {
        console.error('Error fetching receipt image URL:', error);
        return null;
    }
};

// Check if the client has a pre-assessment
export const hasPreAssessment = async (userId: string): Promise<boolean> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Pre-Assessment', [
            Query.equal('userId', userId),
        ]);

        // If any documents are returned, the pre-assessment exists
        return response.documents.length > 0;
    } catch (error) {
        console.error('Error checking for pre-assessment:', error);
        return false; // Return false in case of an error
    }
};
