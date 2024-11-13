'use client';

import { useState } from 'react';
import { databases } from '@/appwrite';
import { Goal } from '@/types'; // Assuming you have a Goal type defined
import { useRouter } from 'next/navigation';


export const useProgressUpdate = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [goals, setGoals] = useState<Goal[]>([]); // Add this if you want local state for goals
    const router = useRouter();

    // Function to fetch goals, if needed
    const fetchGoals = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments('Butterfly-Database', 'Goals');
            setGoals(response.documents);
        } catch (err) {
            console.error('Failed to fetch goals:', err);
            setError('Unable to load goals. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to update the progress of a goal
    const updateProgress = async (goalId: string, newProgress: Goal['progress']) => {
        setError(null);
        setLoading(true);

        // Validate the `newProgress` value against allowed enum values
        const validProgressValues = ['todo', 'doing', 'done', 'missed'];
        if (!validProgressValues.includes(newProgress)) {
            setError('Invalid progress value. Please select a valid option.');
            setLoading(false);
            return;
        }

        try {
            // Update the progress in the Appwrite database
            console.log(`Updating goal with ID: ${goalId} to progress: ${newProgress}`);
            await databases.updateDocument('Butterfly-Database', 'Goals', goalId, {
                progress: newProgress,
            });

            // Update the local state if needed
            const updatedGoals = goals.map((goal) =>
                goal.$id === goalId ? { ...goal, progress: newProgress } : goal
            );
            setGoals(updatedGoals);

            console.log('Goal progress updated successfully.');
        } catch (err: any) {
            console.error('Error updating goal progress:', err);
            setError(`Failed to update progress: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Function to redirect after successful update, if needed
    const handleRedirectAfterUpdate = (role: string) => {
        switch (role) {
            case 'psychotherapist':
                router.push('/psychotherapist/goals');
                break;
            case 'client':
                router.push('/client/goals');
                break;
            default:
                console.log('No specific role-based redirection configured.');
        }
    };

    return { updateProgress, fetchGoals, goals, error, loading };
};
