'use client';

import { useEffect, useState } from 'react';
import { account, databases } from '@/appwrite';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';
import { jwtDecode } from 'jwt-decode';
import SessionExpirationModal from '@/auth/components/SessionExpirationModal';

const VALID_ROLES = ['admin', 'client', 'psychotherapist', 'associate'];

const useAuthCheck = (allowedRoles: any) => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Function to check if the JWT is valid
  const isJwtValid = (jwt: string | null) => {
    if (!jwt) return false;
    try {
      const decoded: any = jwtDecode(jwt);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp >= currentTime;
    } catch {
      return false;
    }
  };

  // Function to handle the authentication check
  const checkAuth = async () => {
    const jwt = localStorage.getItem('appwrite_jwt');
    if (!isJwtValid(jwt)) {
      setShowModal(true);  // Show modal if JWT is invalid
      setLoading(false);    // Stop loading
      return;
    }

    try {
      const user = await account.get();
      const userId = user.$id;
      const roleResponse = await databases.getDocument('Butterfly-Database', 'Accounts', userId);
      const userRole = roleResponse.role;

      if (allowedRoles.includes(userRole)) {
        setLoading(false);  // User is authorized, stop loading
      } else {
        await account.deleteSession('current');
        setLoading(false);
        router.push('/login');
      }
    } catch (error) {
      await account.deleteSession('current');
      setLoading(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    // Only check auth if allowedRoles are valid
    if (allowedRoles.every((role: string) => VALID_ROLES.includes(role))) {
      checkAuth();  // Run the checkAuth function
    } else {
      setLoading(false);  // Skip authentication if invalid roles
    }
  }, [allowedRoles, router]);

  // Handle logging out (clearing session and redirecting to login)
  const handleLogout = async () => {
    await account.deleteSession('current');
    router.push('/login');
  };

  // Handle staying logged in (re-validating the session)
  const handleStayLoggedIn = async () => {
    const jwt = localStorage.getItem('appwrite_jwt');
    if (jwt && isJwtValid(jwt)) {
      setShowModal(false);  // Hide modal if user chooses to stay logged in
      setLoading(true);      // Start loading while we recheck the session
      await checkAuth();     // Re-check authentication
    }
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <SessionExpirationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleLogout}
        onStay={handleStayLoggedIn}
      />
    </>
  );
};

export default useAuthCheck;
