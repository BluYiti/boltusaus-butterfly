import React from 'react';
import Modal from '@/components/Modal';

interface GCashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
}

const GCashPayment: React.FC<GCashPaymentProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">GCash Payment</h1>
        <p className="text-gray-600">You have selected GCash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="mb-2 text-gray-800">This is where you can initiate your GCash payment process.</p>
          {/* Add your GCash payment form or QR code here */}
        </div>
      </div>
    </Modal>
  );
};

export default GCashPayment;
