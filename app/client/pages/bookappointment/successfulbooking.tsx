import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
  isVisible: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null; // Don't render the modal if not visible

  return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose} // Close modal when clicking outside
      >
        <div
          className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Booking Successful!</h2>
        <p className="text-lg text-gray-600 mb-4">Your appointment has been successfully booked.</p>
        <div className="flex items-center justify-center text-gray-600 text-lg mb-6">
          <span>Refreshing page</span>
          {/* Enhanced Spinner with Better Contrast */}
          <div className="ml-3 w-8 h-8 border-4 border-t-4 border-blue-400 rounded-full animate-spin border-t-blue-800"></div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
