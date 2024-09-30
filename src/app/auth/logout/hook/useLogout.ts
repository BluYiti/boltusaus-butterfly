'use client';

import { useRouter } from 'next/navigation';
import { account } from '@/app/appwrite';
import { useState } from 'react';

export const useLogout = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const logout = async () => {
        try {
            await account.deleteSession('current');
            router.push('/auth/login');
        } catch (err: any) {
            console.error('Error during logout:', err);
            setError(`Logout failed: ${err.message}`);
        }
    };

    return { logout, error };
};
