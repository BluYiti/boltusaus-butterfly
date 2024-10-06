"use client"; 

import React, { useState } from 'react';

const ProfilePage = () => {
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  
  // Handle file selection for profile image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Check if files exist
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation Bar */}
      <aside className="bg-white w-60 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Butterfly</h1>
        <nav className="space-y-4">
          <button className="block text-gray-600 hover:text-blue-600">Home</button>
          <button className="block text-blue-600 hover:text-gray-600">Profile</button>
          <button className="block text-gray-600 hover:text-blue-600">Appointments</button>
          <button className="block text-gray-600 hover:text-blue-600">Client List</button>
          <button className="block text-gray-600 hover:text-blue-600">Payments</button>
          <button className="block text-gray-600 hover:text-blue-600">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h2 className="text-3xl font-bold mb-6">Profile Settings</h2>
        
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
          
          {/* Profile Image Section */}
          <div className="flex items-center mb-6">
            <div className="mr-6">
              {profileImage ? (
                <img
                  src={profileImage as string}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Change Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
          
          {/* Description Section */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="w-full border border-gray-300 p-2 rounded"
              rows={4}
              placeholder="Tell something about yourself..."
            ></textarea>
          </div>
          
          {/* Save Button */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;