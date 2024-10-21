import React from 'react';

interface SubmissionModalProps {
  isOpen: boolean;
  message: string;
  modalType: 'confirmation' | 'error' | 'success';
  onClose: () => void;
  onConfirm?: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  message,
  modalType,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
        {modalType === 'success' ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 rounded-full p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you for submitting!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing the Pre-Assessment! You will receive the results and recommendations in your email within a few hours. Please check your inbox for further instructions.
            </p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-700"
              onClick={onClose}
            >
              DONE
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-4">
              {modalType === 'confirmation' && 'Are you sure?'}
              {modalType === 'error' && 'Error'}
            </h2>
            <p className="text-sm mb-4">{message}</p>

            <div className="flex justify-between">
              {modalType === 'confirmation' && (
                <>
                  <button
                    onClick={onClose}
                    className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                  >
                    Submit
                  </button> 
                </>
              )}

              {modalType !== 'confirmation' && (
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 w-full"
                >
                  OK
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionModal;
