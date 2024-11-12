"use client"; // Client Component
import Layout from "@/components/Sidebar/Layout"; // Assuming Layout is the component that wraps sidebar and content
import items from "@/client/data/Links";
import React, { useState, useEffect } from 'react';
import { account, databases } from '@/appwrite'; // Importing Appwrite services
import { Query } from 'appwrite'; // Import the Query class for filtering
import { fetchProfileImageUrl } from "@/hooks/userService";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";

const ProfilePage: React.FC = () => {
  
  const { loading: authLoading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [name, setName] = useState<string>(''); // Placeholder for the user's name
  const [userData, setUserData] = useState<any>(null); // State to store user profile data
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [email, setEmail] = useState<string>(''); // State to store user's email from Appwrite auth


  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch authenticated user data from Appwrite account
        const user = await account.get();
        setName(user.name); // Set the user's name from Appwrite auth
        setEmail(user.email); // Set the user's email from Appwrite auth

        // Fetch user profile data from the database using userId field
        const response = await databases.listDocuments(
          "Butterfly-Database", // Database ID
          "Client",             // Collection ID
          [Query.equal('userid', user.$id)] // Filter to find the document where userId matches user.$id
        );

        if (response.documents.length > 0) {
          // If document is found, set it in the state
          setUserData(response.documents[0]);
        } else {
          console.error("No profile document found for this user.");
        }

        // Fetch profile images for each psychotherapist
        const profileImages = {};
        for (const client of userData) {
          if (client.profilepic) {
            const url = await fetchProfileImageUrl(client.profilepic);
            if (url) {
              profileImages[user.$id] = url;
            }
          }
        }

        setProfileImageUrls(profileImages);
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
              <img
                src={profileImageUrls[userData?.$id] || "/images/default-profile.png"} // Updated profile picture path
                alt="Profile"
                className="rounded-full w-40 h-40 object-cover bg-gray-200 shadow-lg border-4 border-white"
              />
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">{name || 'Loading...'}</h2>
            </div>

            {/* Information Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-700 mb-6">Personal Information</h3>
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
