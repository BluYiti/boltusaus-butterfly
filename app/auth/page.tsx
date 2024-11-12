import { useEffect, useState } from 'react';
import { account, databases } from '@/appwrite'; // Import Appwrite account and database instances
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen'; // Import the LoadingScreen component
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import SessionExpirationModal from '@/auth/components/SessionExpirationModal'; // Import the modal

const VALID_ROLES = ['admin', 'client', 'psychotherapist', 'associate']; // Define allowed roles

const useAuthCheck = (allowedRoles: string[]) => {
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const router = useRouter(); // Router to handle redirects

  // Validate the allowedRoles prop
  useEffect(() => {
    const invalidRoles = allowedRoles.filter((role) => !VALID_ROLES.includes(role));
    if (invalidRoles.length > 0) {
      console.warn(`Invalid roles detected: ${invalidRoles.join(', ')}. Only the following roles are allowed: ${VALID_ROLES.join(', ')}.`);
      return;
    }
  }, [allowedRoles]);

  // Function to check if the JWT is valid
  const isJwtValid = (jwt: string | null) => {
    if (!jwt) return false; // No JWT found

    try {
      const decoded: any = jwtDecode(jwt);
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

      if (decoded.exp < currentTime) return false; // JWT expired
      return true; // JWT is valid
    } catch (error) {
      console.error('Invalid JWT:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    await account.deleteSession('current');
    setLoading(false);
    router.push('/login');
    setIsModalOpen(false);
  };

  const handleStay = () => {
    console.log('Staying logged in...');
    setIsModalOpen(false);
    checkAuth();
  };

  const checkAuth = async () => {
    const jwt = localStorage.getItem('appwrite_jwt');

    if (!isJwtValid(jwt)) {
      console.log('JWT is invalid or expired. Showing session expiration modal...');
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      const user = await account.get();
      const userId = user.$id;
      const roleResponse = await databases.getDocument('Butterfly-Database', 'Accounts', userId);
      const userRole = roleResponse.role;

      if (allowedRoles.includes(userRole)) {
        setLoading(false);
      } else {
        await account.deleteSession('current');
        setLoading(false);
        router.push('/login');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      await account.deleteSession('current');
      setLoading(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    if (allowedRoles.every((role) => VALID_ROLES.includes(role))) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [allowedRoles, router]);

  return { loading };
};

export default useAuthCheck;
