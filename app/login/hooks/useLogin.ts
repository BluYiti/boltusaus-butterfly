'use client';

import { useState } from 'react';
import { account, databases } from '@/appwrite'; // Keep both account and databases imports
import { useRouter } from 'next/navigation';

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch user role from the database
    const fetchUserRoleFromDatabase = async (UserId: string) => {
        try {
            const response = await databases.getDocument('Butterfly-Database', 'Accounts', UserId);
            return response.role; // Adjust this based on your data structure
        } catch (err) {
            console.error('Failed to fetch user role from database:', err);
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

    const login = async (email: string, password: string) => {
        setError(null); // Reset error before trying to log in

        try {
            // Check if there is already an active session
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
                    console.error('Login failed:', err);
                    setError('Invalid email or password. Please try again.');
                    return;  // Stop further execution if login fails
                }
            }

            // Step 1: Check for the role from user preferences (prefs.role)
            const prefsRole = user.prefs?.role;

            // If the user's prefs.role is "New Client", redirect them immediately
            if (prefsRole === 'New Client') {
                router.push('/client/pages/newClientDashboard'); // Redirect to NewClientDashboard for new clients
                return; // Stop further execution
            }

            // Step 2: If not "New Client", fetch the role from the database
            const dbRole = await fetchUserRoleFromDatabase(user.$id);

            if (dbRole) {
                // Redirect based on the role from the database
                handleUserRoleRedirect(dbRole);
            } else {
                setError('No role assigned to the user. Contact support.');
            }
        } catch (err: any) {
            console.error('Error during login:', err);
            setError(`Login failed: ${err.message}`);
        }
    };

    return { login, error };
};
