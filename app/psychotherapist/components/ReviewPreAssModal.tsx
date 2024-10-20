import React, { useState } from 'react';
import axios from 'axios';

const ReviewPreAssModal: React.FC<ReviewPreAssModalProps> = ({ isOpen, onClose }) => {
  const [score, setScore] = useState<number | null>(null);
  const clientId = "bella_swan"; // Example client ID

  if (!isOpen) return null;

  const handleAccept = async () => {
    try {
      await axios.post('/api/accept', { clientId, score });
      alert('Client accepted');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefer = async () => {
    try {
      await axios.post('/api/refer', { clientId });
      alert('Client referred');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg w-96 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Bella Swan</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Question 1:</label>
          <p className="mt-1 text-gray-500">asd</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Score:</label>
          <input
            type="number"
            value={score ?? ''}
            onChange={(e) => setScore(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleRefer}>
            Refer
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPreAssModal;
