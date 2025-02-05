import { databases } from '@/appwrite';
let errorLogged = false; // Prevent repeated error logs

export const checkClientLink = async (clientId: string): Promise<boolean> => {
    try {
        console.log(`Checking client link for client ID: ${clientId}...`);

        const response = await databases.getDocument('Butterfly-Database', 'MeetLink', clientId);

        if (!response || typeof response.link !== 'string' || !response.link.trim()) {
            if (!errorLogged) {
                console.warn(`No Google Meet link assigned for client ID: ${clientId}.`);
                errorLogged = true; // Prevent future logs for this session
            }
            return false;
        }

        console.log(`Client ID ${clientId} has a Google Meet link.`);
        return true;
    } catch (error) {
        if (!errorLogged) {
            console.error(`Error checking client link for client ID ${clientId}:`, error);
            errorLogged = true; // Log error only once per session
        }
        return false;
    }
};
