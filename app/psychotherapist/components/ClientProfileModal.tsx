import { useEffect, useState } from "react";
import { databases, Query } from "@/appwrite";
import Image from 'next/image';
import { Models } from 'appwrite';
import { fetchProfileImageUrl } from "@/hooks/userService";

interface ClientProfileModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState<Models.Document | null>(null);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [isSessionDetailsModalOpen, setIsSessionDetailsModalOpen] = useState(false);
  const [isPaymentsDetailsModalOpen, setIsPaymentsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'payments' | 'goals'>('sessions');
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);

  // Format the birthdate into a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fetchClientData = async (id: string) => {
    try {
      const clientData = await databases.getDocument('Butterfly-Database', 'Client', id);
      const profileImages = {};
      const url = await fetchProfileImageUrl(clientData.profilepic);
      if (url) {
        profileImages[clientData.$id] = url;
      }
      setProfileImageUrls(profileImages);
      console.log(url);
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

    const fetchClientSessions = async () => {
      try {
        // Fetch user state
        const clientSessions = await databases.listDocuments(
          'Butterfly-Database',
          'Bookings',
          [Query.equal('client', clientId)] // Fetch documents where userid matches the logged-in user
        );
        
        setSessions(clientSessions.documents || []);
      } catch (err) {
        setError("Error fetching client profile");
        console.error('Error fetching client data:', err);
      } finally {
        setLoading(false);
      }
    }

    const fetchClientPayments = async () => {
      try {
        // Fetch user state
        const clientPayments = await databases.listDocuments(
          'Butterfly-Database',
          'Payment',
          [Query.equal('client', clientId)] // Fetch documents where userid matches the logged-in user
        );
        
        setPayments(clientPayments.documents || []);
      } catch (err) {
        setError("Error fetching client profile");
        console.error('Error fetching client data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchClientProfile();
    fetchClientSessions();
    fetchClientPayments();
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
  
      // Ensure window is defined before calling window methods
      if (typeof window !== 'undefined') {
        window.location.reload(); // Reload the page only on the client side
      }
      
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

  const handleViewSessionDetails = () => {
    setIsSessionDetailsModalOpen(true);
  };
  
  const handleViewPaymentsDetails = () => {
    setIsPaymentsDetailsModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-8">
      <div
      role="dialog"
      aria-modal="true"
      className="bg-white rounded-lg p-4 sm:p-8 w-full max-w-4xl shadow-lg relative"
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
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-12 items-center">
          <div className="flex-shrink-0 text-center">
            <Image
            src={profileImageUrls[clientId] || '/images/default-profile.png'}
            alt="Profile"
            width={192} // Equivalent to 48 * 4 for a consistent image size
            height={192} // Equivalent to 48 * 4 for a consistent image size
            className="rounded-full object-cover mx-auto aspect-square"
            unoptimized
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {clientData.firstname} {clientData.lastname}
            </h2>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Client&apos;s Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p><strong>Home Address:</strong> {clientData.address}</p>
              <p><strong>Date of Birth:</strong> {clientData.birthdate ? formatDate(clientData.birthdate) : 'Loading...'}</p>
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

          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
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
                onClick={() => setActiveTab('payments')}
                className={`cursor-pointer px-4 py-2 rounded-lg ${activeTab === 'payments' ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Payments
              </div>
            </div>

            {/* SESSIONS */}
            <div className={`transition-opacity duration-300 ${activeTab === 'sessions' ? 'opacity-100' : 'opacity-0'}`}>
              {activeTab === 'sessions' && (
                <div className="max-h-[400px] overflow-y-auto">
                  {sessions.length > 0 ? (
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
                          {sessions.map((session, index) => (
                            <tr key={session.$id || index}>
                              <td className="px-4 py-2 border-blue-400 border-[1px]">{session.$id}</td>
                              <td className="px-4 py-2 border-blue-400 border-[1px]">{new Date(session.$createdAt).toLocaleString()}</td>
                              <td className="px-4 py-2 border-blue-400 border-[1px]">
                                <button
                                  onClick={() => handleViewSessionDetails()}
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
                  ) : (
                    <p className="text-center text-gray-500 mt-4">No sessions found.</p>
                  )}
                </div>
              )}
            </div>

            {/* PAYMENTS */}
            <div className={`transition-opacity duration-300 ${activeTab === 'payments' ? 'opacity-100' : 'opacity-0'}`}>
              {activeTab === 'payments' && (
                <div className="max-h-[400px] overflow-y-auto">
                  {payments.length > 0 ? (
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
                          {payments.map((payments, index) => (
                            <tr key={payments.$id || index}>
                              <td className="px-4 py-2 border-blue-400 border-[1px]">{payments.$id}</td>
                              <td className="px-4 py-2 border-blue-400 border-[1px]">{new Date(payments.$createdAt).toLocaleString()}</td>
                              <td className="px-4 py-2 border-blue-400 border-[1px]">
                                <button
                                  onClick={() => handleViewPaymentsDetails()}
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
                  ) : (
                    <p className="text-center text-gray-500 mt-4">No sessions found.</p>
                  )}
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

      {/* Session Details Modal */}
      {isSessionDetailsModalOpen && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg relative">
            <button
              onClick={() => setIsSessionDetailsModalOpen(false)}
              className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
              aria-label="Close modal"
            >
              &#10005;
            </button>

            <h2 className="text-xl font-bold mb-4">Session Report Details</h2>

            <div className="space-y-4"> 
              {sessions.map((session, index) => (
                <div 
                  key={session.$id || index} 
                  className="border border-blue-400 rounded-lg p-4 bg-gray-100"
                >
                  <p><strong>Session ID:</strong> {session.$id}</p>
                  <p><strong>Client ID:</strong> {session.client.$id}</p>
                  <p><strong>Psycho ID:</strong> {session.client.$id}</p>
                  <p><strong>Date:</strong> {session.month} {session.day} {session.slots}</p>
                  <p><strong>Created At:</strong> {new Date(session.$createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setIsSessionDetailsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments Details Modal */}
      {isPaymentsDetailsModalOpen && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg relative">
            <button
              onClick={() => setIsPaymentsDetailsModalOpen(false)}
              className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
              aria-label="Close modal"
            >
              &#10005;
            </button>

            <h2 className="text-xl font-bold mb-4">Payment Report Details</h2>

            <div className="space-y-4"> 
              {payments.map((payment, index) => (
                <div 
                  key={payment.$id || index} 
                  className="border border-blue-400 rounded-lg p-4 bg-gray-100"
                >
                  <p><strong>Payment ID:</strong> {payment.$id}</p>
                  <p><strong>Client ID:</strong> {payment.client.$id}</p>
                  <p><strong>Created At:</strong> {new Date(payment.$createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setIsPaymentsDetailsModalOpen(false)}
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
