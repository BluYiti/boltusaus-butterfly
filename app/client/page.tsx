'use client'

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import SessionHandler from "@/auth/logout/component/SessionHandler"
import Link from "next/link"; // Import Link for navigation
import 'typeface-roboto';
import 'typeface-lora';
import { account, databases, Query } from "@/appwrite"; // Import Appwrite account service for fetching user data
import useAuthCheck from "@/auth/page"; // Correct import path for useAuthCheck
import LoadingScreen from "@/components/LoadingScreen"; // Import LoadingScreen component
import { fetchProfileImageUrl } from "@/hooks/userService";
import { downloadCertificate } from "@/hooks/userService";
import PsychotherapistProfile from '@/client/components/PsychotherapistProfile'; // Adjust the path if necessary
import Image from 'next/image';

const NewClientDashboard = () => {
  const { loading: authLoading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(true); // State to track if data is still loading
  const [, setUsers] = useState([]);
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [state, setState] = useState<string | null>(null); // State to track user state
  const [status, setStatus] = useState<string | null>(null); // State to track user status
  const [cert, setCert] = useState<string | null>(null); // State to track user certificate
  const [userName, setUserName] = useState<string | null>(null); // State to track user name
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPsychotherapist, setSelectedPsychotherapist] = useState<null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get(); // Get user information
        setUserName(user.name); // Assuming Appwrite returns 'name' field for the user

        // Fetch users
        const userResponse = await databases.listDocuments("Butterfly-Database", "Client");
        setUsers(userResponse.documents);

        // Fetch user state
        const stateResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Client',
          [Query.equal('userid', user.$id)] // Fetch documents where userid matches the logged-in user
        );
        const userState = stateResponse.documents[0]?.state;
        const userStatus = stateResponse.documents[0]?.status;
        const userCert = stateResponse.documents[0]?.certificate;
        setState(userState);
        setStatus(userStatus);
        setCert(userCert);

        // Fetch psychotherapists
        const therapistResponse = await databases.listDocuments('Butterfly-Database', 'Psychotherapist');
        setPsychotherapists(therapistResponse.documents);

        // Fetch profile images for client
        const profileImages = {};
        for (const therapist of therapistResponse.documents) {
          if (therapist.profilepic) {
            const url = await fetchProfileImageUrl(therapist.profilepic);
            if (url) {
              profileImages[therapist.$id] = url;
            }
          }
        }
        setProfileImageUrls(profileImages);

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setDataLoading(false); // Set dataLoading to false when all data is fetched
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on component mount

  const handleDownload = () => {
    const documentId = cert; // Assuming userCert is defined in the same scope
    downloadCertificate(documentId, userName);
  };

  const handleProfileClick = (psychotherapist) => {
    setSelectedPsychotherapist(psychotherapist); // Set the selected psychotherapist
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedPsychotherapist(null); // Reset selected psychotherapist
  };

  if (authLoading || dataLoading) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <SessionHandler />
      {/* Header Section */}
      <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full">
        <h2 className="text-4xl font-bold text-blue-500 font-roboto">
          Welcome, {userName ? userName : "Client"}!
        </h2>
        <p className="text-gray-600 text-lg font-lora">
          Book your therapy sessions with ease and embark on your path to well-being.
        </p>
      </div>

      <div className="flex justify-between items-start space-x-4 px-8 ">
        {/* Left side - Pre-assessment and Psychotherapists Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mb-6 mt-8 h-[27rem] w-[50%]">
          {/* Conditionally render based on client state */}
          {state === "new" && (
            <Link href="/preassessment">
              <button className="bg-[#2563EB] text-white py-2 px-4 mb-4 rounded text-xl font-semibold hover:bg-blue-300 hover:scale-105">
                Start Pre-assessment test
              </button>
            </Link>
          )}

          {state === "current" && (
            <div className="mb-4 text-green-600 text-4xl flex items-center">
              <Link href="/client/pages/bookappointment">
                <button className="text-xl font-semibold bg-blue-500 hover:bg-gray-500 text-white py-2 px-4 rounded">
                  Book your appointment
                </button>
              </Link>
              <span className="ml-3 text-green-600 animate-bounce">✅</span>
              <span className="text-lg font-bold">Evaluation Completed!</span>
            </div>
          )}

          {state === "evaluate" && (
            <>
              <div className="relative group flex"> {/* Wrapper for hover effect */}
                <button
                  className="bg-gray-300 text-gray-600 font-bold mb-4 py-2 px-4 rounded cursor-not-allowed"
                  disabled
                >
                  Pre-Assessment Done!
                </button>
                <p className="ml-2 bg-[#2563EB] text-white mb-4 py-2 px-4 rounded">
                  Please wait for the confirmation here in your dashboard, it might take 1-2 days! Thank You for your patience!
                </p>
              </div>
            </>
          )}

          {state === "referred" && status === "pending" && (
            <div className="mb-4 text-green-600 text-4xl flex items-center">
              <span className="text-green-600 animate-bounce">✅</span>
              <span className="ml-2 text-lg font-bold">You have been referred. Your certificate of referral is on the way!</span>
            </div>
          )}

          {state === "referred" && status === "attached" && (
            <div className="mb-4 text-green-600 text-4xl flex items-center">
              <button
                className="text-xl font-semibold bg-blue-500 hover:bg-gray-500 text-white py-2 px-4 rounded"
                onClick={handleDownload}
              >
                Click me to download Certificate.
              </button>
              <span className="text-green-600 animate-bounce">✅</span>
              <span className="ml-2 text-lg font-bold">You have been referred</span>
            </div>
          )}

          {/* Psychotherapists Section */}
            <div className="relative overflow-hidden">
              <div className="flex overflow-x-auto p-4 space-x-4 scrollbar-thin scrollbar-thumb-blue-300">
                {psychotherapists.map((psychotherapist, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center justify-center w-[300px] p-4"
                    onClick={() => handleProfileClick(psychotherapist)}
                    tabIndex={0} // Makes it focusable
                    aria-label={`View profile of ${psychotherapist.firstName} ${psychotherapist.lastName}`}
                  >
                    <div className="flex flex-col items-center bg-white border border-blue-300 rounded-3xl p-3 min-w-[300px] transform transition-transform duration-500 ease-in-out hover:scale-105 shadow-lg">
                      <Image
                        src={profileImageUrls[psychotherapist.$id] || "/images/default-profile.png"}
                        alt={`${psychotherapist.firstName || "N/A"} ${psychotherapist.lastName || "N/A"}`}
                        className="rounded-full mb-4"
                        width={96}
                        height={96}
                        unoptimized
                        onError={(e) => e.target.src = "/images/default-profile.png"}
                      />
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-blue-500 font-roboto">
                          {psychotherapist.firstName || "First Name"} {psychotherapist.lastName || "Last Name"}
                        </h4>
                        <p className="text-sm text-gray-600 font-lora">
                          {psychotherapist.specialties || "Specialties not specified"}
                        </p>
                        <h3 className="text-gray-600 font-lora">
                          {psychotherapist.position
                            ? `${psychotherapist.position.charAt(0).toUpperCase()}${psychotherapist.position.slice(1)}`
                            : "Position not specified"}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right side - A Daily Reminder Section */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg mt-8 h-[27rem]">
          <h2 className="font-bold sm:text-2xl 2xl:text-4xl text-blue-950 mb-6">A Daily Reminder to Yourself</h2>
          <div className="sm:space-y-5 3xl:space-y-8 max-h-[300px] text-black">
              <div className="bg-blue-50 border-blue-300 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <h2 className="font-semibold text-lg mb-2">😊 This Too Shall Pass</h2>
                  <p className="text-gray-800">Feelings are temporary. Hold on, better days are coming.</p>
              </div>
              <div className="bg-blue-50 border-blue-300 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <h3 className="font-semibold text-lg mb-2">😮‍💨 Breathe In, Let Go</h3>
                  <p className="text-gray-800">Take a moment to breathe. Release the tension in your mind and body.</p>
              </div>
              <div className="bg-blue-50 border-blue-300 p-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
                  <h3 className="font-semibold text-lg mb-2">🫵 You Are Enough.</h3>
                  <p className="text-gray-800">Your worth isn&apos;t measured by your struggles. You are enough just as you are.</p>
              </div>
          </div>
        </div>
      </div>

      {/* What to do section */}
      <div className="flex justify-between items-start space-x-8 px-8 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full mb-8">
          <h2 className="text-lg font-semibold text-blue-500">What to do during your freetime?</h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="font-semibold text-blue-500">Read a Book</div>
              <p className="text-sm text-gray-600">Lose yourself in a world of knowledge or stories.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="font-semibold text-blue-500">Do Yoga</div>
              <p className="text-sm text-gray-600">Stretch, breathe, and relax.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="font-semibold text-blue-500">Take a Walk</div>
              <p className="text-sm text-gray-600">Enjoy some fresh air and a change of scenery.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl hover:scale-105">
              <div className="font-semibold text-blue-500">Listen to Music</div>
              <p className="text-sm text-gray-600">Let music uplift or soothe your soul.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Psychotherapist Modal */}
      {isModalOpen && selectedPsychotherapist && (
        <PsychotherapistProfile
          psychotherapist={selectedPsychotherapist}
          onClose={handleCloseModal}
        />
      )}
    </Layout>
  );
};

export default NewClientDashboard;
