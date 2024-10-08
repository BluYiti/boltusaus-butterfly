import React from 'react';
import FetchPreAssessmentDetails from '@/psychotherapist/components/FetchPreassessmentDetails';
import { Client } from '../hooks/useTypes';

interface ModalProps {
  client: Client | null;
  onClose: () => void;
  onAccept: (client: Client) => void;
  onRefer: (client: Client) => void;
}

const ClientModal: React.FC<ModalProps> = ({ client, onClose, onAccept, onRefer }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-8 w-1/2">
        {/* X button in the top right */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">Pre-assessment evaluation</h2>
        <p className="mb-4"><strong>{client.name}'s Responses</strong></p>

        <FetchPreAssessmentDetails userID={client.userID} />

        {client.status === 'To Be Evaluated' && (
          <div className="flex space-x-4 mt-6">
            <button onClick={() => onAccept(client)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600">
              Accept
            </button>
            <button onClick={() => onRefer(client)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600">
              Refer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientModal;
