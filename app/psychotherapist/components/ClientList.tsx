import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ClientModal from './ClientModal';
import { useFetchClients } from '../hooks/useFetchClients';
import { Client } from '../hooks/useTypes';
import { useRouter } from 'next/navigation';

const ClientList: React.FC = () => {
  const { clients, setClients, error } = useFetchClients();
  const [activeTab, setActiveTab] = useState<string>('Current');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    console.log('File selected:', selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
        prevClients.map(c => (c.userID === client.userID ? { ...c, status } : c))
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

  const renderClientList = () => {
    let clientType = '';
    if (activeTab === 'Current') clientType = 'Current Client';
    else if (activeTab === 'To Be Evaluated') clientType = 'To Be Evaluated';
    else if (activeTab === 'For Referral') clientType = 'Referred';

    const filteredClients = clients.filter(
      client => client.status === clientType && client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div>
        {filteredClients.length === 0 ? (
          <p>No clients found</p>
        ) : (
          filteredClients.map(client => (
            <div key={client.userID} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-blue-700">
                  {client.initials}
                </div>
                <span className="font-semibold text-gray-800">{client.name}</span>
              </div>
              <div className="flex space-x-4">
                {clientType === 'Current Client' && (
                  <button
                    onClick={() => {
                      router.push('/psychotherapist/pages/pclientprofile');
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    View Profile
                  </button>
                )}
                {clientType === 'To Be Evaluated' && (
                  <button onClick={() => setSelectedClient(client)} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    View Assessment
                  </button>
                )}
                {clientType === 'Referred' && (
                  <div className="flex items-center space-x-2 ml-4">
                    {client.status === 'Attached Certificate' ? (
                      <>
                        <svg
                          className="h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm text-green-500">Attached Certificate</span>
                        <button
                          onClick={() => {
                            router.push('/psychotherapist/pages/pclientprofile');
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          View Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setShowUploadModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                          Attach Certificate
                        </button>
                        <button
                          onClick={() => {
                            router.push('/psychotherapist/pages/pclientprofile');
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          View Profile
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  function handleUpload(file: File): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button
            className={`pb-2 text-lg font-medium transition ${
              activeTab === 'Current' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('Current')}
          >
            Current
          </button>
          <button
            className={`pb-2 text-lg font-medium transition ${
              activeTab === 'To Be Evaluated' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('To Be Evaluated')}
          >
            To Be Evaluated
          </button>
          <button
            className={`pb-2 text-lg font-medium transition ${
              activeTab === 'For Referral' ? 'border-b-4 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('For Referral')}
          >
            For Referral
          </button>
        </div>
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded-lg"
          placeholder="Search Client"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {error ? <p className="text-red-500">{error}</p> : <div>{renderClientList()}</div>}

      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <div {...getRootProps()} className="w-full h-64 bg-blue-100 rounded-lg flex items-center justify-center text-gray-700">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <div className="flex flex-col items-center">
                  <p>Drop a File here</p>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Browse</button>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-4">
                <p>Selected File: {file.name}</p>
                <button onClick={() => handleUpload(file)} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg">
                  Upload
                </button>
              </div>
            )}

            <button onClick={() => setShowUploadModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
              Close
            </button>
          </div>
        </div>
      )}

      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onAccept={handleAccept}
          onRefer={handleRefer}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
};

export default ClientList;
