import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;  // Optional title for modal to improve accessibility
  description?: string;  // Optional description for modal
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, description }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose(); // Close on Escape key press
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      onClick={(e) => {
        // Close modal if background overlay (but not modal content) is clicked
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}  // Prevent closing modal if clicking inside modal content
      >
        {/* Close Button */}
        <button
          aria-label="Close modal"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title and Content */}
        {title && <h2 id="modal-title" className="text-2xl font-semibold">{title}</h2>}
        {description && <p id="modal-description" className="text-lg text-gray-600">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
