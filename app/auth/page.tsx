// app/auth/useAuthCheck.ts
import { useEffect, useState } from "react";
import { account } from "@/appwrite"; // Import Appwrite account instance
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen"; // Import the LoadingScreen component

const useAuthCheck = () => {
  const [loading, setLoading] = useState(true); // Loading state for authentication check 
  const router = useRouter(); // Router to handle redirects

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get(); // Check if session exists
        setLoading(false); // User is authenticated, allow loading the dashboard
      } catch (error) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [router]);

  return { loading, LoadingScreen }; // Return loading state and LoadingScreen component
};

export default useAuthCheck;
