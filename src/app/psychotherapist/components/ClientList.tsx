import React, { useState } from 'react';
import ClientModal from './ClientModal';
import { useFetchClients } from '../hooks/useFetchClients';
import { Client } from '../hooks/useTypes';

const ClientList: React.FC = () => {
  const { clients, setClients, error } = useFetchClients();
  const [selectedOption, setSelectedOption] = useState<string>('Current Clients');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  const handleUpdateStatus = async (client: Client, role: string, status: string) => {
    try {
      const response = await fetch('/api/updateUserPrefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: client.userID,
          prefs: { role, status },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user preferences');
      }

      const data = await response.json();
      console.log('Updated user preferences:', data);

      setClients((prevClients: Client[]) =>
        prevClients.map(c =>
          c.userID === client.userID ? { ...c, status } : c
        )
      );
      setSelectedClient(null);
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  const handleAccept = async (client: Client) => {
    console.log(`Accepted: ${client.name}`);
  
    await handleUpdateStatus(client, 'client', 'Current Client');
  
    try {
      const response = await fetch('/api/sendMagicURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: client.userID,  
          email: client.email,    
          name: client.name,      
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send Magic URL email');
      }
  
      const data = await response.json();
      console.log('Magic URL email sent successfully:', data);
    } catch (error) {
      console.error('Error sending Magic URL email:', error);
    }
  };

  const handleRefer = async (client: Client) => {
    console.log(`Referred: ${client.name}`);
    await handleUpdateStatus(client, 'client', 'Referred');
  };
  
  const filteredClients = clients.filter(client =>
    (selectedOption === 'Current Clients' && client.status === 'Current Client') ||
    (selectedOption === 'Referred Clients' && client.status === 'Referred') ||
    (selectedOption === 'To Be Evaluated' && client.status === 'To Be Evaluated')
  );

  function handleDecline(client: Client): void {
    console.log(`Declined: ${client.name}`);
    handleUpdateStatus(client, 'client', 'Declined');
  }

  return (
    <div>
      {/* Dropdown */}
      <div className="relative">
        <button onClick={handleDropdownClick} className="bg-white text-black font-semibold rounded-lg px-4 py-2 flex items-center">
          <span>{selectedOption}</span>
          <span>{showDropdown ? '▴' : '▾'}</span>
        </button>
        {showDropdown && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button onClick={() => handleOptionClick('Current Clients')} className="block px-4 py-2 text-left hover:bg-gray-100">
              Current Clients
            </button>
            <button onClick={() => handleOptionClick('Referred Clients')} className="block px-4 py-2 text-left hover:bg-gray-100">
              Referred Clients
            </button>
            <button onClick={() => handleOptionClick('To Be Evaluated')} className="block px-4 py-2 text-left hover:bg-gray-100">
              To Be Evaluated
            </button>
          </div>
        )}
      </div>

      {/* Clients List */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        filteredClients.map(client => (
          <div key={client.userID} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-blue-700">
                {client.initials}
              </div>
              <span className="font-semibold text-gray-800">{client.name}</span>
            </div>
            <button onClick={() => setSelectedClient(client)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
              Review Pre-Assessment
            </button>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onRefer={handleRefer}
        />
      )}
    </div>
  );
};

export default ClientList;
