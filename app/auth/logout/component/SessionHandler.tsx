import { useEffect } from 'react';
import { account } from '@/appwrite';  // Import Appwrite Account SDK

const SessionHandler = () => {
  
  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        // This is where you destroy the session when the browser window is closed
        await account.deleteSession('current');
        console.log('Session deleted');
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    };

    // Add event listener for when the browser window or tab is about to close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
};

export default SessionHandler;
