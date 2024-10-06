"use client"; // Client Component

import React, { useState, useEffect } from 'react';

const ProfilePage: React.FC = () => {
  const [name, setName] = useState<string>(''); // Name from the database
  const [newName, setNewName] = useState<string>(''); // Temporary state for editing
  const [profilePic, setProfilePic] = useState<string>(''); // Profile picture URL
  const [isEditingName, setIsEditingName] = useState<boolean>(false); // Toggle name edit mode
  const [isEditingPic, setIsEditingPic] = useState<boolean>(false); // Toggle profile pic edit mode
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // For file upload

  // Fetch user data from the API (name, profile picture)
  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch('/api/user'); // Replace with your API endpoint
      const data = await response.json();
      setName(data.name);
      setNewName(data.name); // Set newName initially as the current name
      setProfilePic(data.profilePic); // Set profilePic from database
    }

    fetchUserData();
  }, []);

  // Handle name edit and save
  const handleSaveName = async () => {
    // Update the name in the database (API request)
    await fetch('/api/user/update', {
      method: 'POST', // Or PUT
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName }),
    });

    setName(newName); // Update UI after saving
    setIsEditingName(false);
  };

  // Handle profile picture upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle profile picture upload to server
  const handleUploadPic = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('profilePic', selectedFile);

      const response = await fetch('/api/user/uploadProfilePic', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setProfilePic(data.profilePic); // Update UI with new profile picture URL
      setIsEditingPic(false); // Close the edit modal after uploading
    }
  };

  return (
    <div className="text-black min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <button className="text-white text-lg">&larr;</button>
        <h1 className="text-xl font-bold">Profile</h1>
        <button className="text-white text-lg">&#9776;</button> {/* Menu */}
      </header>

      {/* Profile Content */}
      <div className="p-4 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profilePic || 'https://via.placeholder.com/100'} // Default if no profile picture
            alt="Profile"
            className="rounded-full w-24 h-24"
          />
          <button
            className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1"
            onClick={() => setIsEditingPic(true)} // Open profile pic edit container
          >
            📷 {/* Camera Icon */}
          </button>

          {/* Edit Profile Pic Prompt */}
          {isEditingPic && (
            <div className="absolute top-0 left-0 bg-white shadow-lg p-4 rounded-lg flex flex-col items-center">
              <input type="file" onChange={handleFileChange} />
              <div className="flex justify-between mt-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={handleUploadPic}
                >
                  Save
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2"
                  onClick={() => setIsEditingPic(false)}
                >
                  X {/* Close Button */}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Name Display */}
        <div className="relative mt-4">
          {!isEditingName ? (
            <>
              <h2 className="text-lg font-bold text-center text-blue-800">
                {name || 'Loading...'}
              </h2>
              <button
                className="absolute -right-6 top-1 bg-gray-200 rounded-full p-1"
                onClick={() => setIsEditingName(true)} // Open name edit container
              >
                ✏️ {/* Pencil Icon */}
              </button>
            </>
          ) : (
            // Name Edit Prompt
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg mb-2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  onClick={handleSaveName}
                >
                  Save
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg ml-2"
                  onClick={() => setIsEditingName(false)}
                >
                  X {/* Close Button */}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flex container to hold Personal Information and Tracked Items side by side */}
      <div className="px-6 py-4 flex flex-row justify-between items-start space-x-4 mx-4">
        {/* Personal Information */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">Personal Information</h2>
          <p><strong>Full Name:</strong> {name}</p>
          <p><strong>Date of Birth:</strong></p>
          <p><strong>Gender:</strong></p>
          <p><strong>Age:</strong></p>
          <p><strong>Contact Number:</strong></p>
        </div>

        {/* Tracked Items */}
        <div className="flex-1 flex flex-col space-y-3">
          {/* Goal Tracked */}
          <div className="flex items-center bg-blue-100 rounded-lg p-3">
            <span className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg mr-4">
              0
            </span>
            <span className="text-blue-700 font-semibold">Goal Tracked</span>
          </div>

          {/* Mood Tracked */}
          <div className="flex items-center bg-blue-100 rounded-lg p-3">
            <span className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg mr-4">
              0
            </span>
            <span className="text-blue-700 font-semibold">Mood Tracked</span>
          </div>

          {/* Resource Read */}
          <div className="flex items-center bg-blue-100 rounded-lg p-3">
            <span className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg mr-4">
              0
            </span>
            <span className="text-blue-700 font-semibold">Resource Read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
