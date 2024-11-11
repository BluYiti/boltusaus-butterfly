import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, fetchClientPsycho, restrictSelectingTherapist, updateClientPsychotherapist } from '@/hooks/userService';
import SuccessModal from './successfulbooking';

interface CashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: any;
}

const CashPayment: React.FC<CashPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Reset the error if validation passes
    setError('');
    setIsSubmitting(true);
  
    try {
      // Fetch user data
      const user = await account.get();
      const clientId = await fetchClientId(user.$id);
      const response = await databases.getDocument('Butterfly-Database', 'Client', clientId);
      let psychoId = response.psychotherapist;
  
      // Check if psychoId is null or empty
      if (!psychoId) {
        // If psychoId is null or empty, use the selected psychotherapist's ID
        psychoId = appointmentData.selectedTherapist.$id;
        updateClientPsychotherapist(clientId, psychoId);
      }
  
      restrictSelectingTherapist(clientId);
  
      const BookingsData = {
        client: clientId,
        psychotherapist: appointmentData.selectedTherapist.$id,
        slots: appointmentData.selectedTime,
        status: "pending",
        createdAt: appointmentData.createdAt,
        mode: appointmentData.selectedMode,
        month: appointmentData.selectedMonth,
        day: appointmentData.selectedDay
      };
  
      // Get the document ID of the newly created booking
      const bookingId = await addBookingData(BookingsData); 
  
      const PaymentData = {
        referenceNo: null,
        channel: "cash",
        amount: 1000,
        status: "pending",
        client: clientId,
        psychotherapist: appointmentData.selectedTherapist.$id,
        booking: bookingId,  // Set the booking document ID
      };
  
      // Add payment data
      await addPaymentData(PaymentData);
  
      console.log("Booking and Payment data successfully created.");
  
      // Show success modal only after both Booking and Payment data are added successfully
      setShowSuccessModal(true);
  
      // Close the modal or do something else
      onClose();
  
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  async function addBookingData(BookingsData: { client: string; psychotherapist: string; slots: any; status: any; createdAt: any; mode: any; month: any; day: any; }) {
    try {
      const response = await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
      console.log("Created Bookings Data", response);
      return response.$id; // Return the document ID
    } catch (error) {
      console.error(error); // Log the error for debugging
      throw error; // Rethrow the error to handle it in the calling function
    }
  }
  
  async function addPaymentData(PaymentData: { referenceNo: string; channel: string; amount: number; status: string; client: string; psychotherapist: string; }) {
    try {
      await databases.createDocument('Butterfly-Database', 'Payment', 'unique()', PaymentData);
      console.log('Created Payment Data');
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
            <label htmlFor="referenceNumber" className="block text-red-700 mb-2">NOTE: Please pay before the day of the booked appointment</label>

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
              className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting && !paymentAcknowledged ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || !paymentAcknowledged}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </form>
        </div>
      </div>

      {/* Success modal */}
      {showSuccessModal && (
        <div
          className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center z-50"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Booking Successful!</h2>
          <p className="text-lg text-gray-600 mb-4">Your appointment has been successfully booked.</p>
          <div className="flex items-center justify-center text-gray-600 text-lg mb-6">
            <span>Refreshing page</span>
            <div className="ml-3 w-8 h-8 border-4 border-t-4 border-blue-400 rounded-full animate-spin border-t-blue-800"></div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CashPayment;
