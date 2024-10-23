"use client"; // Client Component
import Layout from "@/components/Sidebar/Layout"; // Assuming Layout is the component that wraps sidebar and content
import items from "@/client/data/Links";
import React, { useState, useEffect } from 'react';
import { account, databases } from '@/appwrite'; // Importing Appwrite services
import { Query } from 'appwrite'; // Import the Query class for filtering

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>(''); // Placeholder for the user's name
  const [profilePic, setProfilePic] = useState<string>('/images/hanni2.jpg'); // Path to the profile picture
  const [userData, setUserData] = useState<any>(null); // State to store user profile data
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gray-50">
        {/* Main Content */}
        <div className="flex-grow flex flex-col bg-blue-100 px-10 py-8 overflow-y-auto">
          
          {/* Top Section with Welcome Message */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6">
            <h1 className="text-xl font-bold text-blue-500">Account Profile</h1>
          </div>

          {/* Profile Section */}
          <div className="shadow-md p-6 rounded-lg flex flex-col items-center space-y-6">
            {/* Profile Picture and Name */}
            <div className="relative flex flex-col items-center text-center">
              <img
                src={profilePic} // Updated profile picture path
                alt="Profile"
                className="rounded-full w-36 h-36 object-cover bg-slate-400 shadow-lg border-4 border-gray-200"
              />
              <h2 className="mt-5 text-xl font-bold text-gray-900">{name || 'Loading...'}</h2>
            </div>

            {/* Information Section */}
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Column */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Home Address:</h2>
                  <p className="text-gray-600">{userData?.address || 'Loading...'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Date of Birth:</h2>
                  <p className="text-gray-600">{userData?.birthdate || 'Loading...'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Contact Number:</h2>
                  <p className="text-gray-600">{userData?.phonenum || 'Loading...'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Sex:</h2>
                  <p className="text-gray-600">{userData?.sex || 'Loading...'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Age:</h2>
                  <p className="text-gray-600">{userData?.age || 'Loading...'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Email Address:</h2>
                  <p className="text-gray-600">{email || 'Loading...'}</p>
                </div>
              </div>

              {/* Emergency Contact Column */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Emergency Contact Person:</h2>
                  <p className="text-gray-600">{userData?.emergencyContactName || 'Loading...'}</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Emergency Contact Number:</h2>
                  <p className="text-gray-600">{userData?.emergencyContact || 'Loading...'}</p>
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
