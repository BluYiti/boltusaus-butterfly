import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
  isVisible: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Booking Successful!</h2>
        <p className="text-center text-gray-600 mb-6">Your appointment has been successfully booked.</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
