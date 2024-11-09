import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, fetchClientPsycho, restrictSelectingTherapist, updateClientPsychotherapist } from '@/hooks/userService';
import SuccessModal from './successfulbooking';

interface GCashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: any;
}

const GCashPayment: React.FC<GCashPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [client, setClientId] = useState<string>('');
  const [psycho, setPsychoId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/\D/g, '');

    // Limit the value to 13 digits
    if (inputValue.length > 13) {
      inputValue = inputValue.substring(0, 13);
    }

    setReferenceNumber(inputValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation for the reference number
    if (referenceNumber.length !== 13) {
      setError('Reference number must be 13 digits long');
      return;
    }

    // Reset the error if validation passes
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Submitting reference number:', referenceNumber);

      // Fetch user data when submitting the form
      const user = await account.get();
      const clientId = await fetchClientId(user.$id);
      const response = await databases.getDocument('Butterfly-Database', 'Client', clientId);
      let psychoId = response.psychotherapist.$id;

      // Check if psychoId is null or empty
      if (!psychoId) {
          // If psychoId is null or empty, use the selected psychotherapist's ID
          psychoId = appointmentData.selectedTherapist.$id;
          updateClientPsychotherapist(clientId, psychoId);
      }

      restrictSelectingTherapist(clientId);

      const BookingsData = {
        client: clientId,
        psychotherapist: psychoId,
        slots: appointmentData.selectedTime,
        status: "pending",
        createdAt: appointmentData.createdAt,
        mode: appointmentData.selectedMode,
        month: appointmentData.selectedMonth,
        day: appointmentData.selectedDay
      };

      const PaymentData = {
        referenceNo: referenceNumber,
        channel: "gcash",
        amount: 1000,
        status: "pending",
        client: clientId,
        psychotherapist: appointmentData.selectedTherapist.$id
      };

      // Add booking and payment data to the database
      await addBookingData(BookingsData);
      await addPaymentData(PaymentData);

      console.log("Booking and Payment data successfully created.");

      // Close the modal after submission
      onClose();
      
      // Show success modal
      setShowSuccessModal(true);

      // Reload the page after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  async function addBookingData(BookingsData: { client: string; psychotherapist: string; slots: any; status: any; createdAt: any; mode: any; month: any; day: any; }) {
    try {
      await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
      console.log("Created Bookings Data");
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
  }

  async function addPaymentData(PaymentData: { referenceNo: string; channel: string; amount: number; status: string; client: string; psychotherapist: string; }) {
    try {
      await databases.createDocument('Butterfly-Database', 'Payment', 'unique()', PaymentData);
      console.log("Created Payment Data");
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
  }

  const closeSuccessModal = () => {
    setShowSuccessModal(false); // Hide success modal after user closes it
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">GCash Payment</h1>
        <p className="text-gray-600">You have selected GCash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <label className="text-2xl block mb-2 text-gray-800 text-center">Please Scan the QR Code</label>
            <label className="block mb-2 text-gray-800 text-center">Amount to be paid: ₱1,000.00</label>

            <img src="/images/gcashqr.png" alt="gcashqr" className="mb-4" />

            {/* Reference Number Input */}
            <label htmlFor="referenceNumber" className="block text-gray-800 mb-2">Enter Reference Number</label>
            <input
              id="referenceNumber"
              type="text"
              value={referenceNumber}
              onChange={handleReferenceChange}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              maxLength={13}
              placeholder="Enter 13-digit number"
              required
            />

            {/* Display error if exists */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting || referenceNumber.trim().length !== 13 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || referenceNumber.trim().length !== 13}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Success modal */}
      <SuccessModal isVisible={showSuccessModal} onClose={closeSuccessModal} />
    </Modal>
  );
};

export default GCashPayment;
