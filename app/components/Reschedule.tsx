import React, { useState, ReactNode } from 'react';

interface RescheduleModalProps {
  onClose: () => void;
  children?: ReactNode;  // Add children prop to handle passed content
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ onClose, children }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFinalPrompt, setShowFinalPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeOptions = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      setShowConfirmation(true); // Show confirmation modal
    }
  };

  const handleConfirm = () => {
    setLoading(true); // Start loading
    setTimeout(() => {
      console.log(`Confirmed date: ${selectedDate}, time: ${selectedTime}`);
      setLoading(false); // Stop loading
      setShowFinalPrompt(true); // Show the final prompt
    }, 2000); // Simulate a 2-second delay (like an API call)
  };

  const handleCloseFinalPrompt = () => {
    setShowFinalPrompt(false);
    onClose(); // Close the modal completely
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          X
        </button>

        {/* Render children if passed */}
        {children}

        {!showFinalPrompt ? (
          !showConfirmation ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Reschedule Your Appointment</h2>

              {/* Date Picker */}
              <label htmlFor="new-date" className="block text-gray-700">Choose a new date:</label>
              <input
                type="date"
                id="new-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />

              {/* Time Slots */}
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

              {/* Footer Buttons */}
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-400 text-white py-2 px-6 rounded hover:bg-blue-500"
                  onClick={handleReschedule}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Confirm Reschedule</h2>
              <p className="text-lg mb-6">
                You have selected <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
              </p>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                  onClick={() => setShowConfirmation(false)} // Go back to edit
                >
                  Keep Editing
                </button>
                <button
                  className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={handleConfirm} // Confirm and show final prompt
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Reschedule Sent</h2>
            <p className="text-lg mb-6">
              Your reschedule request has been sent. Please wait for the confirmation from the clinic.
            </p>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                className="bg-blue-400 text-white py-2 px-6 rounded hover:bg-blue-500"
                onClick={handleCloseFinalPrompt} // Close the final prompt
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RescheduleModal;
