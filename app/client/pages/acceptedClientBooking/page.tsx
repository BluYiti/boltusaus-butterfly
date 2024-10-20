'use client'

import React, { useEffect, useState } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import Link from "next/link"; // Import Link for navigation
import { account } from "@/appwrite"; // Ensure Appwrite is configured correctly

const months = [
  { name: "January", days: 31 },
  { name: "February", days: 29 }, // Leap year, so February has 29 days in 2024
  { name: "March", days: 31 },
  { name: "April", days: 30 },
  { name: "May", days: 31 },
  { name: "June", days: 30 },
  { name: "July", days: 31 },
  { name: "August", days: 31 },
  { name: "September", days: 30 },
  { name: "October", days: 31 },
  { name: "November", days: 30 },
  { name: "December", days: 31 },
];

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

const AcceptedClientBooking = () => {
  const [selectedMonth, setSelectedMonth] = useState(9); // October as default
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist] = useState(therapists[0]); // Default therapist
  const [appointmentBooked, setAppointmentBooked] = useState(false); // Success message state
  const [showPrompt, setShowPrompt] = useState(false); // Confirmation prompt state
  const [status, setStatus] = useState(null); // State to track client status
  const [role, setRole] = useState(null); // State to track client role

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const user = await account.get();
        console.log("User Preferences: ", user.prefs); // Debugging step

        // Set the status and role from user preferences
        if (user.prefs?.status) {
          setStatus(user.prefs.status);
        }
        if (user.prefs?.role) {
          setRole(user.prefs.role);
        }
      } catch (error) {
        console.error("Error fetching user preferences: ", error);
      }
    };

    fetchUserStatus();
  }, []);

  // Handle month selection
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(event.target.value));
    setSelectedDay(null); // Reset selected day when changing month
  };

  const handleBookAppointment = () => {
    if (selectedDay && selectedTime) {
      setShowPrompt(true); // Show confirmation prompt
    }
  };

  const confirmBooking = () => {
    setAppointmentBooked(true); // Show success message
    setShowPrompt(false); // Close the prompt
  };

  const cancelBooking = () => {
    setShowPrompt(false); // Close the prompt without booking
  };

  const daysInSelectedMonth = months[selectedMonth]?.days || 31;

  // Calculate first day of the month
  const getFirstDayOfMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex, 1).getDay();
  };

  const firstDayOfMonth = getFirstDayOfMonth(selectedMonth, new Date().getFullYear());

  const handleProceedToPayment = () => {
    alert("Proceeding to payment..."); // Placeholder for payment logic
  };

  // Conditionally render the UI only if status is 'Accepted Client' and role is 'Client'
  if (status !== "Accepted Client" || role !== "Client") {
    return <div className="text-center p-4">You are not authorized to view this content.</div>;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gradient-to-b from-blue-100 to-blue-600">
        <div className="flex-grow flex flex-col justify-between bg-blue-100">
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black flex flex-col flex-grow p-6 space-y-6 mx-auto w-3/4">
              <div className="text-left mb-8">
                <div className="text-green-600 text-4xl mb-4 flex items-center">
                  <span className="text-green-600 animate-bounce">✔️</span>
                  <span className="ml-2 text-lg font-bold">Evaluation Completed!</span>
                </div>
                <div className="text-xl font-semibold">
                  <Link href="/client/pages/newappointment">
                    <button className="bg-blue-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                      Book your appointment
                    </button>
                  </Link>
                </div>
              </div>

              {/* Flex container to display both sections side by side */}
              <div className="flex justify-left space-x-6">
                {/* Meet our caring psychotherapists section */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-blue-500 text-left mb-6">
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
                        <h4 className="text-lg font-bold text-blue-500">{therapist.name}</h4>
                        <p className="text-sm text-gray-600">{therapist.specialty}</p>
                      </div>
                    ))}
                  </div>
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

export default AcceptedClientBooking;
