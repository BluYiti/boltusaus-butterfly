'use client';

import { useEffect, useState } from 'react';
import { account, databases } from '@/appwrite'; // Import Appwrite account and database instances
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen'; // Import the LoadingScreen component
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import SessionExpirationModal from '@/auth/components/SessionExpirationModal'; // Import the modal

const VALID_ROLES = ['admin', 'client', 'psychotherapist', 'associate']; // Define allowed roles

const useAuthCheck = (allowedRoles: any) => {
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const router = useRouter(); // Router to handle redirects

  // Validate the allowedRoles prop
  useEffect(() => {
    const invalidRoles = allowedRoles.filter((role: string) => !VALID_ROLES.includes(role));
    if (invalidRoles.length > 0) {
      console.warn(`Invalid roles detected: ${invalidRoles.join(', ')}. Only the following roles are allowed: ${VALID_ROLES.join(', ')}.`);
      return;
    }
  }, [allowedRoles]);

  // Function to check if the JWT is valid
  const isJwtValid = (jwt: string | null) => {
    if (!jwt) return false; // No JWT found

    try {
      // Decode the JWT to check its expiration
      const decoded: any = jwtDecode(jwt);
      const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

      // Check if the JWT is expired
      if (decoded.exp < currentTime) {
        return false; // JWT expired
      }

      return true; // JWT is valid
    } catch (error) {
      console.error('Invalid JWT:', error);
      return false; // Invalid JWT
    }
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    await account.deleteSession('current'); // Clear the session
    setLoading(false); // Stop loading
    router.push('/login'); // Redirect to login
    setIsModalOpen(false); // Close the modal
  };

  const handleStay = () => {
    console.log('Staying logged in...');
    setIsModalOpen(false); // Close the modal
    checkAuth(); // Retry authentication check
  };

  const checkAuth = async () => {
    const jwt = localStorage.getItem('appwrite_jwt'); // Get JWT from localStorage

    // If JWT is invalid, log the user out and redirect to the login page
    if (!isJwtValid(jwt)) {
      console.log('JWT is invalid or expired. Showing session expiration modal...');
      setIsModalOpen(true); // Show the modal if JWT is invalid
      setLoading(false); // Stop loading (don't auto redirect)
      return;
    }

    try {
      // If JWT is valid, proceed with checking the user's role
      const user = await account.get();
      const userId = user.$id;

      const roleResponse = await databases.getDocument('Butterfly-Database', 'Accounts', userId);

      const userRole = roleResponse.role;

      if (allowedRoles.includes(userRole)) {
        setLoading(false); // User is authorized, stop loading
      } else {
        // User's role is not allowed, log out and redirect
        await account.deleteSession('current'); // Clear the session
        setLoading(false); // Stop loading
        router.push('/login'); // Redirect to login
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      try {
        await account.deleteSession('current'); // Clear the session if there was an error
      } catch (sessionError) {
        console.error('Error destroying session:', sessionError);
      }
      setLoading(false); // Stop loading
      router.push('/login'); // Redirect to login
    }
  };

  useEffect(() => {
    // Proceed with authentication check if allowedRoles are valid
    if (allowedRoles.every((role: string) => VALID_ROLES.includes(role))) {
      checkAuth(); // Run authentication only if allowedRoles are valid
    } else {
      setLoading(false); // Skip authentication if there are invalid roles
    }
  }, [allowedRoles, router]);

  return (
    <>
      {loading && <LoadingScreen />}
      <SessionExpirationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal if the user clicks outside or the close button
        onLogout={handleLogout}
        onStay={handleStay}
      />
    </>
  );
};

export default useAuthCheck;
