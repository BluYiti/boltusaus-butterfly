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
        console.log(`Updating goal ID: ${goalId} with progress: ${newProgress}`); // Log the values
    
        // Ensure `newProgress` is one of the valid enum values
        const validProgressValues = ['todo', 'doing', 'done', 'missed'];
        if (!validProgressValues.includes(newProgress)) {
            console.error('Invalid progress value:', newProgress);
            return;
        }
    
        try {
            await databases.updateDocument('Butterfly-Database', 'Goals', goalId, {
                progress: newProgress,
            });
            console.log('Successfully updated progress to:', newProgress);
        } catch (error) {
            console.error('Error updating progress in Appwrite:', error);
        }
    };

    const handleSaveGoal = async () => {
        // Call your Appwrite function to save the new goal here
        // Example:
        await databases.createDocument('Butterfly-Database', 'Goals', {
            activities: newGoal,
            // Include other required fields here...
        });

        // Clear the input and refetch the goals
        setNewGoal('');
        fetchGoals();
    };

    // Function to handle progress change
    const handleProgressChange = async (newProgress: string, goalId: string) => {
        await updateProgress(goalId, newProgress);
        fetchGoals(); // Refresh goals after updating progress
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