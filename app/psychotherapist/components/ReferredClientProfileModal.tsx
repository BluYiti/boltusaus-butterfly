import { useEffect, useState } from "react";
import { databases, storage } from "@/appwrite"; // Make sure to initialize the Appwrite storage service
import Image from "next/image";
import { Models } from 'appwrite';
import { useRouter } from "next/navigation";

interface ReferredClientProfileModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReferredClientProfileModal: React.FC<ReferredClientProfileModalProps> = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedReportDetails, setSelectedReportDetails] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'goals'>('sessions');
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state to hold the selected file

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
      if (!selectedFile) {
        alert('Please upload a PDF file.');
        return;
      }
  
      // Step 1: Upload PDF to Appwrite storage
      const uploadedFile = await storage.createFile(
        'Images', // Replace with your storage bucket ID
        'unique()', // Generate a unique ID for the file
        selectedFile
      );
  
      console.log('File uploaded:', uploadedFile);
  
      // Step 2: Create a new document in the database with the uploaded file's ID
      const updatedDocument = await databases.updateDocument(
        'Butterfly-Database', // Your Appwrite database ID
        'Client',              // Collection ID set to 'Certificate'
        clientId,              // Generate a unique ID for the document
        { certificate: uploadedFile.$id, status: 'attached' }
      );
  
      console.log('Document updated with status "attached":', updatedDocument);
  
      // Ensure window is defined before calling window methods
      if (typeof window !== 'undefined') {
        window.location.reload();
        router.push(`/psychotherapist/pages/clients?tab=For%20Referral`);
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
  
  // Handler for file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
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
        className="bg-white p-8 max-w-4xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
          aria-label="Close modal"
        >
          &#10005;
        </button>

          {loading ? (
            <div className="bg-white rounded-full p-6 flex justify-center items-center">
              <Image 
                src={'/gifs/load.gif'} 
                alt={'loading'} 
                width={250} 
                height={250} 
                className='rounded-full'
              />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
          clientData && (
            <>
                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12 items-center">
                <div className="flex-shrink-0 text-center">
                  <Image
                  src={clientData.profilePictureUrl || '/default-profile.jpg'} // Fallback to default profile image
                  alt="Profile"
                  width={192}  // Width of the image (48 * 4 for higher resolution)
                  height={192} // Height of the image (48 * 4 for higher resolution)
                  className="rounded-full object-cover mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement; // Cast e.target to HTMLImageElement
                    target.src = '/default-profile.jpg'; // Handle fallback logic
                  }}
                  priority // Use priority if this image is important for initial load
                  />
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  {clientData.firstname} {clientData.lastname}
                  </h2>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Client’s Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
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
                  className={`text-white px-6 py-2 rounded-full shadow-md transition-all ${
                    clientData.status === 'attached' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                  disabled={clientData.status === 'attached'} // Disable the button if status is 'attached'
                >
                  {clientData.status === 'attached' ? 'Certificate already uploaded' : 'Upload Certificate'}
                </button>
              </div>
            </>
          )
        )}
      </div>

      {/* Confirm Refer Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-blue-400 hover:text-blue-600 absolute top-4 right-4"
              aria-label="Close modal"
            >
              &#10005;
            </button>
            <h2 className="text-xl text-gray-800 font-bold mb-6">Upload Certificate PDF</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleReferClient}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
              >
                Upload and Refer Client
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ReferredClientProfileModal;
