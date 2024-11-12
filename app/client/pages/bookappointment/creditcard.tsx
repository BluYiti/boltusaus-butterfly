import React, { useState } from 'react';
import Modal from '@/components/Modal'; // The updated Modal component
import { account, databases } from '@/appwrite';
import { fetchClientId, restrictSelectingTherapist, updateClientPsychotherapist, uploadReceiptImage } from '@/hooks/userService';
import SuccessModal from './successfulbooking'; // Success Modal component

interface CreditCardPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: any; // Update this with the actual type for appointment data
}

const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false); // State for success modal
  const [receipt, setReceipt] = useState<File | null>(null); // State for receipt file
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null); // State for previewing the receipt

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/\D/g, ''); // Remove non-numeric characters
    if (inputValue.length > 13) {
      inputValue = inputValue.substring(0, 13); // Limit to 13 digits
    }
    setReferenceNumber(inputValue);
  };

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
    if (referenceNumber.length !== 13) {
      setError('Reference number must be 13 digits long');
      return;
    }
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
        referenceNo: referenceNumber,
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
  
      setTimeout(function() {
          window.location.reload();
      }, 5000);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('An error occurred while submitting your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  async function addBookingData(BookingsData: any) {
    try {
      const response = await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
      return response.$id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function addPaymentData(PaymentData: any) {
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
              <img src="/images/bpiqr.png" alt="bpiqr" className="mb-4" />

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
                  <img src={receiptPreview} alt="Receipt Preview" className="max-w-full max-h-40 object-contain" />
                </div>
              )}

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
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting || referenceNumber.trim().length !== 13 || !receipt ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting || referenceNumber.trim().length !== 13 || !receipt}
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
