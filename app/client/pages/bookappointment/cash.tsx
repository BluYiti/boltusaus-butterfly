import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, restrictSelectingTherapist, updateClientPsychotherapist } from '@/hooks/userService';
import SuccessModal from './successfulbooking';

// Define the type for appointment data
interface AppointmentData {
  selectedTherapist: {
    $id: string;
  };
  selectedTime: string; // Can be more specific depending on what 'selectedTime' is
  createdAt: string; // Or Date if it's a Date object
  selectedMode: string;
  selectedMonth: number;
  selectedDay: number;
}

interface CashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: AppointmentData;
}

const CashPayment: React.FC<CashPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false); // State for success modal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Fetch user data
      const user = await account.get();
      const clientId = await fetchClientId(user.$id);
      const response = await databases.getDocument('Butterfly-Database', 'Client', clientId);
      let psychoId = response.psychotherapist;

      // If psychoId is null or empty, use the selected psychotherapist's ID
      if (!psychoId) {
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

      // Create the booking and get its ID
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

      setShowSuccess(true); // Show success modal

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to add booking data
  async function addBookingData(BookingsData: {
    client: string;
    psychotherapist: string;
    slots: string; // Change to correct type if necessary
    status: string;
    createdAt: string; // Or Date if it's a Date object
    mode: string;
    month: number;
    day: number;
  }) {
    try {
      const response = await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
      console.log("Created Bookings Data", response);
      return response.$id; // Return the document ID
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Function to add payment data
  async function addPaymentData(PaymentData: {
    referenceNo: string | null;
    channel: string;
    amount: number;
    status: string;
    client: string;
    psychotherapist: string;
    booking: string;
  }) {
    try {
      await databases.createDocument('Butterfly-Database', 'Payment', 'unique()', PaymentData);
      console.log('Created Payment Data');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Cash Payment</h1>
        <p className="text-gray-600">You have selected Cash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <label className="text-2xl block mb-2 text-gray-800 text-center">Please Pay at the Clinic</label>

            {/* Reference Number Input */}
            <label htmlFor="referenceNumber" className="block text-red-700 mb-2">NOTE: To secure your appointment, kindly ensure payment is made 2-3 days in advance. If payment is not received, your appointment will be canceled.</label>

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
              className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting && !paymentAcknowledged ? 'bg-green-200 opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || !paymentAcknowledged}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        onClose={() => setShowSuccess(false)} // Close success modal
        isVisible={showSuccess} // Pass showSuccess state to SuccessModal
      />
    </Modal>
  );
};

export default CashPayment;
