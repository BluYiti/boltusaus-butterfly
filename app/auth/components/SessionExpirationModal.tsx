import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onStay: () => void;
}

const SessionExpirationModal: React.FC<ModalProps> = ({ isOpen, onClose, onLogout, onStay }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
        <p className="mb-4">Your session has expired. Would you like to log out or stay logged in?</p>
        <div className="flex justify-between space-x-4">
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Log Out
          </button>
          <button
            onClick={onStay}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Stay Logged In
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SessionExpirationModal;
