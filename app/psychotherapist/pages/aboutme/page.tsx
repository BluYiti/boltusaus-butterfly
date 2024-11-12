'use client'

import { useState, useEffect, ChangeEvent } from 'react';
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { PencilIcon, SaveIcon } from '@heroicons/react/solid';
import { account, databases } from '@/appwrite';
import { fetchProfileImageUrl, fetchPsychoId, uploadProfilePicture } from '@/hooks/userService';
import LoadingScreen from '@/components/LoadingScreen';
import UploadProfile from '@/psychotherapist/components/UploadProfile'; // Import UploadProfile modal
import useAuthCheck from '@/auth/page';

const AboutMe = () => {
  const { loading: authLoading } = useAuthCheck(['psychotherapist']);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [professionalBackground, setProfessionalBackground] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [contactNumber, setContactNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [profilepic, setProfilePic] = useState(""); // Profile picture state
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // State for the profile image URL

  // Editing state for each field
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

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Selected profile file state

  // Fetch the user's information from Appwrite
  const fetchData = async () => {
    try {
      // State variables for user inputs
      const user = await account.get(); // Get user information
      const psychoId = await fetchPsychoId(user.$id); // Get the psychotherapist's ID

      const response = await databases.getDocument(
        'Butterfly-Database', // Your database ID
        'Psychotherapist', // Your collection ID
        psychoId // The document ID to fetch
      );

      // Log the response to see if profilepic is set properly
      console.log("Fetched profile data:", response);

      // Update state with fetched data
      setDescription(response.description || '');
      setContactNumber(response.phonenum || '');
      setFirstName(response.firstName || '');
      setLastName(response.lastName || '');
      setProfessionalBackground(response.background || '');
      setSpecialties(Array.isArray(response.specialties) ? response.specialties : []);
      setPosition(response.position || '');
      setProfilePic(response.profilepic || ''); // Set the profile picture
      console.log("Profile picture:", response.profilepic); // Check the profile picture value
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile image URL if the profile picture is set
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (profilepic) {
        try {
          const imageUrl = await fetchProfileImageUrl(profilepic); // This is an async operation
          setProfileImageUrl(imageUrl); // Store the image URL in state
        } catch (error) {
          console.error("Error fetching profile image URL:", error);
        }
      }
    };

    fetchProfileImage();
  }, [profilepic]); // Only run this effect when the profilepic state changes

  // Handle phone number change
  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (value.startsWith('+63')) {
      value = '+63' + value.slice(3).replace(/[^0-9]/g, '');
    } else {
      value = '+63' + value.replace(/[^0-9]/g, '');
    }

    if (value.length > 13) {
      value = value.substring(0, 12);
    }

    setContactNumber(value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (authLoading ||loading) {
    return <LoadingScreen />;
  }

  const handleEditClick = (field: string) => {
    setIsEditing(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  // Save handler to update the database
  const handleSaveClick = async (field: string) => {
    // Ensure that the phone number is valid
    if (field === 'contactNumber') {
      const phoneRegex = /^\+63\d{10}$/;
      if (!phoneRegex.test(contactNumber)) {
        alert('Please enter a valid phone number in the format +63xxxxxxxxxx');
        return;
      }
    }
  
    try {
      const user = await account.get();
      const psychoId = await fetchPsychoId(user.$id);
  
      // Prepare the data to update
      const updateData: any = {};
      switch (field) {
        case 'description':
          updateData.description = description;
          break;
        case 'contactNumber':
          updateData.phonenum = contactNumber;
          break;
        case 'professionalBackground':
          updateData.background = professionalBackground;
          break;
        case 'specialties':
          // Convert specialties array to a string and ensure it doesn't exceed 100 chars
          const specialtiesString = specialties.join(', ').substring(0, 100);
          updateData.specialties = specialtiesString;
          break;
        default:
          break;
      }
  
      // Update the document in Appwrite
      await databases.updateDocument(
        'Butterfly-Database',
        'Psychotherapist',
        psychoId,
        updateData
      );
  
      // Set the editing flag to false
      setIsEditing(prevState => ({
        ...prevState,
        [field]: false
      }));
  
      console.log(`${field} saved!`);
    } catch (error) {
      console.error("Failed to update document", error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(false); // Close the modal after selecting a file
    }
  };

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

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
                <div className="w-24 h-24 rounded-full bg-blue-500 mb-4">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl} // Use the resolved image URL here
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white text-xl">No Image</span> // Fallback in case there is no image
                  )}
                </div>
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
                        onClick={() => handleEditClick('description')}
                      />
                    )}
                  </div>
                </div>
                <textarea
                  id="description"
                  rows={5}
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
                  disabled={!isEditing.professionalBackground}
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
                  rows={2}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={specialties.join("\n")}
                  onChange={(e) => setSpecialties(e.target.value.split("\n"))}
                  disabled={!isEditing.specialties}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture Modal */}
        <UploadProfile
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleFileChange={handleFileChange}
        />
      </div>
    </Layout>
  );
};

export default AboutMe;
