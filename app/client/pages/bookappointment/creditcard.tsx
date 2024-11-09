import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, fetchClientPsycho } from '@/hooks/userService';

interface CreditCardPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: any; // Update this with the actual type for appointment data
}

const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const clientId = await fetchClientId(user.$id)
        const psychoId = await fetchClientPsycho(user.$id)
  
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
          channel: "bpi",
          amount: 1000,
          status: "pending",
          client: clientId,
          psychotherapist: psychoId
        }

        addBookingData(BookingsData);
        addPaymentData(PaymentData);
      } catch (err) {
        console.error(err); // Log the error for debugging
      }
    };
  
    fetchData();
  }, []);

  async function addBookingData(BookingsData: { client: string; psychotherapist: string; slots: any; status: any; createdAt: any; mode: any; month: any; day: any; }){
    try {
      await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
      console.log("Created Bookings Data");
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
    console.log('Client Collection document added');
  }

  async function addPaymentData(PaymentData: { referenceNo: string; channel: string; amount: number; status: string; client: string; psychotherapist: string; }){
    try {
      await databases.createDocument('Butterfly-Database', 'Payment', 'unique()', PaymentData);
      console.log("Created Payment Data");
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
    console.log('Client Collection document added');
  }

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

    // Simulate form submission (e.g., API call)
    try {
      console.log('Submitting reference number:', referenceNumber);
      // Add actual submission logic here, like calling an API or saving to state
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 id="modal-title" className="text-3xl font-bold mb-4">BPI Card Payment</h1>
        <p id="modal-description" className="text-gray-600">
          You have selected BPI Card as your payment method.
        </p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <label className="text-2xl block mb-2 text-gray-800 text-center">Please Scan the QR Code</label>
            <label className="block mb-2 text-gray-800 text-center">Amount to be paid: ₱1,000.00</label>

            <img src="/images/bpiqr.png" alt="bpiqr" className="mb-4" />

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
    </Modal>
  );
};

export default CreditCardPayment;
