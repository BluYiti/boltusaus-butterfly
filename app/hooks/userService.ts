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
export const hasPreAssessment = async (userID: string): Promise<boolean> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Pre-Assessment', [
            Query.equal('userID', userID),
        ]);

        // If any documents are returned, the pre-assessment exists
        return response.documents.length > 0;
    } catch (error) {
        console.error('Error checking for pre-assessment:', error);
        return false; // Return false in case of an error
    }
};

// Fetch appointments for the selected day
export const fetchAppointmentsForDay = async (day: number, month: string, psychotherapist: string): Promise<any[] | null> => {
    try {
        if (day == null) {
            throw new Error('Invalid day parameter');
        }
        const response = await databases.listDocuments('Butterfly-Database', 'Bookings', [
            Query.equal('day', day),
            Query.equal('month', month),
            Query.equal('psychotherapist', psychotherapist),
        ]);

        return response.documents || null; 
    } catch (error) {
        console.error('Error fetching appointments for the selected day:', error);
        return null;
    }
};

// Fetch payment status for an appointment
export const fetchPaymentStatus = async (appointmentId: string): Promise<string | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Payment', [
            Query.equal('booking', appointmentId),
        ]);
        return response.documents[0]?.status || null; // Assuming response.documents contains an array and status is a field
    } catch (error) {
        console.error('Error fetching payment status:', error);
        return null;
    }
};

// Fetch available time slots
export const fetchTimeSlots = async (): Promise<any[] | null> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'TimeSlots');

        return response.documents || null; // Assuming response.documents contains an array of time slots
    } catch (error) {
        console.error('Error fetching time slots:', error);
        return null;
    }
};

// Add a new time slot to the database
export const addTimeSlotToDatabase = async (timeSlot: { time: string, month: string, day: any }): Promise<boolean> => {
    try {
        const response = await databases.createDocument(
            'Butterfly-Database', // Database ID
            'TimeSlots',          // Collection ID
            'unique()',           // Unique document ID
            timeSlot              // Time slot data
        );

        console.log('Time slot added successfully:', response);
        return true; // Return true if the time slot was added successfully
    } catch (error) {
        console.error('Error adding time slot to database:', error);
        return false; // Return false if an error occurred
    }
};

// Delete a time slot from the database by time attribute
export const deleteTimeSlotFromDatabase = async (time: string): Promise<boolean> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'TimeSlots', [
            Query.equal('time', time),
        ]);

        if (response.documents.length > 0) {
            const documentId = response.documents[0].$id;
            await databases.deleteDocument('Butterfly-Database', 'TimeSlots', documentId);
            console.log('Time slot deleted successfully');
            return true; // Return true if the time slot was deleted successfully
        } else {
            console.log('No time slot found with the specified time');
            return false; // Return false if no time slot was found
        }
    } catch (error) {
        console.error('Error deleting time slot from database:', error);
        return false; // Return false if an error occurred
    }
};

// Book an appointment with status disabled
export const bookAppointmentWithDisabledStatus = async (appointment: { client: string, psychotherapist: string, slots: string, day: number, month: string}): Promise<boolean> => {
    try {
        const response = await databases.createDocument(
            'Butterfly-Database', // Database ID
            'Bookings',           // Collection ID
            'unique()',           // Unique document ID
            {
                ...appointment,
                status: 'disabled', // Set the status to disabled
                createdAt: new Date().toISOString() // Add createdAt attribute
            }
        );

        console.log('Appointment booked successfully with disabled status:', response);
        return true; // Return true if the appointment was booked successfully
    } catch (error) {
        console.error('Error booking appointment with disabled status:', error);
        return false; // Return false if an error occurred
    }
};

// Enable a time slot by deleting it from the database
export const enableTimeSlot = async (selectedTime: string, selectedDay: number, selectedMonth: string, psychoId: string): Promise<boolean> => {
    try {
        const response = await databases.listDocuments('Butterfly-Database', 'Bookings', [
            Query.equal('time', selectedTime),
            Query.equal('day', selectedDay),
            Query.equal('month', selectedMonth),
            Query.equal('psychotherapist', psychoId),
        ]);

        if (response.documents.length > 0) {
            const documentId = response.documents[0].$id;
            await databases.deleteDocument('Butterfly-Database', 'TimeSlots', documentId);
            console.log('Time slot enabled (deleted) successfully');
            return true; // Return true if the time slot was deleted successfully
        } else {
            console.log('No time slot found with the specified time');
            return false; // Return false if no time slot was found
        }
    } catch (error) {
        console.error('Error enabling (deleting) time slot:', error);
        return false; // Return false if an error occurred
    }
};

export const findPaymentData = async (bookingId: string): Promise<any | null> => {
    try {
      // Fetch the document based on the bookingId
      const response = await databases.getDocument('Butterfly-Database', 'Payment', bookingId);
      
      // Check if response contains data
      if (response && response.$id) {
        return response.$id; // Return the payment document ID
      } else {
        console.error('Payment record not found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      return null;
    }
};

// Fetch the status of the most recent appointment for a specific client
export const getLatestAppointmentStatus = async (clientName: string): Promise<string | null> => {
    try {
        // Query the Bookings collection to fetch the most recent appointment for the given client
        const response = await databases.listDocuments('Butterfly-Database', 'Bookings', [
            Query.equal('client', clientName), // Filter by client name
            Query.limit(1), // Limit the results to 1 document (the most recent one)
            Query.orderDesc('createdAt') // Order by createdAt in descending order
        ]);

        if (response.documents.length > 0) {
            const mostRecentAppointment = response.documents[0];
            const status = mostRecentAppointment.status; // Extract the status from the appointment
            console.log(`Most recent appointment status for client ${clientName}:`, status);
            return status; // Return the status of the most recent appointment
        } else {
            console.log(`No appointments found for client ${clientName}.`);
            return null; // Return null if no appointment is found for the client
        }
    } catch (error) {
        console.error('Error fetching the most recent appointment status for client:', error);
        return null; // Return null if an error occurred
    }
};
