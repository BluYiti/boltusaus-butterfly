import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useLogout } from '@/app/auth/logout/hook/useLogout';

interface LogoutButtonProps {
    isMinimized: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ isMinimized }) => {
    const { logout, error } = useLogout();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="mt-auto p-4 flex items-center">
            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
                <FiLogOut size={24} />
                {!isMinimized && <span className="ml-4">Logout</span>}
            </button>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default LogoutButton;
