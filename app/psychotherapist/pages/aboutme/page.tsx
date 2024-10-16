'use client';

import { useState } from 'react';
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";

const AboutMe = () => {
  // State variables to store user inputs
  const [description, setDescription] = useState("As a psychologist, my mission is to nurture mental well-being, offering compassionate support and guiding individuals towards resilience and personal growth.");
  const [professionalBackground, setProfessionalBackground] = useState("Bachelor of Arts in Psychology");
  const [specialties, setSpecialties] = useState(["Health and Lifestyle", "Mindfulness"]);

  const [isEditing, setIsEditing] = useState(false);

  // Function to handle form submission (this could be integrated with a backend API)
  const handleSave = () => {
    // Here you can add logic to save the data to the backend
    setIsEditing(false);
    alert('Profile information saved successfully!');
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-gray-100 min-h-screen overflow-y-auto">
        {/* Header Section */}
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10">
          <h2 className="text-2xl font-bold">About Me</h2>
        </div>

        {/* Profile Settings Section */}
        <div className="p-6">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
            {/* Left Side: Profile Picture and Description */}
            <div className="w-full md:w-1/2">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-blue-500 mb-4"></div>
                <button className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded">Choose profile</button>
              </div>

              {/* Description */}
              <div className="flex flex-col mb-6">
                <label htmlFor="description" className="text-lg font-medium mb-2">Description</label>
                <textarea
                  id="description"
                  rows="5"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Right Side: About Me Info */}
            <div className="w-full md:w-1/2">
              {/* About me name */}
              <div className="mb-6">
                <h3 className="text-xl font-bold">About me</h3>
                <p className="text-gray-700">[Name]</p>
                <span className="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full inline-block mt-2">Senior Psychotherapist</span>
              </div>

              {/* Professional Background */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold">Professional Background</h4>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={professionalBackground}
                  onChange={(e) => setProfessionalBackground(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-lg font-semibold">Specialties</h4>
                <textarea
                  rows="2"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={specialties.join('\n')}
                  onChange={(e) => setSpecialties(e.target.value.split('\n'))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Edit/Save Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {isEditing ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutMe;
