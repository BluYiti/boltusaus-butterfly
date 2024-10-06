// Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-red-600">Error</h2>
                <p>{message}</p>
                <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
