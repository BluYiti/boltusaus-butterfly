import React, { useState } from 'react';

interface ChoosePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (paymentMethod: string) => void; // New prop for proceeding with payment
}

const ChoosePaymentModal: React.FC<ChoosePaymentModalProps> = ({ isOpen, onClose, onProceed }) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  if (!isOpen) return null; // Return null if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 text-center">Choose Payment Method</h2>
        
        <div className="flex justify-between space-x-4">
          {/* Credit Card */}
          <button
            className={`flex-1 p-2 rounded ${selectedPayment === 'credit card' ? 'ring-4 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setSelectedPayment('credit card')}
          >
            <img src="/images/bpi.png" alt="Credit Card" className="w-full h-16 object-contain" />
          </button>

          {/* GCash */}
          <button
            className={`flex-1 p-2 rounded ${selectedPayment === 'gcash' ? 'ring-4 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setSelectedPayment('gcash')}
          >
            <img src="/images/gcash.png" alt="GCash" className="w-full h-16 object-contain" />
          </button>

          {/* Cash */}
          <button
            className={`flex-1 p-2 rounded ${selectedPayment === 'cash' ? 'ring-4 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setSelectedPayment('cash')}
          >
            <img src="/images/cash.png" alt="Cash" className="w-full h-16 object-contain" />
          </button>
        </div>

        <button
          className="mt-6 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          onClick={() => onProceed(selectedPayment)} // Proceed with the selected payment
          disabled={!selectedPayment}
        >
          Proceed
        </button>
        <button
          className="mt-2 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 w-full"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChoosePaymentModal;
