import React, { useState } from 'react';

// TakeNotesModal Component
const TakeNotesModal = ({clientName, isOpen, onClose }) => {
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Logic to save notes (e.g., sending to a server, or storing in state)
    console.log('Notes saved:', notes);
    // Clear notes after saving
    setNotes('');
    // Close the modal
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="font-semibold text-lg mb-4">Take Notes</h2>
        <textarea
          className="w-full h-40 p-2 border border-gray-300 rounded"
          placeholder="Write your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleSave} 
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mr-2"
          >
            Save
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-300 text-black py-1 px-3 rounded hover:bg-gray-400 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeNotesModal;
