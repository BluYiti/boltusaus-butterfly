import React from 'react';
import Modal from '@/components/Modal';

interface CreditCardPaymentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Credit Card Payment</h1>
        <p className="text-gray-600">You have selected Credit Card as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="mb-2 text-gray-800">This is where you can input your credit card information.</p>
          {/* Add your credit card form here */}
        </div>
      </div>
    </Modal>
  );
};

export default CreditCardPayment;
