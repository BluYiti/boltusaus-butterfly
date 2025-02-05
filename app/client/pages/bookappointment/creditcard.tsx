import React, { useState } from 'react';
import Modal from '@/components/Modal'; // The updated Modal component
import { account, databases } from '@/appwrite';
import { fetchClientId, restrictSelectingTherapist, updateClientPsychotherapist, uploadReceiptImage } from '@/hooks/userService';
import SuccessModal from './successfulbooking'; // Success Modal component
import Image from 'next/image';

interface CreditCardPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: AppointmentData; // Update this with the actual type for appointment data
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
  createdAt: string; // Timestamp when appointment was created
}

const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false); // State for success modal
  const [receipt, setReceipt] = useState<File | null>(null); // State for receipt file
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null); // State for previewing the receipt

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
  
    // Validation checks
    if (!receipt) {
      setError('Please upload a receipt');
      return;
    }
  
    setError(''); // Clear previous error
    setIsSubmitting(true);
  
    try {
      // 1. Upload the receipt image to the "Bucket Images" storage and get the receipt ID
      const receiptUploadResponse = await uploadReceiptImage(receipt);  // Implement this function for your specific storage
      const receiptId = receiptUploadResponse.id;  // Assuming the response includes an ID for the uploaded receipt
  
      if (!receiptId) {
        setError('Failed to upload receipt');
        return;
      }
  
      // 2. Fetch the user and client information
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
        day: appointmentData.selectedDay,
      };
  
      const bookingId = await addBookingData(BookingsData);
  
      // 4. Create the payment data with the receipt ID
      const PaymentData = {
        channel: "bpi",
        amount: 1000,
        status: "pending",
        client: clientId,
        psychotherapist: appointmentData.selectedTherapist.$id,
        booking: bookingId,
        receipt: receiptId  // Set the receiptId here
      };
  
      await addPaymentData(PaymentData);
  
      setShowSuccess(true); // Show success modal
      console.log("showing success modal");
  
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
    <>
      {/* Credit Card Payment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 flex flex-col items-center max-h-[85vh] overflow-y-auto"> {/* Make modal content scrollable */}
          <h1 className="text-3xl font-bold mb-4">BPI Card Payment</h1>
          <p className="text-gray-600">
            You have selected BPI Card as your payment method.
          </p>
          <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
            <form onSubmit={handleSubmit}>
              <label className="text-2xl block mb-2 text-gray-800 text-center">Please Scan the QR Code</label>
              <label className="block mb-2 text-gray-800 text-center">Amount to be paid: ₱1,000.00</label>
              <Image
                src="/images/bpiqr.png"
                alt="bpiqr"
                className="mb-4"
                width={400}  // Set an appropriate width for the image
                height={400} // Set an appropriate height for the image
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
                    className="max-w-full max-h-40 object-contain"
                    width={400} // Set an appropriate width (use the image's intrinsic width or a fixed value)
                    height={160} // Set an appropriate height (use the image's intrinsic height or a fixed value)
                  />
                </div>
              )}

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
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        onClose={() => setShowSuccess(false)} // Close success modal
        isVisible={showSuccess} // Pass showSuccess state to SuccessModal
      />
    </>
  );
};

export default CreditCardPayment;
