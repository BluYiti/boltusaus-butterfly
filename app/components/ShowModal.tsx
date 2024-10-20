import React from 'react';
import { format } from 'date-fns';

interface ShowModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    selectedDate: Date | null;
}

const ShowModal: React.FC<ShowModalProps> = ({ showModal, setShowModal, selectedDate }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-green-600">Goal Saved Successfully!</h2>
                <p className="mt-4 text-gray-700">Your goal for {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''} has been saved.</p>
                <button
                    onClick={() => setShowModal(false)}
                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ShowModal;
