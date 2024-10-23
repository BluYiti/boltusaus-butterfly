"use client"; // Add this at the top of the file

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Confetti from "react-confetti"; // Import Confetti for the success effect
import { databases } from "@/appwrite";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import Calendar from "@/components/Calendar/Calendar"; // Import the Calendar component

const AppointmentBooking = () => {
  const { loading: authLoading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(true); // State to track if data is still loading
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [appointmentBooked, setAppointmentBooked] = useState(false); // State for success message
  const [showPrompt, setShowPrompt] = useState(false); // Confirmation prompt state
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth(); // Get the index of the current month
  const currentMonth = today.toLocaleString("default", { month: "long" });

  const handleBookAppointment = () => {
    if (selectedTherapist && selectedDay && selectedTime) {
      setShowPrompt(true); // Show confirmation prompt when booking
    }
  };
  
  // Get the next month and its name
  const nextMonthIndex = (currentMonthIndex + 1) % 12;
  const nextMonth = new Date(currentYear, nextMonthIndex).toLocaleString("default", { month: "long" });
  
  const confirmBooking = () => {
    setAppointmentBooked(true); // Show success message when confirmed
    setShowPrompt(false); // Hide prompt after confirmation
  };

  const cancelBooking = () => {
    setShowPrompt(false); // Hide the prompt when cancelled
  };

  const handleProceedToPayment = () => {
    // Handle the payment logic here
    console.log("Proceeding to payment...");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch psychotherapists
        const therapistResponse = await databases.listDocuments('Butterfly-Database', 'Psychotherapist');
        setPsychotherapists(therapistResponse.documents);

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setDataLoading(false); // Set dataLoading to false when all data is fetched
      }
    };
    fetchData();
    
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isFormComplete = selectedDay !== null && selectedTime;

  if (authLoading || dataLoading) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between bg-gray-100 w-3/4">
          <div className="bg-blue-100 shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black w-full flex flex-col bg-gray-100 w-100">
              <div className="flex flex-col p-6 space-y-6">
                {/* Your UI for selecting psychotherapists */}
                <h3 className="text-3xl font-bold text-blue-900">
                  Choose Psychotherapist <span className="text-red-500">{!selectedTherapist && "*"}</span>
                </h3>

                <div className="flex space-x-6 mt-4">
                  {psychotherapists.map((psychotherapist) => (
                    <div
                      key={psychotherapist.$id} // Use unique key (assuming $id exists in your database)
                      className={`w-1/2 bg-white p-4 rounded shadow-lg border transition-transform duration-300 ${
                        selectedTherapist?.$id === psychotherapist.$id
                          ? 'border-[#2563EB] scale-105' // Scale up when selected
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={psychotherapist.imgSrc}
                          alt={psychotherapist.firstName}
                          className="rounded-full w-16 h-16"
                        />
                        <div>
                          <h3 className="text-lg font-bold">
                            {psychotherapist.firstName} {psychotherapist.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Specialty: {psychotherapist.specialties}
                          </p>
                          <button
                            className={`mt-2 py-1 px-3 rounded ${
                              selectedTherapist?.$id === psychotherapist.$id
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-gray-300 text-blue-500 hover:bg-gray-400'
                            }`}
                            onClick={() => setSelectedTherapist(psychotherapist)}
                          >
                            {selectedTherapist?.$id === psychotherapist.$id ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
                <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4">
                  {/* Render Calendar component */}
                  <Calendar
                    currentMonth={currentMonth}
                    nextMonth={nextMonth}
                    currentYear={currentYear}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                  />
                </div>

              {/* Confirmation Prompt */}
              {showPrompt && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center relative border border-gray-300">
                    <h3 className="text-2xl font-bold text-blue-900 mb-4">
                      Are you sure you want to proceed?
                    </h3>
                    <div className="mt-6 flex justify-around">
                      <button
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400"
                        onClick={cancelBooking}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
                        onClick={confirmBooking}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message and Confetti */}
              {appointmentBooked && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                  <Confetti width={width} height={height} /> {/* Render Confetti */}
                  <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center relative border border-gray-300">
                       {/* Add the small 'X' button to close the success message */}
                  <button
                      className="absolute top-2 right-2 bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-black hover:bg-gray-400"
                      onClick={() => setAppointmentBooked(false)} // Close the pop-up
                       >
                       &times; {/* 'X' symbol */}
                  </button>
                  <h3 className="text-2xl font-bold text-green-600">
                        Your Appointment was Booked Successfully!
                      </h3>
                      <p className="mt-2">
                        Service: Counseling and Therapy<br />
                        Date & Time: {selectedMonth} {selectedDay}, 2024 | {selectedTime}<br />
                        Psychotherapist: {selectedTherapist ? selectedTherapist.name : "No therapist selected"}
                      </p>
                      <p className="text-lg text-gray-700">You can proceed to payment to complete the booking.</p>
                      <button
                         className="mt-6 bg-blue-400 text-white py-2 px-6 rounded-full hover:bg-blue-500"
                          onClick={handleProceedToPayment}
                          >
                          Proceed to Payment
                          </button>
                   </div>
                </div>
               )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentBooking;
