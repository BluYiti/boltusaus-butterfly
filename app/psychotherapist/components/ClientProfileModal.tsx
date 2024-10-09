// components/ClientProfileModal.tsx

import { useEffect, useState } from "react";
import { databases } from "@/appwrite"; // Adjust the import path to your appwrite service

const ClientProfileModal = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchClientData = async () => {
      try {
        setLoading(true);
        const response = await databases.getDocument(
          'YOUR_DATABASE_ID', // Replace with your Appwrite database ID
          'YOUR_COLLECTION_ID', // Replace with your collection ID
          clientId // The clientId passed in as prop
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"
        >
          &#10005;
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          clientData && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">{clientData.name}</h3>
              <p><strong>Email:</strong> {clientData.email}</p>
              <p><strong>Status:</strong> {clientData.status}</p>
              {/* You can add more fields here based on your client data */}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ClientProfileModal;
