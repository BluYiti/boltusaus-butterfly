'use client';

import { useEffect } from 'react';
import { account } from '@/appwrite';  

const SessionHandler = () => {
  useEffect(() => {
    const handleBeforeUnload = async () => {
      try {
        await account.deleteSession('current');
        console.log('Session deleted');
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
};

export default SessionHandler;
