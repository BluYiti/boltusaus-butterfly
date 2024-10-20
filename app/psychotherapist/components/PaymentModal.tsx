// src/components/PaymentModal.js
import React from 'react';

const PaymentModal = ({ isOpen, onClose, client }) => {
  if (!isOpen) return null; // Don't render if the modal is not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Pending Payment</h2>
        <p><strong>APPOINTMENT ID:</strong> 001A</p>
        <p><strong>Reference No:</strong> UMZSLRTZQ5</p>
        <p><strong>Channel:</strong> Cash</p>
        <p><strong>Account Name:</strong> {client.name}</p>
        <p><strong>Amount:</strong> PHP 1,000.00</p>
        <p><strong>Status:</strong> {client.status}</p>
        <p><strong>Transaction Date and Time:</strong> 10/02/24 9:30 am</p>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 text-sm font-semibold text-blue-500 bg-transparent border border-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition"
            onClick={onClose}
          >
            Back
          </button>
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
            onClick={onClose} // Handle the confirm action as needed
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
