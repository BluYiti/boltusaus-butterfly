'use client'

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import Link from "next/link"; // Import Link for navigation
import '../../../globals.css';
import 'typeface-roboto';
import 'typeface-lora';
import { useRouter } from "next/navigation";
import { account, databases, Query } from "@/appwrite"; // Import Appwrite account service for fetching user data
import useAuthCheck from "@/auth/page"; // Correct import path for useAuthCheck
import LoadingScreen from "@/components/LoadingScreen"; // Import LoadingScreen component

const therapists = [
  {
    name: "Ma'am Angelica Peralta",
    specialty: "Senior Psychotherapist",
    imgSrc: "https://via.placeholder.com/60", // Replace with actual image URLs
  },
  {
    name: "Ma'am Junior Psychotherapist",
    specialty: "Junior Psychotherapist",
    imgSrc: "https://via.placeholder.com/60", // Replace with actual image URLs
  },
];

const NewClientDashboard = () => {
  const [state, setState] = useState<string | null>(null); // State to track user state
  const [status, setStatus] = useState<string | null>(null); // State to track user status
  const [userName, setUserName] = useState<string | null>(null); // State to track user name
  const [users, setUsers] = useState([]);
  
  const router = useRouter();
  const { loading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  // Redirect if the state is 'current' or if state is 'referred' and status is 'attached'

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

    fetchUserData();
    fetchUserState();
  }, [router]); // Dependency array includes router for redirection

  if (loading) {
    if (state === 'current' || (state === 'referred' && status === 'attached')) {
      router.push('/client/pages/acceptedClientBooking');
    }
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

      {/* Main Content */}
      <div className="text-black min-h-screen flex bg-gradient-to-b from-blue-100 to-blue-600 landscape:flex-row">
        <div className="flex-grow flex flex-col justify-between bg-blue-100">
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black flex flex-col flex-grow p-6 space-y-6 mx-auto w-3/4">
              <div className="text-left mb-8">
                <div className="text-xl font-semibold">
                  {/* Conditionally render pre-assessment button based on user status */}
                  {state === "new" ? (
                    <Link href="/preassessment">
                      <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
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
              </div>

              {/* Flex container to display both sections side by side */}
              <div className="flex justify-left space-x-6">
                {/* Meet our caring psychotherapists section */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-blue-500 text-left mb-6 font-lora">
                    Meet our caring psychotherapists, here to guide your healing!
                  </h3>
                  <div className="flex justify-left space-x-6">
                    {therapists.map((therapist, index) => (
                      <div
                        key={index}
                        className="relative bg-blue-100 border border-blue-500 shadow-lg p-6 rounded-lg w-60 text-center overflow-hidden transform transition-shadow duration-500 hover:shadow-2xl"
                      >
                        <img
                          src={therapist.imgSrc}
                          alt={therapist.name}
                          className="rounded-full mx-auto w-24 h-24 mb-4 transition-transform duration-300 transform hover:scale-110"
                        />
                        <h4 className="text-lg font-bold text-blue-500 font-roboto">{therapist.name}</h4>
                        <p className="text-sm text-gray-600 font-lora">{therapist.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* A Daily Reminder to Yourself section */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
                    <h2 className="text-xl font-semibold text-blue-500 mb-4 font-lora">A Daily Reminder to Yourself</h2>
                    <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px]">
                      <div className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                        <h3 className="font-semibold text-lg text-blue-500 font-roboto">This Too Shall Pass</h3>
                        <p className="text-gray-700 font-lora">Feelings are temporary. Hold on, better days are coming.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                        <h3 className="font-semibold text-lg text-blue-500 font-roboto">Breathe In, Let Go</h3>
                        <p className="text-gray-700 font-lora">Take a moment to breathe. Release the tension in your mind and body.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                        <h3 className="font-semibold text-lg text-blue-500 font-roboto">You Are Enough.</h3>
                        <p className="text-gray-700 font-lora">Your worth isn’t measured by your struggles. You are enough just as you are.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to do section */}
              <div className="bg-blue-100 rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-lg font-semibold text-blue-500 font-lora">What to do during your freetime?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                    <div className="font-semibold text-blue-500 font-roboto">Take time to Meditate</div>
                    <p className="text-gray-700 font-lora">Find a peaceful space to meditate and breathe deeply.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                    <div className="font-semibold text-blue-500 font-roboto">Engage in physical activity</div>
                    <p className="text-gray-700 font-lora">Go for a walk, stretch, or do some light exercise.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewClientDashboard;
