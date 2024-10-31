'use client';

import { useState } from 'react';
import { account, databases} from '@/appwrite'; // Make sure to import databases
import { useRouter } from 'next/navigation';

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // Fetch user role from the accounts collection
    const fetchUserRole = async (userId: string) => {
        try {
            const response = await databases.getDocument('Butterfly-Database', 'Accounts', userId);
            return response.role; // Adjust this based on your data structure
        } catch (err) {
            console.error('Failed to fetch user role:', err);
            return null;
        }
    };

    // Redirect based on user role and state
    const handleUserRoleRedirect = (role: string) => {
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

    // Login function
    const login = async (email: string, password: string) => {
        setError(null); // Reset error before trying to log in
        setLoading(true); // Start loading

        try {
            let user = null;

            try {
                // Check if there is already an active session
                user = await account.get();
                console.log('User is already logged in:', user.$id);
            } catch (err) {
                console.log('No active session, proceeding to login...');
            }

            // If no session, attempt to log in
            if (!user) {
                try {
                    await account.createEmailPasswordSession(email, password);
                    user = await account.get(); // Fetch the user after successful login
                    console.log('Logged in user:', user.$id);
                } catch (err: any) {
                    console.error('Login failed:', err);
                    setError('Invalid email or password. Please try again.');
                    return;
                }
            }

            // Fetch user role and state
            const role = await fetchUserRole(user.$id);

            if (!role) {
                setError('No role assigned to the user. Contact support.');
                return;
            }

            // Handle redirection based on role and state
            handleUserRoleRedirect(role);
        } catch (err: any) {
            console.error('Error during login:', err);
            setError(`Login failed: ${err.message}`);
        } finally {
            setLoading(false); // Stop loading after all operations are complete
        }
    };

    return { login, error, loading };
};
