"use client"; // Client Component
import Layout from "@/components/Sidebar/Layout"; // Assuming Layout is the component that wraps sidebar and content
import items from "@/client/data/Links"; 
import React, { useState, useEffect } from 'react';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>('Ana Smith'); // Placeholder Name from the database
  const [profilePic, setProfilePic] = useState<string>('/images/hanni2.jpg'); // Path to the new profile picture

  useEffect(() => {
    async function fetchUserData() {
      // Fetch user data from your API or database
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
              <h2 className="mt-5 text-xl font-bold text-gray-900">{name}</h2>
            </div>

            {/* Information Section */}
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Column */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Home Address:</h2>
                  <p className="text-gray-600">Baguio, City</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Date of Birth:</h2>
                  <p className="text-gray-600">March 17, 2000</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Contact Number:</h2>
                  <p className="text-gray-600">+639884023464</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Sex:</h2>
                  <p className="text-gray-600">Male</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Age:</h2>
                  <p className="text-gray-600">20 yrs old</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Email Address:</h2>
                  <p className="text-gray-600">denzelwhite_9@gmail.com</p>
                </div>
              </div>

              {/* Emergency Contact Column */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Emergency Contact Person:</h2>
                  <p className="text-gray-600">Nenita Blue</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Emergency Contact Number:</h2>
                  <p className="text-gray-600">+639884023464</p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Conditions:</h2>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Anxiety</li>
                    <li>Depression</li>
                    <li>Phobia</li>
                  </ul>
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