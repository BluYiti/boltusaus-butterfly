import React from 'react';
import Modal from '@/components/Modal';

interface SuccessModalProps {
  onClose: () => void;
  isVisible: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, isVisible }) => {
  return (
    <Modal isOpen={isVisible} onClose={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Booking Successful!</h2>
        <p className="text-lg text-gray-600 mb-4">Your appointment has been successfully booked.</p>
        <div className="flex items-center justify-center text-gray-600 text-lg mb-6">
          <span>Refreshing page</span>
          <div className="ml-3 w-8 h-8 border-4 border-t-4 border-blue-400 rounded-full animate-spin border-t-blue-800"></div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
