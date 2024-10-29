import React, { useState } from 'react';
import CashPayment from './cash';
import CreditCardPayment from './creditcard';
import GCashPayment from './gcash';

interface ChoosePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChoosePaymentModal: React.FC<ChoosePaymentModalProps> = ({ isOpen, onClose }) => {
    const [selectedPayment, setSelectedPayment] = useState<string>('');

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Choose Payment Method</h2>
        
        <div className="flex flex-col space-y-4">
          {/* Credit Card */}
          <button
            className={`py-2 px-4 rounded ${selectedPayment === 'credit card' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() =>  <CreditCardPayment />}
          >
            Credit Card
          </button>

          {/* GCash */}
          <button
            className={`py-2 px-4 rounded ${selectedPayment === 'gcash' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => <GCashPayment />}
          >
            GCash
          </button>

          {/* Cash */}
          <button
            className={`py-2 px-4 rounded ${selectedPayment === 'cash' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => <CashPayment />}
          >
            Cash
          </button>
        </div>

        <button
          className="mt-6 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChoosePaymentModal;
