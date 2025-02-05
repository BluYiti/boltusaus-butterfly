'use client'

import React, { useState, useEffect } from "react";
import { account, databases, Query } from "@/appwrite"; // Import Appwrite account service for fetching user data
import useAuthCheck from "@/auth/page"; // Correct import path for useAuthCheck
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import SessionHandler from "@/auth/logout/component/SessionHandler"
import Link from "next/link"; // Import Link for navigation
import 'typeface-roboto';
import 'typeface-lora';
import LoadingScreen from "@/components/LoadingScreen"; // Import LoadingScreen component
import { fetchProfileImageUrl, getLatestAppointmentStatus } from "@/hooks/userService";
import { downloadCertificate } from "@/hooks/userService";
import PsychotherapistProfile from '@/client/components/PsychotherapistProfile'; // Adjust the path if necessary
import Image from 'next/image';

const NewClientDashboard = () => {
  const authLoading = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(false); // State to track if data is still loading
  const [, setUsers] = useState([]);
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [state, setState] = useState<string | null>(null); // State to track user state
  const [status, setStatus] = useState<string | null>(null); // State to track user status
  const [apptStatus, setApptStatus] = useState<string | null>(null); // State to track user's most recent appointment status
  const [cert, setCert] = useState<string | null>(null); // State to track user certificate
  const [hasPsychotherapist, setHasPsychotherapist] = useState(false);
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
        const userPsycho = stateResponse.documents[0]?.psychotherapist;

        //Fetch user recent appointment status
        setApptStatus(await getLatestAppointmentStatus(stateResponse.documents[0]?.$id));
        console.log(apptStatus);

        setState(userState);
        setStatus(userStatus);
        setCert(userCert);
        setHasPsychotherapist(!!userPsycho); // If userPsycho is not null or empty, set to true

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
  }, [state, status, apptStatus]); // Empty dependency array to run once on component mount

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

  if (authLoading || dataLoading) return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <SessionHandler />
      {/* Header Section */}
      <div className="bg-white rounded-b-lg shadow-md p-5 w-full">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 font-roboto">
          Welcome, {userName ? userName : "Client"}!
        </h2>
        <p className="text-gray-600 text-base sm:text-lg font-lora">
          Book your therapy sessions with ease and embark on your path to well-being.
        </p>
      </div>

      <div className="flex flex-col mt-7 lg:flex-row justify-between items-start px-4 sm:px-8 space-y-6 lg:space-y-0 lg:space-x-6">

        {/* Left Section - Pre-assessment & Psychotherapists */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full lg:h-[30rem]">
          
          {/* Pre-assessment & Booking Section */}
          {state === "new" && (
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg text-center">
              <Link href="/preassessment">
                <button className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105">
                  Start Pre-assessment Test
                </button>
              </Link>
              <p className="text-black py-3 px-2 rounded-lg font-mono">
                &quot;Take this brief pre-assessment test to help us understand how we can best support you on your journey to well-being! ✨🦋&quot;
              </p>
            </div>
          )}

          {/* Evaluate Clients */}
          {state === "evaluate" && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg text-center sm:text-left">
              <button className="text-white w-full sm:w-auto bg-blue-400 font-semibold py-3 px-6 rounded-lg" disabled>
                ✅ Preassessment Done!
              </button>
              <p className="py-3 px-6 rounded-lg font-mono">
                ⏳ Please wait for confirmation in your dashboard. It may take 1-2 days. Thank you for your patience!
              </p>
            </div>
          )}

          {/* Referred Clients */}
          {state === "referred" && status === "pending" && (
            <div className="mb-4 text-green-600 text-4xl flex items-center">
              <span className="text-green-600 animate-bounce">✅</span>
              <span className="ml-2 text-lg font-bold">You have been referred. To receive your certificate of referral book an appointment 🦋</span>
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

          {/* Current Clients */}
          {state === "current" && (
            hasPsychotherapist ? (
              <div className="p-2 bg-white rounded-lg text-center">
              {apptStatus === 'pending' && (
                <>
                <div>
                  <div className="w-full sm:w-auto bg-yellow-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-yellow-400 transition duration-300 shadow-md mb-2">
                    ⏳ Payment Pending
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-700 text-center">
                  Payment is pending. Please wait for confirmation.
                </span>
                </>
              )}
              
              {apptStatus === 'paid' && (
                <>
                  <div className="sm:w-auto bg-green-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-500 transition duration-300 shadow-md mb-1">
                    ✅ Payment Confirmed
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    Your appointment is confirmed and everything is set! We look forward to seeing you soon.
                  </span>
                </>
              )}
        
              {apptStatus === 'happening' && (
                <>
                  <div className="sm:w-auto bg-blue-800 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md mb-2">
                    📅 Appointment Happening Now
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    Your appointment is currently happening.
                  </span>
                </>
              )}

              {apptStatus === 'success' && (
                <>
                  <div className="sm:w-auto bg-green-700 text-white py-2 px-6 rounded-full font-semibold hover:bg-green-500 transition duration-300 shadow-md mb-1">
                    ✅ Appointment Done!
                  </div>
                  <span className="text-lg font-bold text-gray-700">
                    Session complete! We hope this appointment was a valuable step forward in your journey 🙌
                  </span>
                </>
              )}
        
              {apptStatus === 'missed' && (
                <>
                  <div className="bg-red-800 text-white py-2 rounded-full font-semibold hover:bg-red-500 transition duration-300 shadow-md mb-1">
                    ❌ Appointment Missed You missed your appointment. Please reschedule.
                  </div>
                  <Link href="/client/pages/bookappointment">
                    <button className="w-full sm:w-auto bg-blue-800 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                      📅 Reschedule Appointment
                    </button>
                  </Link>
                </>
              )}

              {apptStatus === 'rescheduleRequest' && (
                <>
                  <div>
                    <div className="w-full sm:w-auto bg-yellow-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-yellow-400 transition duration-300 shadow-md mb-2">
                      ⏳ Reschedule Request Pending
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-700 text-center">
                    Reschedule is pending. Please wait for confirmation.
                  </span>
                </>
              )}
        
              {/* If there's no status, the default rendering will be the "Book Your Appointment" button */}
              {!apptStatus && (
                <>
                  <Link href="/client/pages/bookappointment">
                    <button className="w-full sm:w-auto bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                      📅 Book Your Appointment
                    </button>
                  </Link>
                  <span className="text-lg font-bold text-gray-700 mt-4">Your Notifications will appear here!</span>
                </>
              )}
            </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-white shadow-lg rounded-lg text-center sm:text-left">
                <Link href="/client/pages/bookappointment">
                  <button className="w-full sm:w-auto bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md">
                    📅 Book Your Appointment
                  </button>
                </Link>
                <span className="text-green-600 animate-bounce text-2xl">✅</span>
                <span className="text-lg font-bold text-gray-700">Evaluation Completed!</span>
              </div>
            )
          )}

          {/* Psychotherapists Section */}
          <div className="relative overflow-hidden">
            <h3 className="text-2xl font-bold text-blue-500 text-left mb-2 font-lora">
              Meet our caring psychotherapists, here to guide your healing!
            </h3>
            <div className="max-w-[750px] md:max-w-[850px] overflow-x-auto p-4 space-x-4 scrollbar-thin scrollbar-thumb-blue-300 flex">
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
                    onError={() => "/images/default-profile.png"}
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

        {/* Right Section - Daily Reminder */}
        <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full lg:h-[30rem]">
          <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-blue-950 sm:mb-4">A Daily Reminder to Yourself</h2>
          <div className="space-y-5 text-black max-h-[330px] overflow-x-hidden overflow-y-auto">
            {[
              { emoji: "😊", title: "This Too Shall Pass", text: "Feelings are temporary. Hold on, better days are coming." },
              { emoji: "😮‍💨", title: "Breathe In, Let Go", text: "Take a moment to breathe. Release the tension in your mind and body." },
              { emoji: "🫵", title: "You Are Enough", text: "Your worth isn’t measured by your struggles. You are enough just as you are." }
            ].map((item, index) => (
              <div key={index} className="bg-blue-50 border-blue-300 p-3 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl duration-300">
                <h3 className="font-semibold text-lg">{item.emoji} {item.title}</h3>
                <p className="text-gray-800">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* What to do section */}
      <div className="flex flex-col mt-6 lg:flex-row justify-between items-start space-y-8 lg:space-y-0 lg:space-x-8 px-8 w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full mb-8">
          <h2 className="text-lg font-semibold text-blue-500">What to do during your freetime?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
