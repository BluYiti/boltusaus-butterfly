import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, fetchClientPsycho } from '@/hooks/userService';

interface CashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: any;
}

const CashPayment: React.FC<CashPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [client, setClientId] = useState<string>('');
  const [psycho, setPsychoId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);

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
      // Fetch user data when submitting the form
      const user = await account.get();
      const clientId = await fetchClientId(user.$id);
      const psychoId = await fetchClientPsycho(user.$id);

      setClientId(clientId); // Set client ID state
      setPsychoId(psychoId); // Set psychotherapist ID state

      const BookingsData = {
        client: client,
        psychotherapist: psycho,
        slots: appointmentData.selectedTime,
        status: "pending",
        createdAt: appointmentData.createdAt,
        mode: appointmentData.selectedMode,
        month: appointmentData.selectedMonth,
        day: appointmentData.selectedDay
      };

      const PaymentData = {
        referenceNo: referenceNumber,
        channel: "cash",
        amount: 1000,
        status: "pending",
        client: client,
        psychotherapist: psycho
      };

      // Add booking and payment data to the database
      await addBookingData(BookingsData);
      await addPaymentData(PaymentData);

      console.log("Booking and Payment data successfully created.");

      // Close the modal after submission
      onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Cash Payment</h1>
        <p className="text-gray-600">You have selected Cash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <label className="text-2xl block mb-2 text-gray-800 text-center">Please Scan the QR Code</label>

            {/* Reference Number Input */}
            <label htmlFor="referenceNumber" className="block text-gray-800 mb-2">NOTE: Please pay before the day of the booked appointment</label>

            {/* Display error if exists */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Checkbox for acknowledging payment deadline */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="paymentAcknowledgement"
                checked={paymentAcknowledged}
                onChange={(e) => setPaymentAcknowledged(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="paymentAcknowledgement" className="text-gray-800 text-sm">
                I understand that if payment is not made before the appointment, my booking will be canceled.
              </label>
            </div>

            <button
              type="submit"
              className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting || referenceNumber.trim().length !== 13 || !paymentAcknowledged ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || referenceNumber.trim().length !== 13 || !paymentAcknowledged}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CashPayment;
