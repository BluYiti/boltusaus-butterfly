'use client';

import React from "react";

// Component for displaying the client information
const ClientProfile: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-md shadow-lg">
      {/* Back button */}
      <div className="flex items-center mb-6">
        <button className="text-2xl mr-4 text-black">
          <span>&larr;</span>
        </button>
        <h2 className="text-xl font-bold">Client Information</h2>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left Column - Profile */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 p-4">
          <img
            src="https://via.placeholder.com/150"
            alt="Denzel White"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-xl font-bold mb-2">Denzel White</h2>

          {/* Tracked Stats */}
          <div className="flex justify-between space-x-4 mb-6">
            <div className="text-center">
              <span className="block text-3xl font-bold">0</span>
              <span className="text-sm text-gray-500">goal tracked</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold">0</span>
              <span className="text-sm text-gray-500">mood tracked</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold">0</span>
              <span className="text-sm text-gray-500">resource read</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
              Send Message
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full">
              Call
            </button>
          </div>
        </div>

        {/* Right Column - Personal Information */}
        <div className="w-full md:w-2/3 p-4">
          <h3 className="text-xl font-bold mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <div>
              <p><strong>Home Address:</strong> Baguio, City</p>
              <p><strong>Date of Birth:</strong> March 17, 2000</p>
              <p><strong>Contact Number:</strong> +639884023464</p>
              <p><strong>Sex:</strong> Male</p>
              <p><strong>Age:</strong> <span className="font-bold">20 yrs old</span></p>
              <p><strong>Email Address:</strong> denzelwhite_9@gmail.com</p>
            </div>
            <div>
              <p><strong>Emergency Contact Person:</strong> Nenita Blue</p>
              <p><strong>Conditions:</strong></p>
              <ul className="list-disc list-inside">
                <li>Anxiety</li>
                <li>Depression</li>
                <li>Phobia</li>
              </ul>
              <p><strong>Complaints:</strong> I can’t focus with my studies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ClientProfile />
    </div>
  );
};

export default App;
