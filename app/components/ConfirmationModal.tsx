import React from 'react';
import { format } from 'date-fns';

interface ConfirmationModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    selectedDate: Date | null;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    showModal,
    setShowModal,
    selectedDate,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Close',
    onConfirm,
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold text-blue-500">{title}</h2>
                <p className="mt-4 text-gray-700">
                    {message} {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}
                </p>
                <div className="flex justify-end mt-4">
                    {onConfirm && (
                        <button
                            onClick={() => {
                                onConfirm();
                                setShowModal(false);
                            }}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                            {confirmLabel}
                        </button>
                    )}
                    <button
                        onClick={() => setShowModal(false)}
                        className={`ml-4 ${onConfirm ? 'bg-red-500' : 'bg-green-500'} text-white py-2 px-4 rounded-lg hover:${onConfirm ? 'bg-red-600' : 'bg-green-600'} transition-colors duration-300`}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
