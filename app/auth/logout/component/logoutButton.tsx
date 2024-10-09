import React, { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useLogout } from '@/auth/logout/hook/useLogout';

interface LogoutButtonProps {
    isMinimized: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isMinimized }) => {
    const { logout, error } = useLogout();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        if (error) {
            setModalOpen(true); // Open the pop-up if there's an error
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        if (error) {
            setModalOpen(true); // Open the pop-up when there's an error
        }
    }, [error]);

    return (
        <div className="mt-auto p-4 flex items-center">
            <button
                onClick={handleLogout}
                className="w-full flex items-center p-2 rounded text-red-400 hover:bg-red-700 hover:text-white"
            >
                <FiLogOut size={24} />
                {!isMinimized && <span className="ml-4">Logout</span>}
            </button>

            {/* Pop-up for error */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-red-600">Error</h2>
                        <p>{error || 'An unknown error occurred.'}</p>
                        <button onClick={closeModal} className="mt-4 p-2 bg-red-500 text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogoutButton;
