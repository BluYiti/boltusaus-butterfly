'use client';

import { useState, useEffect } from 'react';
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { Client, Databases } from 'appwrite'; // Import Appwrite SDK

const AboutMe = () => {
  // State variables to store user inputs
  const [description, setDescription] = useState("");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Initialize Appwrite client and database
  const client = new Client();
  const databases = new Databases(client);

  // Function to fetch data from Appwrite database
  const fetchData = async () => {
    try {
      const response = await databases.getDocument(
        'Butterfly-Database', // Your database ID
        'Psychotherapist', // Your collection ID
        '[DOCUMENT_ID]' // The document ID to fetch (you need to replace this with the actual document ID or fetch it based on user authentication)
      );

      // Update state with fetched data
      setDescription(response.description || '');
      setContactNumber(response.phonenum || '');
      setFirstName(response.firstName || '');
      setLastName(response.lastName || '');
      setProfessionalBackground(response.background || '');
      setSpecialties(response.specialties || []);
      setPosition(response.position || '');
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle form submission (this could be integrated with a backend API)
  const handleSave = () => {
    // Here you can add logic to save the data to the backend
    setIsEditing(false);
    alert('Profile information saved successfully!');
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setIsModalOpen(false); // Close modal after file selection
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen overflow-y-auto">
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
                <button
                  className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded"
                  onClick={() => setIsModalOpen(true)} // Open modal on click
                >
                  Choose profile
                </button>
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
                <p className="text-gray-700">{firstName} {lastName}</p>
                <span className="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full inline-block mt-2">{position}</span>
              </div>

              {/* Contact Number */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold">Contact Number</h4> 
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={!isEditing}
                />
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

      {/* Modal for File Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Choose a profile picture</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => document.querySelector('input[type="file"]').click()}
              >
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AboutMe;
