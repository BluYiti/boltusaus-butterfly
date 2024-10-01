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
                className="w-full flex items-center hover:bg-red-600 p-2 rounded text-red-400"
            >
                <FiLogOut size={24} />
                {!isMinimized && <span className="ml-4">Logout</span>}
            </button>
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

export default LogoutButton;
