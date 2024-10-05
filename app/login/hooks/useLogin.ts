'use client';

import { useState } from 'react';
import { account } from '@/appwrite';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setError(null);

        try {

            let user = null;
            try {
                user = await account.get();
                console.log('User is already logged in:', user.$id);
            } catch (err) {

                console.log('No active session, logging in...');
            }


            if (!user) {
                await account.createEmailPasswordSession(email, password);
                user = await account.get();
                console.log('Logged in user:', user.$id);
            }


            handleUserRoleRedirect(user);
        } catch (err: any) {
            console.error('Error during login:', err);
            setError(`Login failed: ${err.message}`);
        }
    };

    const handleUserRoleRedirect = (user: any) => {
        const role = user.prefs?.role || user.labels?.[0];
        switch (role) {
            case 'admin':
                router.push('/admin');
                break;
            case 'psychotherapist':
                router.push('/psychotherapist');
                break;
            case 'associate':
                router.push('/associate');
                break;
            case 'client':
                router.push('/client');
                break;
            default:
                setError('Unknown role. Please contact support.');
        }
    };

    return { login, error };
};
