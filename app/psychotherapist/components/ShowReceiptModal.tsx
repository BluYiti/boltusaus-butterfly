import React, { useState, useEffect } from 'react';
import { fetchProfileImageUrl } from '@/hooks/userService'; // Import your function

interface ShowReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string; // The URL or identifier for the image
}

const ShowReceiptModal: React.FC<ShowReceiptModalProps> = ({ isOpen, onClose, imageUrl }) => {
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch the URL using your service function
        const url = await fetchProfileImageUrl(imageUrl);
        if (url) {
          setReceiptImageUrl(url); // Set the URL directly
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setReceiptImageUrl(null); // Handle errors by resetting to null
      }
    };

    if (imageUrl) {
      fetchImage(); // Trigger the image fetch when the modal opens
    }
  }, [imageUrl]); // Re-fetch if imageUrl changes

  // Handle clicking outside the modal and pressing Escape key
  useEffect(() => {
    if (!isOpen) return;

    // Close modal when pressing Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Placeholder image URL (could be a local image or an online placeholder)
  const placeholderImage = '/Images/noreceipt.png';  // Change to actual placeholder image URL

  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div
      id="modal-container"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-auto max-h-[80vh] overflow-auto">
        <div className="relative">
          {/* Display the image or a placeholder */}
          <img
            src={receiptImageUrl || placeholderImage} // Fallback to placeholder if image is null
            alt="Receipt"
            className="w-full h-auto max-h-[60vh] object-contain"
          />

          {/* Close button */}
          <button
            className="absolute top-2 right-2 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowReceiptModal;
