import { useEffect, useState } from "react";
import { databases } from "@/appwrite";
import { useRouter } from "next/navigation";
import { Models } from 'appwrite';

interface ClientProfileModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedReportDetails, setSelectedReportDetails] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'goals'>('sessions');

  const fetchClientData = async (id: string) => {
    try {
      const clientData = await databases.getDocument('Butterfly-Database', 'Client', id);
      return clientData;
    } catch (err: unknown) {
      console.error("Error fetching client data:", err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Unknown error occurred");
    }
  };

  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchClientProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchClientData(clientId);
        setClientData(response);
      } catch (err) {
        setError("Error fetching client profile");
        console.error('Error fetching client data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientProfile();
  }, [clientId, isOpen]);

  const handleReferClient = async () => {
    try {
      if (!clientData) {
        console.error('No client data available');
        return;
      }
  
      // Update both state and status in the document
      const updatedDocument = await databases.updateDocument(
        'Butterfly-Database',
        'Client',
        clientId,
        { state: 'referred', status: 'pending' } // Updating state and status
      );
  
      console.log('Document updated:', updatedDocument);
      const refreshedClientData = await fetchClientData(clientId);
      setClientData(refreshedClientData);
  
      alert('Client referred successfully!');
      window.location.reload();
      setIsConfirmModalOpen(false);
    } catch (err: unknown) {
      console.error("Error referring client:", err);
      if (err instanceof Error) {
        alert(`Error referring client: ${err.message}`);
      } else {
        alert(`Error referring client: Unknown error occurred`);
      }
    }
  };
  

  const handleViewDetails = (details: string) => {
    setSelectedReportDetails(details);
    setIsDetailsModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
          aria-label="Close modal"
        >
          &#10005;
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          clientData && (
            <>
              <div className="flex space-x-12 items-center">
                <div className="flex-shrink-0 text-center">
                  <img
                    src={clientData.profilePictureUrl || '/default-profile.jpg'}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/default-profile.jpg';
                    }}
                  />
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">
                    {clientData.firstname} {clientData.lastname}
                  </h2>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Client's Profile</h3>
                  <div className="grid grid-cols-2 gap-6 text-gray-700">
                    <div>
                      <p><strong>Home Address:</strong> {clientData.address}</p>
                      <p><strong>Date of Birth:</strong> {clientData.birthdate}</p>
                      <p><strong>Contact Number:</strong> {clientData.phonenum}</p>
                      <p><strong>Sex:</strong> {clientData.sex || 'Not Specified'}</p>
                      <p><strong>Age:</strong> {clientData.age || 'Not Specified'}</p>
                      <p><strong>Email Address:</strong> {clientData.email}</p>
                    </div>
                    <div>
                      <p><strong>Emergency Contact Person:</strong> {clientData.emergencyContact}</p>
                      <p><strong>Conditions:</strong></p>
                      <ul className="list-disc pl-4">
                        {Array.isArray(clientData.conditions) && clientData.conditions.length > 0 ? (
                          clientData.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))
                        ) : (
                          <li>No conditions available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center space-x-6">
                <button
                  onClick={() => setIsReportsModalOpen(true)}
                  className="bg-blue-400 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-blue-500 transition-all"
                >
                  View Reports
                </button>
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-green-600 transition-all"
                >
                  Refer
                </button>
              </div>
            </>
          )
        )}
      </div>

      {/* Reports Modal */}
      {isReportsModalOpen && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg relative">
            <button
              onClick={() => {
                setIsReportsModalOpen(false);
                onClose();
              }}
              className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
              aria-label="Close modal"
            >
              &#10005;
            </button>
            <h2 className="text-2xl text-blue-400 font-bold mb-6">Reports</h2>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              <div
                onClick={() => setActiveTab('sessions')}
                className={`cursor-pointer px-4 py-2 rounded-lg ${activeTab === 'sessions' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Sessions
              </div>
              <div
                onClick={() => setActiveTab('goals')}
                className={`cursor-pointer px-4 py-2 rounded-lg ${activeTab === 'goals' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Goals
              </div>
            </div>

            {/* Tab Content with Transitions */}
            <div className={`transition-opacity duration-300 ${activeTab === 'sessions' ? 'opacity-100' : 'opacity-0'}`}>
              {activeTab === 'sessions' && (
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    <table className="table-auto w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left border-blue-400 border-[1px] bg-blue-200">Session ID</th>
                          <th className="px-4 py-2 text-left border-blue-400 border-[1px] bg-blue-200">Time and Date</th>
                          <th className="px-4 py-2 text-left border-blue-400 border-[1px] bg-blue-200">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 20 }, (_, index) => ({
                          sessionId: `00${index + 1}A`,
                          dateTime: new Date(Date.now() - index * 86400000).toLocaleString(),
                          details: `Detailed report for session ${index + 1}`,
                        })).map((report, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border-blue-400 border-[1px]">{report.sessionId}</td>
                            <td className="px-4 py-2 border-blue-400 border-[1px]">{report.dateTime}</td>
                            <td className="px-4 py-2 border-blue-400 border-[1px]">
                              <button
                                onClick={() => handleViewDetails(report.details)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

                 {/* Tab Content with Transitions */}
                 <div className={`transition-opacity duration-300 ${activeTab === 'goals' ? 'opacity-100' : 'opacity-0'}`}>
              {activeTab === 'goals' && (
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="space-y-4">
                    <table className="table-auto w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left border-blue-400 border-[1px] bg-blue-200">Goal ID</th>
                          <th className="px-4 py-2 text-left border-blue-400 border-[1px] bg-blue-200">Time and Date</th>
                          <th className="px-4 py-2 text-left border-blue-400 border-[1px] bg-blue-200">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: 30 }, (_, index) => ({
                          sessionId: `00${index + 1}A`,
                          dateTime: new Date(Date.now() - index * 86400000).toLocaleString(),
                          details: `Detailed report for goal ${index + 1}`,
                        })).map((report, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border-blue-400 border-[1px]">{report.sessionId}</td>
                            <td className="px-4 py-2 border-blue-400 border-[1px]">{report.dateTime}</td>
                            <td className="px-4 py-2 border-blue-400 border-[1px]">
                              <button
                                onClick={() => handleViewDetails(report.details)}
                                className="text-blue-500 underline hover:text-blue-700"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setIsReportsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition-all"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg relative">
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
              aria-label="Close modal"
            >
              &#10005;
            </button>
            <h2 className="text-xl font-bold mb-4">Report Details</h2>
            <p>{selectedReportDetails}</p>
            <div className="mt-4">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Confirm Referral</h2>
            <p>Are you sure you want to refer this client?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReferClient}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfileModal;
