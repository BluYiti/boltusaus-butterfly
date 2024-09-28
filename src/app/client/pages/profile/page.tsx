import React from 'react';

const ProfilePage: React.FC = () => {
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
        {/* Profile Picture and Name */}
        <div className="relative">
          <img
            src="https://via.placeholder.com/100"  // Replace with actual profile image URL
            alt="Profile"
            className="rounded-full w-24 h-24"
          />
          <button className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1">
            ✏️ {/* Edit Icon */}
          </button>
        </div>
        <h2 className="mt-4 text-lg font-bold text-center text-blue-800"></h2>
      </div>

      {/* Personal Information */}
      <div className="px-6 py-4 bg-white rounded-lg shadow-md mt-4 mx-4">
        <h2 className="text-lg font-bold mb-2">Personal Information</h2>
        <p><strong>Full Name:</strong></p>
        <p><strong>Date of Birth:</strong></p>
        <p><strong>Gender:</strong></p>
        <p><strong>Age:</strong></p>
        <p><strong>Contact Number:</strong></p>
      </div>

      {/* Tracked Items */}
      <div className="flex flex-col items-start mt-4 mx-4 space-y-3">
        {/* Goal Tracked */}
        <div className="flex items-center bg-blue-100 rounded-lg p-3 w-full">
          <span className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg mr-4">
            0
          </span>
          <span className="text-blue-700 font-semibold">Goal Tracked</span>
        </div>

        {/* Mood Tracked */}
        <div className="flex items-center bg-blue-100 rounded-lg p-3 w-full">
          <span className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg mr-4">
            0
          </span>
          <span className="text-blue-700 font-semibold">Mood Tracked</span>
        </div>

        {/* Resource Read */}
        <div className="flex items-center bg-blue-100 rounded-lg p-3 w-full">
          <span className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-lg mr-4">
            0
          </span>
          <span className="text-blue-700 font-semibold">Resource Read</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
