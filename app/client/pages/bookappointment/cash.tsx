import React from 'react';
import Modal from '@/components/Modal';

interface CashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CashPayment: React.FC<CashPaymentProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Cash Payment</h1>
        <p className="text-gray-600">You have selected Cash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="mb-2 text-gray-800">Please prepare the cash for your payment upon delivery or at the counter.</p>
          {/* Additional instructions or content for cash payment can go here */}
        </div>
      </div>
    </Modal>
  );
};

export default CashPayment;
