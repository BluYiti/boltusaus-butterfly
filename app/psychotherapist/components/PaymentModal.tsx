'use client'

import { databases } from '@/appwrite';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ShowReceiptModal from './ShowReceiptModal'; // Adjust the path as needed

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
  const router = useRouter();
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclining, setIsDeclining] = useState(false); // Flag for showing decline reason input
  const [showReceipt, setShowReceipt] = useState(false); // State for modal visibility
  const [error, setError] = useState(''); // State to manage the error message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await databases.updateDocument('Butterfly-Database', 'Payment', client.id, {
        status: 'paid',
      });
      await databases.updateDocument('Butterfly-Database', 'Bookings', client.booking.$id, {
        status: 'paid',
      });
      onClose();
      window.location.href = `/psychotherapist/pages/clientspayment?tab=Paid`;
    } catch (error) {
      console.error('Failed to update document', error);
    }
  };

  const handleDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeclining(true); // Show the input box for decline reason
    setError(''); // Clear previous error
  };

  const handleDeclineSubmit = async () => {
    if (!declineReason.trim()) {
      setError('Please provide a reason for decline.');
      return;
    }

    try {
      await databases.updateDocument('Butterfly-Database', 'Payment', client.id, {
        status: 'declined',
        declineReason: declineReason,
      });
      onClose();
      window.location.href = `/psychotherapist/pages/clientspayment?tab=Declined`;
    } catch (error) {
      console.error('Failed to update document', error);
    }
  };

  const capitalize = (str) => {
    if (!str) return str; // Check if string is empty or null
    return str
      .toLowerCase() // Convert the whole string to lowercase first
      .split(' ') // Split by spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words back together
  };

  const handleShowReceipt = () => {
    setShowReceipt(true); // Open the receipt modal
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-blue-400">{capitalize(client.status)} Payment</h2>

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
        <p className="text-gray-800">
          <strong>Receipt:</strong>
          <button 
            className="bg-blue-400 ml-2 text-white py-2 px-6 rounded-3xl text-md hover:bg-blue-600 transition duration-300"
            onClick={handleShowReceipt}
          >
            Click to view
          </button>
        </p>
        {client.status === 'declined' ? (
          <p className='mt-1'><strong>Reason for decline:</strong> {client.declineReason}</p>
        ): (<></>)}

        {/* Decline Reason Input */}
        {isDeclining && (
          <div className="mt-4">
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Provide a reason for decline..."
              rows={4}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 text-sm font-semibold text-gray-500 bg-transparent border border-gray-400 rounded-full hover:bg-gray-200"
                onClick={() => setIsDeclining(false)} // Go back to initial state
              >
                Back
              </button>
              <button
                className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-red-400 rounded-full hover:bg-red-300"
                onClick={handleDeclineSubmit} // Submit the decline reason
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* ShowReceiptModal integration */}
        <ShowReceiptModal
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          imageUrl={client.receipt} // Pass the receipt object
        />

        {/* Buttons */}
        {!isDeclining && (
          <div className="flex mt-6">
            <button
              className="px-4 py-2 text-sm font-semibold text-blue-500 bg-transparent border border-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition"
              onClick={onClose}
            >
              Back
            </button>
            {client.status === 'pending' ? (
              <>
                <button
                  className="ml-20 px-4 py-2 text-sm font-semibold text-white bg-green-400 rounded-full hover:bg-green-200 hover:text-green-400 transition"
                  onClick={handleSubmit}
                >
                  Confirm
                </button>
                <button
                  className="ml-5 px-4 py-2 text-sm font-semibold text-white bg-red-400 rounded-full hover:bg-red-300 hover:text-red-400 transition"
                  onClick={handleDecline}
                >
                  Decline
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
