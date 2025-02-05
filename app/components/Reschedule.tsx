import React, { useState, ReactNode } from 'react';
import { databases } from '@/appwrite';  // Import Appwrite instance

interface RescheduleModalProps {
  onClose: () => void;
  appointmentId: string;  // Pass the appointment ID to update
  children?: ReactNode;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ onClose, appointmentId, children }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and time.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Extract month and day from selectedDate
    const dateObject = new Date(selectedDate);
    const newMonth = dateObject.toLocaleString('default', { month: 'long' }); // Get month name
    const newDay = dateObject.getDate(); // Get day as number

    try {
      // Update the booking in Appwrite database
      await databases.updateDocument(
        'Butterfly-Database',  // Your database ID
        'Bookings',            // Your collection ID
        appointmentId,         // The document ID of the appointment to update
        {
          month: newMonth,      // Update month
          day: newDay,          // Update day
          slots: selectedTime,  // Update time slot
          status: 'rescheduled' // Update status to "rescheduled"
        }
      );

      setSuccessMessage('Appointment successfully rescheduled!');
      setTimeout(() => {
        onClose();  // Close the modal after success
      }, 2000);
    } catch (err) {
      console.error('Error rescheduling:', err);
      setError('Failed to reschedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          X
        </button>

        {children}

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage ? (
          <p className="text-green-500 font-semibold text-lg">{successMessage}</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Reschedule Your Appointment</h2>

            <label htmlFor="new-date" className="block text-gray-700">Choose a new date:</label>
            <input
              type="date"
              id="new-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />

            <label htmlFor="new-time" className="block text-gray-700 mt-4">Choose a new time:</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {timeOptions.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`${
                    selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700'
                  } hover:bg-gray-300 text-sm font-medium py-2 rounded-lg`}
                >
                  {time}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-400 text-white py-2 px-6 rounded hover:bg-blue-500"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RescheduleModal;
