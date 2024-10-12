import { useEffect, useState } from "react";
import { databases } from "@/appwrite"; // Ensure this path points correctly to your Appwrite instance configuration

interface ClientProfileModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await databases.getDocument(
          'Butterfly-Database', // Replace with your actual Appwrite database ID
          'Client', // Replace with your actual collection ID
          clientId // The clientId passed in as a prop
        );
        setClientData(response);
      } catch (err) {
        setError("Error fetching client profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg relative"
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
              <div className="flex space-x-8">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={clientData.profilePictureUrl || '/default-profile.jpg'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                  />
                </div>

                {/* Client Info */}
                <div>
                  <h3 className="text-3xl font-bold mb-2">{clientData.firstname} {clientData.lastname}</h3>
                  <p className="text-gray-600"><strong>Email:</strong> {clientData.email}</p>
                  <p className="text-gray-600"><strong>Referral Status:</strong> {clientData.status}</p>
                  <p className="text-gray-600"><strong>Date of Birth:</strong> {clientData.birthdate}</p>
                  <p className="text-gray-600"><strong>Contact Number:</strong> {clientData.phonenum}</p>
                  <p className="text-gray-600"><strong>Address:</strong> {clientData.address}</p>
                </div>
              </div>

              {/* Emergency Contact & Conditions */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <h3 className="font-semibold">Emergency Contact Person</h3>
                  <p>{clientData.emergencyContact}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Conditions</h3>
                  <ul className="list-disc pl-4">
                    {Array.isArray(clientData.conditions) && clientData.conditions.length > 0 ? (
                      clientData.conditions.map((condition: string, index: number) => (
                        <li key={index}>{condition}</li>
                      ))
                    ) : (
                      <li>No conditions available</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => console.log('View Reports')}
                  className="bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  View Reports
                </button>
                <button
                  onClick={() => console.log('Refer Client')}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  Refer
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={onClose}
                className="mt-6 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 block mx-auto"
              >
                Back
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default ClientProfileModal;
