"use client"; // Client Component 
import { FaUserCircle, FaBars, FaHeart, FaBell, FaUser, FaCamera, FaPen, FaTimes, FaArrowRight } from 'react-icons/fa'; 
import Layout from "@/components/Sidebar/Layout"; // Assuming Layout is the component that wraps sidebar and content 
import items from "@/client/data/Links"; 
import React, { useState, useEffect } from 'react'; 

const userName = "John"; // Placeholder for dynamic user data 

const ProfilePage: React.FC = () => { 
  const [name, setName] = useState<string>(''); // Name from the database 
  const [profilePic, setProfilePic] = useState<string>(''); // Profile picture URL 

  useEffect(() => { 
    async function fetchUserData() { 
      const response = await fetch('/api/user'); // Replace with your API endpoint 
      const data = await response.json(); 
      setName(data.name); 
      setProfilePic(data.profilePic); // Set profilePic from database 
    } 

    fetchUserData(); 
  }, []); 

  const handleEditProfile = () => { 
    // Navigate to Edit Profile page or open an Edit Profile modal 
    console.log("Edit Profile clicked"); 
  }; 

  const handleGoalTrackedClick = () => { 
    // Handle the click event for Goals Tracked 
    console.log("Goals Tracked clicked"); 
  }; 

  return ( 
    <Layout sidebarTitle="Butterfly" sidebarItems={items}> 
      <div className="text-black min-h-screen flex bg-gray-50"> 
        {/* Sidebar is wrapped inside Layout */} 

        {/* Main Content */} 
        <div className="flex-grow flex flex-col bg-gray-50 px-10 py-8 overflow-y-auto"> 
          {/* Top Section with User Info */} 
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6"> 
            <div className="flex items-center space-x-3"> 
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white"> 
                <FaUser size={28} /> 
              </div> 
              <h1 className="text-2xl font-semibold text-gray-800">Profile</h1> 
            </div> 
          </div> 

          {/* Profile Section */} 
          <div className="bg-white shadow-md p-6 rounded-lg flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0 md:space-x-8"> 
            {/* Profile Picture and Edit Button */} 
            <div className="flex flex-col items-center"> 
              <img 
                src={profilePic || '/mnt/data/image.png'} // Default if no profile picture 
                alt="Profile" 
                className="rounded-full w-32 h-32 object-cover" 
              /> 
              {/* Edit Profile Button */} 
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-4" 
                onClick={handleEditProfile} 
              > 
                Edit Profile 
              </button> 
            </div> 

            {/* Personal Information Section */} 
            <div className="mt-4 md:mt-0"> 
              <h2 className="text-xl font-bold mb-4 text-gray-800">Personal Information</h2> 
              <p><strong>Full Name:</strong> {name}</p> 
              <p><strong>Date of Birth:</strong> March 17, 2000</p> 
              <p><strong>Gender:</strong> Male</p> 
              <p><strong>Age:</strong> 23</p> 
              <p><strong>Contact Number:</strong> +639884023464</p> 
            </div> 
          </div> 

          {/* Tracked Items Section */} 
          <div className="mt-6 flex flex-col space-y-4 max-w-xs"> {/* Set a maximum width */} 
            <button 
              className="flex items-center bg-blue-600 text-white rounded-lg p-4 shadow-sm hover:bg-blue-700 transition cursor-pointer" 
              onClick={handleGoalTrackedClick} 
            > 
              <span className="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold mr-4"> 
                0 
              </span> 
              <span className="text-lg font-semibold">Goals Tracked</span> 
              <FaArrowRight className="ml-2" /> 
            </button> 
            <div className="flex items-center bg-blue-100 rounded-lg p-4 shadow-sm"> 
              <span className="bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold"> 
                0 
              </span> 
              <span className="ml-4 text-lg text-blue-800 font-semibold">Moods Tracked</span> 
            </div> 
            <div className="flex items-center bg-blue-100 rounded-lg p-4 shadow-sm"> 
              <span className="bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold"> 
                0 
              </span> 
              <span className="ml-4 text-lg text-blue-800 font-semibold">Resources Read</span> 
            </div> 
          </div> 
        </div> 
      </div> 
    </Layout> 
  ); 
}; 

export default ProfilePage; 
