import React from 'react';
import { format } from 'date-fns';

interface ShowConfirmationModalProps {
    showConfirmationModal: boolean;
    setShowConfirmationModal: (show: boolean) => void;
    selectedDate: Date | null;
    onConfirm: () => void;
}

const ShowConfirmationModal: React.FC<ShowConfirmationModalProps> = ({
    showConfirmationModal,
    setShowConfirmationModal,
    selectedDate,
    onConfirm,
}) => {
    if (!showConfirmationModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-blue-500">Are you sure?</h2>
                <p className="mt-4 text-gray-700">
                    Do you want to save this goal for {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}?
                </p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => {
                            onConfirm();
                            setShowConfirmationModal(false);
                        }}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                        Yes, Save
                    </button>
                    <button
                        onClick={() => setShowConfirmationModal(false)} // Close the modal
                        className="ml-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowConfirmationModal;
