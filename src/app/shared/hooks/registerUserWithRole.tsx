'use client'

import { ID, Databases, Account, AppwriteException } from 'appwrite';
import { client } from '../../appwrite'; // Your appwrite.ts configuration file

// Initialize Appwrite services
const databases = new Databases(client);
const account = new Account(client);

export { databases, account };

export const registerUserWithRole = async (email: string, password: string, role: string) => {
    try {
      // Step 1: Create a new user in Appwrite (with email and password)
      const user = await account.create(ID.unique(), email, password);
  
      // Step 2: Store non-sensitive user information (like role) in the Appwrite database
      const databaseId = '66e8072f003d15a5c7c8';
      const collectionId = '66e8073d0036add04813';
  
      // Create the document with non-sensitive information (omit the password)
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        role: role,
        email: email,
        userId: user.$id,  // Store the user ID (optional)
      });

      console.log("User registered successfully:", user.$id);
      return user;
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.code === 409) { // 409 Conflict is thrown for duplicate users
          return { error: "User with this email already exists." };
        }
      }
      console.error("Error registering user:", error);
      return { error: "An error occurred during registration. Please try again." };
    }
  };