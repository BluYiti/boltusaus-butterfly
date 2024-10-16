'use client'

// app/auth/useAuthCheck.ts
import { useEffect, useState } from "react";
import { account, databases } from "@/appwrite"; // Import Appwrite account and database instances
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen"; // Import the LoadingScreen component

const useAuthCheck = (allowedRoles: string[]) => {
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const router = useRouter(); // Router to handle redirects

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get(); // Check if session exists
        const userId = user.$id; // Get the user ID

        // Fetch user role from Accounts collection
        const roleResponse = await databases.getDocument(
          "Butterfly-Database", // Replace with your database ID
          "Accounts", // Replace with your collection ID
          userId // Use the user ID to fetch the document
        );

        const userRole = roleResponse.role; // Adjust based on how your role is stored

        // Check if the user role is allowed
        if (allowedRoles.includes(userRole)) {
          setLoading(false); // User is authenticated and has a valid role
        } else {
          await account.deleteSession("current"); // Destroy the session
          router.push("/login"); // Redirect to login if role is not allowed
        }
      } catch (error) {
        console.error(error); // Log the error for debugging
        try {
          await account.deleteSession("current"); // Destroy the session if there was an error
        } catch (sessionError) {
          console.error("Error destroying session:", sessionError);
        }
        router.push("/login"); // Redirect to login if not authenticated or other error
      }
    };

    checkAuth();
  }, [router, allowedRoles]);

  return { loading, LoadingScreen }; // Return loading state and LoadingScreen component
};

export default useAuthCheck;