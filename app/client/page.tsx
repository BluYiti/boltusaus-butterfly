'use client'

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import Link from "next/link"; // Import Link for navigation
import 'typeface-roboto';
import 'typeface-lora';
import { account, databases, Query } from "@/appwrite"; // Import Appwrite account service for fetching user data
import useAuthCheck from "@/auth/page"; // Correct import path for useAuthCheck
import LoadingScreen from "@/components/LoadingScreen"; // Import LoadingScreen component

const NewClientDashboard = () => {
  const { loading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [users, setUsers] = useState([]);
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [state, setState] = useState<string | null>(null); // State to track user state
  const [status, setStatus] = useState<string | null>(null); // State to track user status
  const [userName, setUserName] = useState<string | null>(null); // State to track user name

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = await account.get(); // Get user information
          setUserName(user.name); // Assuming Appwrite returns 'name' field for the user
          
          const response = await databases.listDocuments("Butterfly-Database", "Client");
          setUsers(response.documents);
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      };
  
      const fetchUserState = async () => {
        try {
          const user = await account.get(); // Get user information
          const response = await databases.listDocuments(
            'Butterfly-Database', 
            'Client', 
            [Query.equal('userid', user.$id)] // Fetch documents where userid matches the logged-in user
          );
          
          // Assuming the user's state is in response.documents[0] (adjust if needed)
          const userState = response.documents[0]?.state;
          const userStatus = response.documents[0]?.status;
          setState(userState);
          setStatus(userStatus);
        } catch (error) {
          console.error('Error fetching user state:', error);
        }
      };

      const fetchPsychotherapists = async () => {
        try {
          const user = await account.get(); // Get user information
          const response = await databases.listDocuments('Butterfly-Database', 'Psychotherapist');
          
          setPsychotherapists(response.documents);
        } catch (error) {
          console.error('Error fetching user state:', error);
        }
      }
  
      fetchUserData();
      fetchUserState();
      fetchPsychotherapists();
    }, []); // Dependency array includes router for redirection

  if (loading) {
    return <LoadingScreen />; // Show the loading screen while the auth check is in progress
  }
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      {/* Header Section */}
      <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full">
          <h2 className="text-4xl font-bold text-blue-500 font-roboto">
          Welcome, {userName ? userName : "Client"}!
          </h2>
          <p className="text-gray-600 text-lg font-lora">
          Book your therapy sessions with ease and embark on your path to well-being.
          </p>
      </div>
        
      <div className="flex justify-between items-start space-x-8 px-8">
        {/* Left side - Pre-assessment and Psychotherapists Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-8 mt-8 h-96">
          {state === "new" && (
              <div className="text-xl font-semibold mb-6">
                  {state === "new" ? (
                      <Link href="/preassessment">
                          <button className="bg-[#2563EB] text-white font-bold py-2 px-4 rounded hover:bg-blue-300   hover:scale-105">
                              Start Pre-assessment test
                          </button>
                      </Link>
                  ) : (
                      <>
                          <button
                              className="bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded cursor-not-allowed"
                              disabled
                          >
                              Start Pre-assessment test
                          </button>
                          <div className="speech-bubble mt-4">
                              <p className="text-black font-semibold">
                                  Pre-assessment Already Completed! <br />
                                  Please wait for the confirmation, it might take 1-2 days! <br />
                                  Thank You!
                              </p>
                          </div>
                      </>
                  )}
              </div>
          )}

          {/* Psychotherapists Section */}
          <div>
              <h3 className="text-3xl font-bold text-blue-500 text-left mb-6 font-lora">
                  Meet our caring psychotherapists, here to guide your healing!
              </h3>
              <div className="overflow-x-auto z-10">
                  <div className="flex gap-6 mt-10">
                      {psychotherapists.map((psychotherapist, index) => (
                          <div
                              key={index}
                              className="flex items-center bg-white border border-blue-300 p-4 rounded-3xl transition-transform duration-500 ease-in-out transform   min-w-[300px]"
                          >
                              <img
                                  src={psychotherapist.imgSrc}
                                  alt={psychotherapist.name}
                                  className="rounded-full w-24 h-24 mr-4"
                              />
                              <div className="flex flex-col">
                                  <h4 className="text-lg font-bold text-blue-500 font-roboto">
                                      {psychotherapist.firstName} {psychotherapist.lastName}
                                  </h4>
                                  <p className="text-sm text-gray-600 font-lora">{psychotherapist.specialties}</p>
                                  <h3 className="text-gray-600 font-lora">
                                      {psychotherapist.position ? 
                                          psychotherapist.position.charAt(0).toUpperCase() + psychotherapist.position.slice(1) : 
                                          'Position not specified'}
                                  </h3>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        </div>

        {/* Right side - A Daily Reminder Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mt-8 h-96">
          <h2 className="font-bold text-4xl text-blue-950 mb-6">A Daily Reminder to Yourself</h2>
          <div className="space-y-6 max-h-[300px] text-black">
              <div className="bg-blue-50   border-blue-300 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <h2 className="font-semibold text-lg mb-2">😊 This Too Shall Pass</h2>
                  <p className="text-gray-800">Feelings are temporary. Hold on, better days are coming.</p>
              </div>
              <div className="bg-blue-50 border-blue-300 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <h3 className="font-semibold text-lg mb-2">😮‍💨 Breathe In, Let Go</h3>
                  <p className="text-gray-800">Take a moment to breathe. Release the tension in your mind and body.</p>
              </div>
              <div className="bg-blue-50 border-blue-300 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <h3 className="font-semibold text-lg mb-2">🫵 You Are Enough.</h3>
                  <p className="text-gray-800">Your worth isn't measured by your struggles. You are enough just as you are.</p>
              </div>
          </div>
        </div>
      </div>

      {/* What to do section */}
      <div className="flex justify-between items-start space-x-8 px-8 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
          <h2 className="text-lg font-semibold text-blue-500">What to do during your freetime?</h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
              <div className="font-semibold text-blue-500">Take time to Meditate</div>
              <p className="text-sm">20-30 minutes/day 🧘‍♀️</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
              <div className="font-semibold text-blue-500">Have Time with your pets</div>
              <p className="text-sm">Be sure to have some playtime with your beloved pets 🐶</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
              <div className="font-semibold text-blue-500">Workout and Exercise</div>
              <p className="text-sm">30-35 minutes/day 💪</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
              <div className="font-semibold text-blue-500">Paint something colorful</div>
              <p className="text-sm">Showcase your talent, be unique and creative! 🎨</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NewClientDashboard;