import { useEffect, useState } from 'react';
import { account, databases } from '@/appwrite'; // Appwrite instances
import { useRouter } from 'next/navigation';
import SessionExpirationModal from '@/auth/components/SessionExpirationModal'; // Modal component
import { jwtDecode } from 'jwt-decode'; // jwt-decode import

const VALID_ROLES = ['admin', 'client', 'psychotherapist', 'associate']; // Allowed roles

const useAuthCheck = (allowedRoles: string[]) => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const router = useRouter();

  // Validate the allowedRoles prop
  useEffect(() => {
    const invalidRoles = allowedRoles.filter((role) => !VALID_ROLES.includes(role));
    if (invalidRoles.length > 0) {
      console.warn(`Invalid roles detected: ${invalidRoles.join(', ')}. Only the following roles are allowed: ${VALID_ROLES.join(', ')}.`);
      return;
    }
  }, [allowedRoles]);

  // Function to check if JWT is valid
  const isJwtValid = (jwt: string | null) => {
    if (!jwt) return false; // No JWT found

    try {
      const decoded: any = jwtDecode(jwt);
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
      return decoded.exp >= currentTime; // JWT is valid if expiration time is greater than current time
    } catch (error) {
      console.error('Invalid JWT:', error);
      return false;
    }
  };

  // Function to check authentication
  const checkAuth = async () => {
    const jwt = localStorage.getItem('appwrite_jwt');
    if (!isJwtValid(jwt)) {
      setIsModalOpen(true); // Show modal if JWT is invalid or expired
      setLoading(false);
      return;
    }

    try {
      const user = await account.get(); // Get user info
      const userId = user.$id;
      const roleResponse = await databases.getDocument('Butterfly-Database', 'Accounts', userId);
      const userRole = roleResponse.role;

      if (allowedRoles.includes(userRole)) {
        setLoading(false); // Set loading to false when role matches
      } else {
        await account.deleteSession('current'); // If role doesn't match, log out
        setLoading(false);
        router.push('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      await account.deleteSession('current');
      setLoading(false);
      router.push('/login');
    }
  };

  // Effect hook to check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [allowedRoles, router]);

  // Modal handlers
  const handleLogout = async () => {
    await account.deleteSession('current'); // Logout the user
    setIsModalOpen(false); // Close the modal
    router.push('/login'); // Redirect to login page
  };

  const handleStay = () => {
    setIsModalOpen(false); // Close modal if user wants to stay logged in
  };

  // Return the modal and loading state
  return {
    loading,
    modal: (
      <SessionExpirationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogout={handleLogout}
        onStay={handleStay}
      />
    ),
  };
};

export default useAuthCheck;
