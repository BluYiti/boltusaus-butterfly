import { databases } from '@/appwrite';
import React, { useEffect, useState } from 'react';

interface Booking {
  id: string;
  date: string;
  time: string;
}

interface TakeNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking; // Add this line if booking is needed
}

// TakeNotesModal Component
const TakeNotesModal: React.FC<TakeNotesModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen) return null;
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (booking) {
      // Update notes state whenever booking changes
      setNotes(notes|| ''); // Assuming booking has a 'notes' property
      console.log('booking loaded:', booking);
    }
  }, [booking]); // This hook will run whenever the booking prop changes

  const handleSave = () => {
    if (!booking || !booking.id) {
      // Handle the case where the booking does not have a valid $id
      console.error('Invalid booking ID:', booking);
      alert('Booking ID is missing or invalid.');
      return;
    }

    try {
      // Try to make the booking successful by passing booking.$id
      makeBookingSuccessful(booking.id, notes);

      // Clear notes after saving
      setNotes('');

      // Close the modal
      onClose();
    } catch (error) {
      // Handle any errors that might occur
      console.error('Error saving notes:', error);

      // Optionally, show a user-friendly message to the user
      alert('An error occurred while saving the notes. Please try again.');
    }
  };

  const makeBookingSuccessful = async (documentId: string, notes: string): Promise<boolean> => {
    try {
      // Ensure documentId is provided
      if (!documentId) {
        console.error('Missing required parameter: "documentId"');
        return false;
      }
  
      // Fetch the booking document based on the documentId
      const response = await databases.getDocument('Butterfly-Database', 'Bookings', documentId);
  
      if (response && response.$id) {
        // Prepare the data to update
        const updateData = {
          notes: notes,
          status: 'success',
        };
  
        // Update the booking document with the new data
        const updateResponse = await databases.updateDocument(
          'Butterfly-Database', 
          'Bookings', 
          documentId, 
          updateData // Pass only the fields you want to update
        );
  
        // Check if the update was successful
        if (updateResponse) {
          console.log('Booking record updated successfully.');
          return true;
        } else {
          console.error('Failed to update booking record.');
          return false;
        }
      } else {
        console.error('Booking record not found.');
        return false;
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  };  

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-blue-950 bg-opacity-70 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="font-semibold text-lg">Submit Appointment Notes</h2>
        <p className='text-sm'>To Provide Appointment Confirmation</p>
        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded"
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            className={`py-1 px-3 rounded transition-colors duration-200 mr-2 ${
              !notes
                ? 'bg-blue-500 text-white cursor-not-allowed' // Disabled state
                : 'bg-blue-400 text-white hover:bg-blue-600' // Enabled state
            }`}
            disabled={!notes} // Disable button if notes is empty
          >
            Submit
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeNotesModal;
