import { useState } from 'react';
import { databases } from '@/appwrite';  // Ensure you have the Appwrite users SDK imported
import { Query } from 'appwrite';
import SuccessModal from './SuccessfulMessage';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string;
  clientId: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose, selectedTab, clientId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  const requiredConfirmation = 'DELETE';

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const userAttribute = selectedTab === 'Client' ? 'userid' : 'userId';

      // Find the document to delete from the selectedTab collection
      const documentToDelete = await databases.listDocuments('Butterfly-Database', selectedTab, [
        Query.equal(userAttribute, clientId)
      ]);

      if (documentToDelete.total > 0) {
        const documentId = documentToDelete.documents[0].$id;

        // If the selected tab is "Client", delete associated documents from other collections first
        if (selectedTab === "Client") {
          // Delete associated documents in other collections first
          await deleteAssociatedDocuments(clientId);
        }

        // Now delete the document from the selectedTab collection
        await databases.deleteDocument('Butterfly-Database', selectedTab, documentId);

        // Delete the document from the Accounts collection using the clientId
        await databases.deleteDocument('Butterfly-Database', 'Accounts', clientId);

        // Delete user from Appwrite authentication system

        // Show success modal
        setModalOpen(true);
      } else {
        throw new Error('Document not found in the selected collection');
      }

    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to delete associated documents for 'Client'
  const deleteAssociatedDocuments = async (clientId: string) => {
    try {
      await Promise.all([
        deleteFromCollection('Pre-Assessment', 'userID', clientId),
        deleteFromCollection('Payment', 'client', clientId),
        deleteFromCollection('Bookings', 'client', clientId),
      ]);
    } catch (error) {
      console.log('Error deleting associated documents:', error);
    }
  };

  // Helper function to delete from a specific collection
  const deleteFromCollection = async (collection: string, attribute: string, clientId: string) => {
    const docs = await databases.listDocuments('Butterfly-Database', collection, [
      Query.equal(attribute, clientId)
    ]);
    if (docs.total > 0) {
      await Promise.all(docs.documents.map(doc => databases.deleteDocument('Butterfly-Database', collection, doc.$id)));
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

          <form onSubmit={(e) => { e.preventDefault() }}>
            <div className="mb-4">
              <label htmlFor="confirmationInput" className="block text-sm font-medium text-gray-700">
                Type &quot;DELETE&quot; to confirm:
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

            {error && <p className="text-red-500">{error}</p>}

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

      {/* Success Modal */}
      {isModalOpen && (
        <SuccessModal
          selectedTab={selectedTab}
          message={"deleted"}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default DeleteAccountModal;
