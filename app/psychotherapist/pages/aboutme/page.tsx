'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { PencilIcon, SaveIcon } from '@heroicons/react/solid'; // Import the pencil and save icons from Heroicons
import { account, databases } from '@/appwrite';
import { fetchPsychoId } from '@/hooks/userService';
import LoadingScreen from '@/components/LoadingScreen';

const AboutMe = () => {
  // State variables to store user inputs
  const [description, setDescription] = useState("");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  

  // State for editing flags with proper types for each field
  const [isEditing, setIsEditing] = useState<{
    description: boolean;
    contactNumber: boolean;
    professionalBackground: boolean;
    specialties: boolean;
  }>({
    description: false,
    contactNumber: false,
    professionalBackground: false,
    specialties: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Function to fetch data from Appwrite database
  const fetchData = async () => {
    const user = await account.get(); // Get user information
    const psychoId = await fetchPsychoId(user.$id);

    try {
      const response = await databases.getDocument(
        'Butterfly-Database', // Your database ID
        'Psychotherapist', // Your collection ID
        psychoId // The document ID to fetch
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
    } finally {
      setIsLoading(false); // Set loading to false once data is fetched
    }
  };

// Handle phone number change with validation
const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value = event.target.value;

  // Only modify if it doesn't already start with +63
  if (value.startsWith('+63')) {
    // If the number already starts with +63, only allow numbers after it
    value = '+63' + value.slice(3).replace(/[^0-9]/g, ''); // Strip out non-numeric characters after +63
  } else {
    // If the number doesn't start with +63, prepend +63 and clean up non-numeric characters
    value = '+63' + value.replace(/[^0-9]/g, '');
  }

  // Limit the length to 12 characters (i.e., +63 + 10 digits)
  if (value.length > 13) {
    value = value.substring(0, 12); // Limit to 12 characters (+63 + 10 digits)
  }

  setContactNumber(value);
};

  // Log state after it is updated
  useEffect(() => {
    fetchData();
  }, []);

  // Loading state handling
  if (isLoading) {
    return <LoadingScreen />
  }

  // Toggle editing state for each field
  const handleEditClick = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  // Save handler (this is just a placeholder for the actual save functionality)
  const handleSaveClick = (field: string) => {
    // Validate phone number only if it's the contact number field
    if (field === 'contactNumber') {
      const phoneRegex = /^\+63\d{10}$/;
      if (!phoneRegex.test(contactNumber)) {
        alert('Please enter a valid phone number in the format +63xxxxxxxxxx');
        return;
      }
    }

    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false
    }));

    console.log(`${field} saved!`);
    // Add your save logic here (e.g., API call)
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen overflow-y-auto">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-400">Account Settings</h2>
        </div>
  
        {/* Profile Settings Section */}
        <div className="mt-28 mx-8">
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
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className="text-lg font-medium mb-2">Description</label>
                  <div className="flex items-center gap-2">
                    {isEditing.description ? (
                      <button
                        onClick={() => handleSaveClick('description')}
                        className="bg-blue-500 text-white text-sm p-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <PencilIcon
                        className="h-5 w-5 text-blue-400 cursor-pointer"
                        onClick={() => handleEditClick('description')} // Toggle edit mode for description
                      />
                    )}
                  </div>
                </div>
                <textarea
                  id="description"
                  rows="5"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditing.description} // Disabled based on editing state
                />
              </div>
            </div>
  
            {/* Right Side: About Me Info */}
            <div className="w-full md:w-1/2">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <p className="text-gray-700 text-2xl font-bold mt-2">{firstName || "First Name Not Available"} {lastName || "Last Name Not Available"}</p>
                  <span className="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full inline-block mt-2">{position}</span>
                </div>
              </div>
  
              {/* Contact Number */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">Contact Number</h4>
                <div className="flex items-center gap-2">
                  {isEditing.contactNumber ? (
                    <button
                      onClick={() => handleSaveClick('contactNumber')}
                      className="bg-blue-500 text-white text-sm p-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <PencilIcon
                      className="h-5 w-5 text-blue-400 cursor-pointer"
                      onClick={() => handleEditClick('contactNumber')}
                    />
                  )}
                </div>
              </div>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={contactNumber}
                onChange={handlePhoneNumberChange}
                disabled={!isEditing.contactNumber} // Disabled based on editing state
                maxLength={13}
                />
            </div>
  
              {/* Professional Background */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Professional Background</h4>
                  <div className="flex items-center gap-2">
                    {isEditing.professionalBackground ? (
                      <button
                        onClick={() => handleSaveClick('professionalBackground')}
                        className="bg-blue-500 text-white text-sm p-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <PencilIcon
                        className="h-5 w-5 text-blue-400 cursor-pointer"
                        onClick={() => handleEditClick('professionalBackground')}
                      />
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={professionalBackground}
                  onChange={(e) => setProfessionalBackground(e.target.value)}
                  disabled={!isEditing.professionalBackground} // Disabled based on editing state
                />
              </div>
  
              {/* Specialties */}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Specialties</h4>
                  <div className="flex items-center gap-2">
                    {isEditing.specialties ? (
                      <button
                        onClick={() => handleSaveClick('specialties')}
                        className="bg-blue-500 text-white text-sm p-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <PencilIcon
                        className="h-5 w-5 text-blue-400 cursor-pointer"
                        onClick={() => handleEditClick('specialties')}
                      />
                    )}
                  </div>
                </div>
                <textarea
                  rows="2"
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={specialties} // Join array into a string with line breaks
                  onChange={(e) => setSpecialties(e.target.value.split('\n'))} // Split string into an array by line breaks
                  disabled={!isEditing.specialties} // Disabled based on editing state
                />
              </div>
            </div>
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
                className="bg-red-500 text-white px-4 py"
                onClick={() => setIsModalOpen(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => document.querySelector('input[type="file"]').click()} // Open file dialog
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
