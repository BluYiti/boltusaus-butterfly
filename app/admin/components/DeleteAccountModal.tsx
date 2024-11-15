import { useState } from 'react';
import { account, databases, ID } from '@/appwrite';
import { Query } from 'appwrite';
import SuccessModal from './SuccessfulMessage';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string; // To know which tab is currently active
  clientId: string;
}

const DeleteAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, selectedTab, clientId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  const requiredConfirmation = 'DELETE';

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
  
    try {
      // Step 1: Delete the account in the Appwrite auth system
      await account.deleteIdentity(clientId);
  
      // Step 3: Delete the document in the correct collection (Psychotherapist/Associate/Client)
      const userAttribute = selectedTab === 'Client' ? 'userid' : 'userId';
  
      const documentToDelete = await databases.listDocuments('Butterfly-Database', selectedTab, [
        Query.equal(userAttribute, clientId)
      ]);
  
      if (documentToDelete.total > 0) {
        const documentId = documentToDelete.documents[0].$id;
  
        // Delete the document from the respective collection
        await databases.deleteDocument('Butterfly-Database', selectedTab, documentId);

        const documentToDeletePreAss = await databases.listDocuments('Butterfly-Database', 'Pre-Assessment', [
          Query.equal('client', clientId)
        ]);

        await databases.deleteDocument('Butterfly-Database', 'Pre-Assessment', documentToDeletePreAss.documents[0].$id);

        const documentToDeletePayments = await databases.listDocuments('Butterfly-Database', 'Payment', [
          Query.equal('client', clientId)
        ]);

        for (const document of documentToDeletePayments.documents) {
          try {
            // Delete each document by its $id
            await databases.deleteDocument('Butterfly-Database', 'Payment', document.$id);
            console.log(`Document with ID ${document.$id} deleted successfully.`);
          } catch (error) {
            console.error(`Failed to delete document with ID ${document.$id}:`, error);
          }
        }

        const documentToDeleteBookings = await databases.listDocuments('Butterfly-Database', 'Bookings', [
          Query.equal('client', clientId)
        ]);

        for (const document of documentToDeleteBookings.documents) {
          try {
            // Delete each document by its $id
            await databases.deleteDocument('Butterfly-Database', 'Bookings', document.$id);
            console.log(`Document with ID ${document.$id} deleted successfully.`);
          } catch (error) {
            console.error(`Failed to delete document with ID ${document.$id}:`, error);
          }
        }
      } else {
        throw new Error('Document not found in the collection');
      }

      const accountDocuments = await databases.listDocuments('Butterfly-Database', 'Accounts', [
        Query.equal('userId', clientId)
      ]);
  
      if (accountDocuments.total > 0) {
        const accountDocumentId = accountDocuments.documents[0].$id;
        await databases.deleteDocument('Butterfly-Database', 'Accounts', accountDocumentId);
      }
  
      // Show success modal (optional)
      setModalOpen(true);
      setConfirmationText(''); // Reset confirmation text
  
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Delete Account Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <h2 className="text-3xl text-red-700 text-center font-semibold">Are you sure you want to delete this account?</h2>
          <h2 className="text-2xl text-red-700 text-center font-semibold mb-4">Everything related to this account will be gone forever</h2>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={(e) => { e.preventDefault() }}>
            <div className="mb-4">
              <label htmlFor="confirmationInput" className="block text-sm font-medium text-gray-700">
                Type "DELETE" to confirm:
              </label>
              <input
                type="text"
                id="confirmationInput"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="mt-2 p-2 border border-gray-300 rounded w-full"
                placeholder="Type DELETE"
              />
            </div>

            <div className="flex justify-center space-x-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || confirmationText !== requiredConfirmation}
                className="px-6 py-3 font-bold bg-red-700 text-white rounded hover:bg-red-600 disabled:bg-red-300"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;
