import React, { useState, useEffect } from 'react';
import { fetchProfileImageUrl, findPaymentData } from '@/hooks/userService';
import Image from 'next/image';
import { databases } from '@/appwrite';

interface ShowReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  paymentId: string;
  client: any;
}

const ShowReceiptModal: React.FC<ShowReceiptModalProps> = ({ isOpen, onClose, imageUrl, paymentId, client}) => {
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (referenceNumber.length !== 13) {
      setError('Reference number must be 13 digits long');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const payData = await findPaymentData(paymentId);

      if (!payData) {
        throw new Error('Payment record not found.');
      }

      await databases.updateDocument('Butterfly-Database', 'Payment', payData, {
        status: 'paid',
        referenceNo: referenceNumber,
      });

      await databases.updateDocument('Butterfly-Database', 'Bookings', client.booking.$id, {
        status: 'paid',
      });

      setShowSuccess(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('An error occurred while submitting your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    if (inputValue.length > 13) {
      inputValue = inputValue.substring(0, 13);
    }
    setReferenceNumber(inputValue);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await fetchProfileImageUrl(imageUrl);
        setReceiptImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
        setReceiptImageUrl(null);
      }
    };

    if (imageUrl) {
      fetchImage();
    }
  }, [imageUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-auto max-h-[83vh]">
        <div className="relative">
          {client.channel === 'cash' ? (<></>) : (
          <Image
            src={receiptImageUrl || '/Images/noreceipt.png'}
            alt="Receipt"
            layout="responsive"
            width={600}
            height={400}
            className="w-full h-auto max-h-[60vh] object-contain"
            unoptimized
          />)}
          <button
            className="absolute top-2 right-2 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {client.status === 'pending' ? (<>
              <form onSubmit={handleSubmit} className="p-4 mb-4">
                {client.channel === 'cash' ? (
                  <p>Enter Payment Date</p>) : (
                  <label htmlFor="referenceNumber" className="block text-gray-800 mb-2">Enter Reference Number to Confirm Payment</label>
                )}
                {client.channel === 'cash' ? (
                  <input
                  id="referenceNumber"
                  type="text"
                  value={referenceNumber}
                  onChange={handleReferenceChange}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                  maxLength={13}
                  placeholder="Enter Date & Time (YYYY-MM-DD HH:MM)"
                  required
                />) : (
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
                )}
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button
                  type="submit"
                  className={`w-full p-2 bg-green-500 text-white rounded-lg ${isSubmitting || referenceNumber.trim().length !== 13 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || referenceNumber.trim().length !== 13}
                >
                  {isSubmitting ? 'Processing...' : 'Submit'}
                </button>
              </form></>
            ) : (
              <></>
            )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-green-600 text-lg font-semibold">Payment Successful!</h2>
            <p className="text-gray-700 mt-2">The payment status has been updated successfully.</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                window.location.href = `/psychotherapist/pages/clientspayment?tab=Paid`;
              }}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowReceiptModal;
