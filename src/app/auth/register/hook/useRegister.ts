import { account, ID } from '@/app/appwrite';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useRegister = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const register = async (username: string, email: string, password: string) => {
        setError(null);
        setLoading(true);

        try {
            // Check if there's an active session
            let activeSession = null;
            try {
                activeSession = await account.getSession('current'); // Get the current session if exists
                console.log('Active session found:', activeSession);
            } catch (err: any) {
                console.log('No active session found, proceeding with registration.');
            }

            // If there's an active session, you can choose to delete it before creating a new one
            if (activeSession) {
                await account.deleteSession('current'); // Deletes the current session
                console.log('Deleted the existing active session.');
            }

            // Create a new user
            const userId = ID.unique();
            await account.create(userId, email, password, username);

            // Create a new session after registration
            await account.createEmailPasswordSession(email, password);

            // Update user preferences with role and status
            await account.updatePrefs({
                role: 'client',
                status: 'To Be Evaluated',
            });

            // Redirect to the pre-assessment page
            router.push('/preassessment');
        } catch (err: any) {
            console.error('Error during registration:', err);
            setError(`Registration failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { register, error, loading };
};
