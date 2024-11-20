"use client"; // Client Component
import Layout from "@/components/Sidebar/Layout"; // Assuming Layout is the component that wraps sidebar and content
import items from "@/client/data/Links";
import React, { useState, useEffect } from 'react';
import { account, databases } from '@/appwrite'; // Importing Appwrite services
import { Query } from 'appwrite'; // Import the Query class for filtering
import { fetchProfileImageUrl } from "@/hooks/userService";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import Image from 'next/image';

interface UserProfile {
  id: string;
  address: string;
  birthdate: string;
  phonenum: string;
  sex: string;
  age: number;
  emergencyContactName: string;
  emergencyContact: string;
  profilepic: string; // Assuming the profile image is represented as a string
}

const ProfilePage: React.FC = () => {
  
  const authLoading = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [name, setName] = useState<string>(''); // Placeholder for the user's name
  const [userData, setUserData] = useState<UserProfile>(null); // State to store user profile data
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [clientId, setClientId] = useState<string>(''); // State to store user's email from Appwrite auth
  const [email, setEmail] = useState<string>(''); // State to store user's email from Appwrite auth

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch authenticated user data from Appwrite account
        const user = await account.get();
        setName(user.name); 
        setEmail(user.email); 
  
        // Fetch user profile data from the database
        const response = await databases.listDocuments("Butterfly-Database", "Client", [
          Query.equal('userid', user.$id),
        ]);
  
        if (response.documents.length > 0) {
          const document = response.documents[0];
  
          // Map document to UserProfile
          const userProfile: UserProfile = {
            id: document.$id,
            address: document.address,
            birthdate: document.birthdate,
            phonenum: document.phonenum,
            sex: document.sex,
            age: document.age,
            emergencyContactName: document.emergencyContactName,
            emergencyContact: document.emergencyContact,
            profilepic: document.profilepic,
          };
  
          setUserData(userProfile);
          setClientId(document.$id); // Ensure clientId matches the document.$id
  
          // Fetch profile image URL
          const url = await fetchProfileImageUrl(document.profilepic);
          setProfileImageUrls((prev) => ({
            ...prev,
            [document.$id]: url, // Use document.$id as the key
          }));
        } else {
          console.error("No profile document found for this user.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  
    fetchUserData();
  }, []);
  
  
  if (authLoading ) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gradient-to-r from-blue-500 to-blue-700">
        {/* Main Content */}
        <div className="flex-grow flex flex-col bg-white px-12 py-10 shadow-lg overflow-y-auto">
          
          {/* Top Section with Welcome Message */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-5 px-8 flex justify-between items-center rounded-lg shadow-md mb-10">
            <h1 className="text-2xl font-semibold">Account Profile</h1>
          </div>

          {/* Profile Section */}
          <div className="bg-white shadow-xl p-10 rounded-lg">
            {/* Profile Picture and Name */}
            <div className="relative flex flex-col items-center text-center mb-10">
              <Image
                src={profileImageUrls[clientId] || "/images/default-profile.png"} // Updated profile picture path
                alt="Profile"
                className="rounded-full w-40 h-40 object-cover bg-gray-200 shadow-lg border-4 border-white"
                width={160}  // Specify width in pixels
                height={160} // Specify height in pixels
                unoptimized
              />
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">{name || 'Loading...'}</h2>
            </div>

            {/* Information Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-blue-400 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1 */}
                <div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Home Address:</h4>
                    <p className="text-gray-600">{userData?.address || 'Loading...'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Date of Birth:</h4>
                    <p className="text-gray-600">{userData?.birthdate || 'Loading...'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Contact Number:</h4>
                    <p className="text-gray-600">{userData?.phonenum || 'Loading...'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Sex:</h4>
                    <p className="text-gray-600">{userData?.sex || 'Loading...'}</p>
                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Age:</h4>
                    <p className="text-gray-600">{userData?.age || 'Loading...'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Email Address:</h4>
                    <p className="text-gray-600">{email || 'Loading...'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Emergency Contact Person:</h4>
                    <p className="text-gray-600">{userData?.emergencyContactName || 'Loading...'}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-700">Emergency Contact Number:</h4>
                    <p className="text-gray-600">{userData?.emergencyContact || 'Loading...'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
