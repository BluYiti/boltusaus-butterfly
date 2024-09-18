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
            const userId = ID.unique();

            await account.create(userId, email, password, username);

            await account.updatePrefs({
                role: 'client',
            });
            console.log('Label assigned successfully');

            router.push('/login');
        } catch (err: any) {
            console.error('Error during registration:', err);
            setError(`Registration failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { register, error, loading };
};
