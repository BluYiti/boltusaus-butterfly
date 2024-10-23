import { useRouter } from 'next/navigation';
import React from 'react';

interface ModalProps {
  selectedTab: string;
  onClose: () => void;
}

const SuccessModal: React.FC<ModalProps> = ({ selectedTab, onClose }) => {
  const router = useRouter();

  const handleOkayClick = () => {
    router.push('/admin/pages/account');
    onClose(); // You can close the modal after navigating if necessary
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Success</h2>
        <p className="mb-6">Successfully added {selectedTab} Account</p>
        <button
          onClick={handleOkayClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
