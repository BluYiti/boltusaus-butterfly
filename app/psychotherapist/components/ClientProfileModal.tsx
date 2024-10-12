import { useEffect, useState } from "react";
import { databases } from "@/appwrite";
import { useRouter } from "next/navigation";
import { Models } from 'appwrite'; // Adjust the import according to your project structure

// Define the props type
interface ClientProfileModalProps {
  clientId: string; // Adjust the type based on your actual clientId type
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();

  // Move fetchClientData function outside of useEffect
  const fetchClientData = async (id: string) => {
    try {
      const clientData = await databases.getDocument('Butterfly-Database', 'Client', id);
      return clientData;
    } catch (err: unknown) {
      console.error("Error fetching client data:", err);
      // Type guard to check if err is an instance of Error
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
        setClientData(response); // response should be of type Models.Document
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

      const updatedDocument = await databases.updateDocument(
        'Butterfly-Database',
        'Client',
        clientId,
        { state: 'referred' }
      );

      console.log('Document updated:', updatedDocument);
      const refreshedClientData = await fetchClientData(clientId);
      setClientData(refreshedClientData);

      alert('Client referred successfully!');
      setIsConfirmModalOpen(false);
    } catch (err: unknown) {
      console.error("Error referring client:", err);
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        alert(`Error referring client: ${err.message}`);
      } else {
        alert(`Error referring client: Unknown error occurred`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
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
                {/* Profile Image Section */}
                <div className="flex-shrink-0 text-center">
                  <img
                    src={clientData.profilePictureUrl || '/default-profile.jpg'}
                    alt="Profile"
                    className="w-48 h-48 rounded-full object-cover mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement; // Type assertion
                      target.onerror = null; // Prevent looping
                      target.src = '/default-profile.jpg'; // Fallback image
                    }}
                  />
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">
                    {clientData.firstname} {clientData.lastname}
                  </h2>
                </div>

                {/* Client Details Section */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Client’s Profile</h3>
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

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-6">
                <button
                  onClick={() => console.log('View Reports')}
                  className="bg-blue-400 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg hover:bg-blue-600 transition-all"
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

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to refer this client?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleReferClient}
                className="bg-blue-400 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
              >
                Yes
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-red-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfileModal;
