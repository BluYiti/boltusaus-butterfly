'use client';

import { useState } from 'react';
import { account } from '@/app/appwrite';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setError(null); // Reset error before trying to log in

        try {
            // First, check if there is already an active session
            let user = null;
            try {
                user = await account.get();  // Check if a session exists
                console.log('User is already logged in:', user.$id);
            } catch (err) {
                console.log('No active session, proceeding to login...');
            }

            // If no user session exists, attempt to log in
            if (!user) {
                try {
                    // Attempt to create a new session with email and password
                    await account.createEmailPasswordSession(email, password);
                    user = await account.get();  // Fetch the user after successful login
                    console.log('Logged in user:', user.$id);
                } catch (err: any) {
                    // If an error occurs during login, catch and handle it here
                    console.error('Login failed:', err);
                    setError('Invalid email or password. Please try again.');
                    return;  // Stop further execution if login fails
                }
            }

            // If login was successful, handle redirection based on user role
            handleUserRoleRedirect(user);
        } catch (err: any) {
            console.error('Error during login:', err);
            setError(`Login failed: ${err.message}`);
        }
    };

    // Redirect based on user role
    const handleUserRoleRedirect = (user: any) => {
        const role = user.prefs?.role || user.labels?.[0];
        if (!role) {
            setError('No role assigned to the user. Contact support.');
            return;
        }
        
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
                const assignedPsychotherapist = user.prefs?.psychotherapist;
                if (assignedPsychotherapist) {
                    router.push('/client');
                } else {
                    router.push('/client/pages/therapist');
                }
                break;
            default:
                setError('Unknown role. Please contact support.');
        }
    };

    return { login, error };
};
