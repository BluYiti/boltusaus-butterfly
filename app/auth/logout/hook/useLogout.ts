'use client';

import { useRouter } from 'next/navigation';
import { account } from '@/appwrite';
import { useState } from 'react';

export const useLogout = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const logout = async () => {
        try {
            await account.deleteSession('current');
            router.push('/login');
        } catch (err: any) {
            console.error('Error during logout:', err);
            // Check if err.message exists; otherwise, provide a fallback
            const message = err.message || 'An unexpected error occurred.';
            setError(`Logout failed: ${message}`);
        }
    };

    return { logout, error };
};
