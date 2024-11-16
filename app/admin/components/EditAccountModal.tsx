import { useEffect, useState } from 'react';
import { databases } from '@/appwrite';
import { Query } from 'appwrite';
import SuccessModal from './SuccessfulMessage';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string; // To know which tab is currently active
  clientId: string;
}

const EditAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, selectedTab, clientId }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenum, setPhoneNum] = useState('63');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) return; // Exit if no clientId is provided
      setLoading(true); // Start loading
      setError(null); // Reset any previous errors
  
      try {
        // Map selectedTab to the corresponding database collection, query field, and field mappings
        const collectionMap = {
          Psychotherapist: {
            collection: "Psychotherapist",
            queryField: "userId",
            fieldMap: { firstName: "firstName", lastName: "lastName", emailField: "userId.email" },
          },
          Associate: {
            collection: "Associate",
            queryField: "userId",
            fieldMap: { firstName: "firstName", lastName: "lastName", emailField: "userId.email" },
          },
          Client: {
            collection: "Client",
            queryField: "userid",
            fieldMap: { firstName: "firstname", lastName: "lastname", emailField: "userid.email" },
          },
        };
  
        const config = collectionMap[selectedTab];
        if (!config) {
          setError('Invalid tab selected.');
          return;
        }
  
        const { collection, queryField, fieldMap } = config;
  
        const response = await databases.listDocuments('Butterfly-Database', collection, [
          Query.equal(queryField, clientId),
        ]);
  
        if (response?.documents?.length > 0) {
          const client = response.documents[0];
          setDocumentId(client.$id);
  
          // Dynamically map fields based on the current tab
          setFirstName(client[fieldMap.firstName] || '');
          setLastName(client[fieldMap.lastName] || '');
          // Access the email dynamically based on the field mapping
          const email = fieldMap.emailField.split('.').reduce((acc, key) => acc?.[key], client);
          setEmail(email || '');
          setPhoneNum(client.phonenum || '63');
        } else {
          setError('No client data found.');
        }
        {isModalOpen && (
          <SuccessModal selectedTab={selectedTab} message={"edited"} onClose={() => setModalOpen(false)} />
        )}
      } catch (err) {
        console.error('Error fetching client:', err);
        setError('Failed to fetch client data.');
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    fetchClient();
  }, [clientId, selectedTab, isModalOpen]); // Re-run whenever clientId or selectedTab changes
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null); // Reset any previous success message
    
    // Validate email format
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      setIsSubmitting(false);
      return;
    }
  
    // Validate phone number format
    if (!validatePhoneNumber(phonenum)) {
      setError('Phone number must start with 63 and be exactly 10 digits after 63.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      // Map selectedTab to the corresponding database collection and field names
      const collectionMap = {
        Psychotherapist: {
          collection: "Psychotherapist",
          fieldMap: { firstName: "firstName", lastName: "lastName", email: "userId.email" },
        },
        Associate: {
          collection: "Associate",
          fieldMap: { firstName: "firstName", lastName: "lastName", email: "userId.email" },
        },
        Client: {
          collection: "Client",
          fieldMap: { firstName: "firstname", lastName: "lastname", email: "userid.email" },
        },
      };
  
      const config = collectionMap[selectedTab];
      if (!config) {
        setError('Invalid tab selected.');
        setIsSubmitting(false);
        return;
      }
  
      const { collection, fieldMap } = config;
  
      // Prepare the updated data
      const updatedData: Record<string, string> = {
        [fieldMap.firstName]: firstName,
        [fieldMap.lastName]: lastName,
        phonenum: phonenum,
      };
  
      console.log(collection)
      console.log(clientId)
      console.log(updatedData)
  
      // Update the document using Appwrite
      const response = await databases.updateDocument(
        'Butterfly-Database',    // Database ID
        collection,              // Collection name
        documentId,              // Document ID (assumed clientId is the document ID)
        updatedData              // Data to update
      );
  
      // Update the state with the response data
      setFirstName(response[fieldMap.firstName] || '');
      setLastName(response[fieldMap.lastName] || '');
      setEmail(email);  // Email is directly updated, not part of response by default
      setPhoneNum(response.phonenum || '63');
  
      // Set success message
      setSuccessMessage('Account updated successfully!');
  
      setIsSubmitting(false);  // Stop submitting status
    } catch (err) {
      console.error('Error updating client:', err);
      setError(err.message || 'Failed to update account');
      setIsSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhoneNumber = (phone: string) => /^63\d{10}$/.test(phone);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-70">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Account</h2>

        {loading && <p className="text-blue-500">Loading client data...</p>}

        {!loading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-black"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-black"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-black"
              />
            </div>

            <div>
              <label htmlFor="phonenum" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phonenum"
                value={phonenum}
                onChange={(e) => setPhoneNum(e.target.value)}
                required
                maxLength={12}
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-black"
                placeholder="63"
              />
              <small className="text-xs text-black">Format: 63 followed by 10 digits</small>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-center px-6 py-3 rounded-lg shadow-lg">
          <p className="font-medium">{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default EditAccountModal;
