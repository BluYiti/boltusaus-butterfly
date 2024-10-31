// RescheduleConfirmationModal.tsx
import React from 'react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold">Confirm Reschedule</h3>
        <p>Are you sure you want to reschedule this appointment?</p>
        <div className="flex justify-end mt-4">
          <button className="mr-2 bg-gray-300 text-black py-1 px-3 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white py-1 px-3 rounded" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
