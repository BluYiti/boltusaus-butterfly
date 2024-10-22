import { databases, Query } from '@/appwrite';

interface ReferClientProps {
  clientId: string;
  score: number;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReferClient: React.FC<ReferClientProps> = ({ clientId, score, showModal, setShowModal }) => {
  const confirmRefer = async () => {
    try {
      console.log("Starting the client acceptance process...");
  
      // Update the state attribute of the client document to "current"
      console.log(`Updating client state to 'current' for clientId: ${clientId}`);
      await databases.updateDocument(
        'Butterfly-Database',
        'Client',
        clientId,
        { 
            state: 'referred',
            status: 'pending'
        }
      );
      console.log("Client state updated successfully.");
  
      // Query for the document in the Pre-Assessment Collection
      console.log(`Querying pre-assessment document for clientId: ${clientId}`);
      const preAssessmentDocuments = await databases.listDocuments(
        'Butterfly-Database',
        'Pre-Assessment',
        [Query.equal('userID', clientId)]
      );
  
      const preAssessmentDocumentId = preAssessmentDocuments.documents[0].$id;
  
      // Update the score of the document in the Pre-Assessment Collection
      console.log(`Updating pre-assessment score for documentId: ${preAssessmentDocumentId}`);
      await databases.updateDocument(
        'Butterfly-Database',
        'Pre-Assessment',
        preAssessmentDocumentId,
        { score: score }
      );
      console.log("Pre-assessment score updated successfully.");
  
      // Navigate to accepted client booking page
      console.log("Navigating to the accepted client booking page.");
      window.location.reload();
    } catch (error) {
      console.error(`Error during client acceptance process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setShowModal(false);
      console.log("Client acceptance process finished.");
    }
  };
  

  const cancelRefer = () => {
    setShowModal(false);
  };

  return (
    <div className='z-50'>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to refer this client?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRefer}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefer}
                className="px-4 py-2 bg-green-500 text-white rounded"
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

export default ReferClient;
