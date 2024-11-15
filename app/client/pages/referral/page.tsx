"use client"; // Mark this file as a Client Component

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";

const AppointmentBooking = () => {
  
  const { loading: authLoading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [modalOpen, setModalOpen] = useState(true); // State to control the modal
 
  useEffect(() => {
    setModalOpen(true); // Automatically open the modal when the page loads
  }, []);

  if (authLoading ) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
}

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gradient-to-b from-blue-100 to-blue-600">
        <div className="flex-grow flex flex-col justify-between bg-blue-100">
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black flex flex-col flex-grow p-6 space-y-6 mx-auto w-3/4">
              
              {/* Modal */}
              {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 relative">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🌞</div>
                      <h2 className="text-xl font-semibold mb-4">
                        You have been referred by the Psychotherapist to a different clinic.
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Please view and download the attached referral certificate below.
                      </p>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        View Attached Certificate
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of your component content */}
              <div className="text-left mb-8">
                <div className="text-green-600 text-4xl mb-4 flex items-center">
                  <span className="text-green-600 animate-bounce">✔️</span>
                  <span className="ml-2 text-lg font-bold">Evaluation Completed!</span>
                </div>
                <div className="text-xl font-semibold"></div>
              </div>

              {/* Flex container to display both sections side by side */}
              <div className="flex justify-left space-x-6">
                {/* Meet our caring psychotherapists section */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-blue-500 text-left mb-6">
                    Meet our caring psychotherapists, here to guide your healing!
                  </h3>
                </div>

                {/* A Daily Reminder to Yourself section */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
                    <h2 className="text-xl font-semibold text-blue-500 mb-4">A Daily Reminder to Yourself</h2>
                    <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px]">
                      <div className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                        <h3 className="font-semibold text-lg text-blue-500">This Too Shall Pass</h3>
                        <p className="text-gray-700">Feelings are temporary. Hold on, better days are coming.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                        <h3 className="font-semibold text-lg text-blue-500">Breathe In, Let Go</h3>
                        <p className="text-gray-700">Take a moment to breathe. Release the tension in your mind and body.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                        <h3 className="font-semibold text-lg text-blue-500">You Are Enough.</h3>
                        <p className="text-gray-700">Your worth isn’t measured by your struggles. You are enough just as you are.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to do section */}
              <div className="bg-blue-100 rounded-lg shadow-lg p-6 mt-8">
                <h2 className="text-lg font-semibold text-blue-500">What to do during your freetime?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                    <div className="font-semibold text-blue-500">Take time to Meditate</div>
                    <p className="text-sm">20-30 minutes/day 🧘‍♀️</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                    <div className="font-semibold text-blue-500">Have Time with your pets</div>
                    <p className="text-sm">Be sure to have some playtime with your beloved pets 🐶</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                    <div className="font-semibold text-blue-500">Workout and Exercise</div>
                    <p className="text-sm">30-35 minutes/day 💪</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow transition-all duration-300 hover:shadow-xl">
                    <div className="font-semibold text-blue-500">Paint something colorful</div>
                    <p className="text-sm">Showcase your talent, be unique and creative! 🎨</p>
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

export default AppointmentBooking;
