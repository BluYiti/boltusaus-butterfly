import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, restrictSelectingTherapist, updateClientPsychotherapist, uploadReceiptImage } from '@/hooks/userService'; // Assuming you have the uploadReceiptImage function
import SuccessModal from './successfulbooking';
import Image from 'next/image';

interface GCashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: AppointmentData;
}

interface Therapist {
  $id: string;
  name: string;
}

interface AppointmentData {
  selectedTherapist: Therapist;
  selectedTime: string; // Assuming it's a time string
  selectedMode: string; // Payment method or mode of appointment (e.g., GCash)
  selectedMonth: string;
  selectedDay: string;
  createdAt: string ; // Timestamp when appointment was created
}

const GCashPayment: React.FC<GCashPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false); // State for success modal
  const [receipt, setReceipt] = useState<File | null>(null); // State for receipt file
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null); // State for receipt preview URL

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string); // Set the receipt preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure receipt is uploaded
    if (!receipt) {
      setError('Please upload a receipt');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // 1. Upload the receipt image to the storage and get the receipt ID
      const receiptUploadResponse = await uploadReceiptImage(receipt); // Assuming you have the uploadReceiptImage function
      const receiptId = receiptUploadResponse.id;

      if (!receiptId) {
        setError('Failed to upload receipt');
        return;
      }

      // 2. Fetch user data
      const user = await account.get();
      const clientId = await fetchClientId(user.$id);
      const response = await databases.getDocument('Butterfly-Database', 'Client', clientId);
      let psychoId = response.psychotherapist;

      if (!psychoId) {
        psychoId = appointmentData.selectedTherapist.$id;
        updateClientPsychotherapist(clientId, psychoId);
      }

      restrictSelectingTherapist(clientId);

      // 3. Create the booking data
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

      const bookingId = await addBookingData(BookingsData);

      // 4. Create the payment data with the receipt ID
      const PaymentData = {
        channel: "gcash",
        amount: 1000,
        status: "pending",
        client: clientId,
        psychotherapist: appointmentData.selectedTherapist.$id,
        booking: bookingId,
        receipt: receiptId  // Set the receipt ID here
      };

      // Add payment data to the database
      await addPaymentData(PaymentData);

      console.log("Booking and Payment data successfully created.");

      setShowSuccess(true); // Show success modal

      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 5000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('An error occurred while submitting your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  async function addBookingData(BookingsData) {
    try {
      const response = await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
      return response.$id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function addPaymentData(PaymentData) {
    try {
      await databases.createDocument('Butterfly-Database', 'Payment', 'unique()', PaymentData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center max-h-[85vh] overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">GCash Payment</h1>
        <p className="text-gray-600">You have selected GCash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <label className="text-2xl block mb-2 text-gray-800 text-center">Please Scan the QR Code</label>
            <label className="block mb-2 text-gray-800 text-center">Amount to be paid: ₱1,000.00</label>

            <Image 
              src="/images/gcashqr.png" 
              alt="gcashqr" 
              width={400} 
              height={400} 
              className="mb-4"
            />

            {/* Receipt Upload */}
            <label className="block text-gray-800 mb-2">Upload Your Receipt</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleReceiptChange}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            {receiptPreview && (
              <div className="mb-4">
                <p className="text-gray-800">Receipt Preview:</p>
                <Image 
                  src={receiptPreview} 
                  alt="Receipt Preview" 
                  width={500} // Set a specific width
                  height={200} // Set a specific height
                  className="max-w-full max-h-40 object-contain"
                />
              </div>
            )}

            {/* Display error if exists */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting || !receipt ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting || !receipt}
            >
              {isSubmitting ? 'Processing...' : 'Next'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        onClose={() => setShowSuccess(false)}
        isVisible={showSuccess}
      />
    </Modal>
  );
};

export default GCashPayment;
