'use client'

import { useEffect, useState } from "react";
import { account, databases } from "@/appwrite"; // Import Appwrite account and database instances
import { useRouter } from "next/navigation";

const VALID_ROLES = ["admin", "client", "psychotherapist", "associate"]; // Define allowed roles

const useAuthCheck = (allowedRoles) => {
  const [loading, setLoading] = useState(true); // Loading state for authentication check
  const router = useRouter(); // Router to handle redirects

  // Validate the allowedRoles prop
  useEffect(() => {
    const invalidRoles = allowedRoles.filter((role: string) => !VALID_ROLES.includes(role));
    if (invalidRoles.length > 0) {
      console.warn(`Invalid roles detected: ${invalidRoles.join(", ")}. Only the following roles are allowed: ${VALID_ROLES.join(", ")}.`);
      return;
    }
  }, [allowedRoles]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        const userId = user.$id;

        const roleResponse = await databases.getDocument(
          "Butterfly-Database",
          "Accounts",
          userId
        );

        const userRole = roleResponse.role;

        if (allowedRoles.includes(userRole)) {
          setLoading(false);
        } else {
          await account.deleteSession("current");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        try {
          await account.deleteSession("current");
        } catch (sessionError) {
          console.error("Error destroying session:", sessionError);
        }
        setLoading(false);
        router.push("/login");
      }
    };

    if (allowedRoles.every((role: string) => VALID_ROLES.includes(role))) {
      checkAuth(); // Run authentication only if allowedRoles are valid
    } else {
      setLoading(false); // Skip authentication if there are invalid roles
    }
  }, [allowedRoles, router]);

  return loading; // Return loading state and LoadingScreen component
};

export default useAuthCheck;