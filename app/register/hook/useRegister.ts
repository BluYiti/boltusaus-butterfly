'use client'

import { account, ID } from '@/appwrite';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useRegister = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const register = async (username: string, email: string, password: string, phone: string) => {
        setError(null);
        setLoading(true);

        let userId: string | null = null;

        try {
            // Check if there's an active session
            let activeSession = null;
            try {
                activeSession = await account.getSession('current');
                console.log('Active session found:', activeSession);
            } catch (err: any) {
                console.log('No active session found, proceeding with registration.');
            }

            // If there's an active session, delete it before creating a new one
            if (activeSession) {
                await account.deleteSession('current');
                console.log('Deleted the existing active session.');
            }

            // Create a new user
            userId = ID.unique();
            const user = await account.create(userId, email, password, username);
            console.log('User created:', user);
            
            // Now create a session immediately after successful account creation
            await account.createEmailPasswordSession(email, password);
            console.log('Session created for the user.');

            // Update user's phone number using account.updatePhone(), requires password
            await account.updatePhone(phone, password);
            console.log('Phone number updated successfully.');

            // Optionally, store the role and status in the user preferences
            await account.updatePrefs({
                role: 'client',
                status: 'To Be Evaluated',
            });

            // Redirect to the pre-assessment page
            router.push('/preassessment');
        } catch (err: any) {
            console.error('Error during registration:', err);
            setError(`Registration failed: ${err.message}`);

            // Rollback: If an error occurs after the account is created, delete the user to prevent incomplete registrations
            if (userId) {
                try {
                    // Call the API to delete the user
                    const response = await fetch('/api/deleteUser', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId }),
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to delete user');
                    }
            
                    console.log('User successfully deleted');
                } catch (deleteError: any) {
                    console.error('Failed to delete user during rollback:', deleteError);
                }
            }
            
        } finally {
            setLoading(false);
        }
    };

    return { register, error, loading };
};
