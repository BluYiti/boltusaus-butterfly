import { databases } from '@/appwrite';
import React from 'react';

// Helper function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long', // e.g., "Monday"
    year: 'numeric',
    month: 'long', // e.g., "November"
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // 12-hour format with AM/PM
  });
};

const PaymentModal = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client) return null; // Don't render if modal is not open or client is null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      await databases.updateDocument('Butterfly-Database', 'Client', client.id,
        {status: "paid"}
      );
    } catch (error) {
      console.error("Failed to update document", error);
    } finally {
      onClose;
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Pending Payment</h2>
        
        {/* Payment details */}
        <p><strong>Appointment ID:</strong> {client.id}</p>
        <p><strong>Reference No:</strong> {client.referenceNo}</p>
        <p><strong>Channel:</strong> {client.channel}</p>
        <p><strong>Client Name:</strong> {client.clientFirstName} {client.clientLastName}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Amount:</strong> ₱{client.amount.toFixed(2)}</p>
        <p><strong>Status:</strong> {client.status}</p>

        {/* Format the date */}
        <p><strong>Transaction Date and Time:</strong> {formatDate(client.createdAt)}</p>

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
            onClick={handleSubmit} // Handle the confirm action as needed
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
