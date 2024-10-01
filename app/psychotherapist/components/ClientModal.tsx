import React from 'react';
import FetchPreAssessmentDetails from '@/psychotherapist/components/FetchPreassessmentDetails';
import { Client } from '../hooks/useTypes';

interface ModalProps {
  client: Client | null;
  onClose: () => void;
  onAccept: (client: Client) => void;
  onDecline: (client: Client) => void;
  onRefer: (client: Client) => void;
}

const ClientModal: React.FC<ModalProps> = ({ client, onClose, onAccept, onDecline, onRefer }) => {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-1/2">
        <h2 className="text-2xl font-bold mb-4">Pre-assessment evaluation</h2>
        <p className="mb-4"><strong>{client.name}'s Responses</strong></p>

        <FetchPreAssessmentDetails userID={client.userID} />

        {client.status === 'To Be Evaluated' && (
          <div className="flex space-x-4 mt-6">
            <button onClick={() => onAccept(client)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600">
              Accept
            </button>
            <button onClick={() => onDecline(client)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600">
              Decline
            </button>
            <button onClick={() => onRefer(client)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600">
              Refer
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-6 bg-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-400">
          Close
        </button>
      </div>
    </div>
  );
};

export default ClientModal;
