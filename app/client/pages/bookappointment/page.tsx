"use client"; // Add this at the top of the file

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Confetti from "react-confetti"; // Import Confetti for the success effect

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

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const therapists = [
  {
    name: "Ms. Angelica Peralta",
    specialty: "Senior Psychotherapist",
    imgSrc: "https://via.placeholder.com/60",
    bio: "A licensed professional who provides talk therapy to individuals or groups to help them manage mental health conditions, emotional issues, and psychological distress."
  },
  {
    name: "Ms. Jennica Viloria",
    specialty: "Junior Psychotherapist",
    imgSrc: "https://via.placeholder.com/60",
    bio: "A compassionate junior psychotherapist dedicated to helping individuals through their therapeutic journey."
  },
  {
    name: "Ms. April Geronimo",
    specialty: "Junior Psychotherapist",
    imgSrc: "https://via.placeholder.com/60",
    bio: "An enthusiastic junior psychotherapist who aims to provide support and guidance for mental well-being."
  },
];

const AppointmentBooking = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [appointmentBooked, setAppointmentBooked] = useState(false); // State for success message
  const [showPrompt, setShowPrompt] = useState(false); // Confirmation prompt state
  const [therapyMode, setTherapyMode] = useState("Online"); // State for therapy mode selection

  const currentDate = new Date();
  const twoWeeksLater = new Date(currentDate);
  twoWeeksLater.setDate(currentDate.getDate() + 14);
  
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDay("1"); // Reset selected day when changing month
  };

  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
  };

  const handleBookAppointment = () => {
    if (selectedTherapist && selectedDay && selectedTime && therapyMode) {
      setShowPrompt(true); // Show confirmation prompt when booking
    }
  };

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

  const currentYear = new Date().getFullYear(); // Current year for date display
  const daysInSelectedMonth = months.find((month) => month.name === selectedMonth)?.days || 31;
  const firstDayOfMonth = new Date(2024, months.findIndex((month) => month.name === selectedMonth), 1).getDay(); // Get first day of the month

  const paddedDays = [
    ...Array(firstDayOfMonth).fill(null), // Add empty cells for padding
    ...Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1), // Add days in month
  ];

  const isFormComplete = selectedTherapist && selectedDay && selectedTime && therapyMode;

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between bg-gray-100 w-3/4">
          <div className="bg-blue-100 shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black w-full flex flex-col bg-gray-100 w-100">
              <div className="flex flex-col p-6 space-y-6">

                {/* Your Psychotherapist Section */}
                <h3 className="text-3xl font-bold text-blue-900">Your Psychotherapist</h3>
                <div className="flex space-x-6 mt-4 items-center">
                  <img
                    src={selectedTherapist?.imgSrc}
                    alt={selectedTherapist?.name}
                    className="rounded-full w-16 h-16 border-2 border-blue-300"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{selectedTherapist?.name}</h3>
                    <p className="text-sm text-gray-500">Specialty: {selectedTherapist?.specialty}</p>
                  </div>
                </div>

                {/* Select Month and Date */}
                <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
                <div className="bg-white p-6 rounded shadow-lg border border-gray-200 w-full
                                        className={`py-2 px-4 rounded-lg ${
                          selectedTime === time
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-black hover:bg-blue-500"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {/* Therapy Mode Selection */}
                  <h3 className="text-lg font-bold text-blue-900">Select Therapy Mode {!therapyMode && <span className="text-red-500">*</span>}</h3>
                  <div className="flex space-x-6 mt-4">
                    {["Online", "Face-to-Face"].map((mode) => (
                      <button
                        key={mode}
                        className={`py-2 px-4 rounded-lg ${
                          therapyMode === mode
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-black hover:bg-blue-500"
                        }`}
                        onClick={() => setTherapyMode(mode)}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Psychotherapist Selection */}
                <h2 className="text-2xl font-bold text-left text-blue-900 mt-8">Select Your Psychotherapist</h2>
                <div className="bg-white p-6 rounded shadow-lg border border-gray-200">
                  <div className="flex space-x-4 overflow-x-auto">
                    {therapists.map((therapist, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer border-2 p-4 rounded-lg shadow-md ${
                          selectedTherapist?.name === therapist.name
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleTherapistSelect(therapist)}
                      >
                        <img
                          src={therapist.imgSrc}
                          alt={therapist.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <h4 className="text-lg font-semibold mt-2">{therapist.name}</h4>
                        <p className="text-gray-500 text-sm">{therapist.specialty}</p>
                        <p className="text-sm mt-2">{therapist.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    className={`py-2 px-6 rounded-lg text-white ${
                      isFormComplete
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleBookAppointment}
                    disabled={!isFormComplete}
                  >
                    Book Appointment
                  </button>
                </div>

                {/* Confirmation Prompt */}
                {showPrompt && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                      <h3 className="text-xl font-bold text-gray-800">Confirm Your Appointment</h3>
                      <p>
                        You are about to book an appointment with{" "}
                        <strong>{selectedTherapist?.name}</strong> on{" "}
                        <strong>{selectedMonth} {selectedDay}</strong> at{" "}
                        <strong>{selectedTime}</strong> for a{" "}
                        <strong>{therapyMode}</strong> session.
                      </p>
                      <div className="flex justify-between space-x-4">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                          onClick={confirmBooking}
                        >
                          Confirm
                        </button>
                        <button
                          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
                          onClick={cancelBooking}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {appointmentBooked && (
                  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                      <h3 className="text-xl font-bold text-gray-800">Appointment Booked Successfully!</h3>
                      <p>
                        Your appointment with <strong>{selectedTherapist?.name}</strong> on{" "}
                        <strong>{selectedMonth} {selectedDay}</strong> at{" "}
                        <strong>{selectedTime}</strong> has been successfully booked.
                      </p>
                      <div className="flex justify-end">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                          onClick={handleProceedToPayment}
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    </div>
                    <Confetti width={width} height={height} />
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </Layout>
  );
};

export default AppointmentBooking;

