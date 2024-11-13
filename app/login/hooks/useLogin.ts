'use client';

import { useState } from 'react';
import { account, databases } from '@/appwrite';
import { useRouter } from 'next/navigation';

interface User {
    $id: string;
    email: string;
    role?: string;
}

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // Fetch user role from the accounts collection
    const fetchUserRole = async (userId: string): Promise<string | null> => {
        try {
            const response = await databases.getDocument('Butterfly-Database', 'Accounts', userId);
            return response.role ?? null; // Ensure the role exists
        } catch (err) {
            console.error('Failed to fetch user role:', err);
            return null;
        }
    };

    // Redirect based on user role
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

    // Login function with improved session handling and JWT
    const login = async (email: string, password: string, rememberMe: boolean) => {
        setError(null); // Reset any prior errors
        setLoading(true); // Start loading

        try {
            let user: User | null = null;

            // Check if there's an active session already
            try {
                user = await account.get();
                console.log('User is already logged in:', user.$id);
            } catch (err) {
                console.log('No active session, proceeding to login...');
            }

            // If there's no active session, attempt to log in
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

            // Optionally, handle "Remember Me" functionality by setting cookies or session storage
            if (rememberMe) {
                // Implement "Remember Me" functionality if needed
            }

            // Fetch the user role
            const role = await fetchUserRole(user.$id);

            if (!role) {
                setError('No role assigned to the user. Contact support.');
                return;
            }

            // Generate a JWT after successful login
            const jwt = await account.createJWT();
            console.log('Generated JWT:', jwt);

            // Store the JWT in localStorage or cookie for future use (you can choose)
            localStorage.setItem('appwrite_jwt', jwt.jwt); // Storing in localStorage (ensure you use secure methods)

            // Handle role-based redirection
            handleUserRoleRedirect(role);

        } catch (err: any) {
            console.error('Error during login:', err);
            setError(`Login failed: ${err.message || 'An unexpected error occurred.'}`);
        } finally {
            setLoading(false); // Stop loading after operations are complete
        }
    };

    return { login, error, loading };
};
