"use client"; // Add this at the top of the file

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import Confetti from "react-confetti"; // Import the Confetti component
import items from "@/client/data/Links";
>>>>>>> origin/jc

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const therapists = [
  {
    name: "Ms. Angelica Peralta",
    specialty: "Senior Psychotherapist",
    imgSrc: "https://via.placeholder.com/60",
    bio: "A licensed professional who provides talk therapy to individuals or groups to help them manage mental health conditions, emotional issues, and psychological distress."
  },
];

<<<<<<< HEAD
=======
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

<<<<<<< HEAD
const availableSlots = [
  [
    {
        "date": "2024-10-18",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-19",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-21",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-22",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-23",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-24",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-25",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-26",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-28",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    },
    {
        "date": "2024-10-29",
        "timeSlots": [
            { "time": "9:00 am", "available": true },
            { "time": "10:00 am", "available": false },
            { "time": "11:00 am", "available": true },
            { "time": "1:00 pm", "available": true },
            { "time": "2:00 pm", "available": false },
            { "time": "3:00 pm", "available": true },
            { "time": "4:00 pm", "available": false }
        ]
    }
  ]
];

=======
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Confetti from "react-confetti"; // Import Confetti for the success effect
import { databases } from "@/appwrite";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import Calendar from "@/components/Calendar/Calendar"; // Import the Calendar component
import { fetchProfileImageUrl } from "@/hooks/userService";
import ChoosePaymentModal from "./choosepayment";
>>>>>>> master

>>>>>>> origin/jc
const AppointmentBooking = () => {
<<<<<<< HEAD
=======
const AcceptedClientBooking = () => {
>>>>>>> origin/kumarrr
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

  const isFormComplete = selectedDay !== null && selectedTime && therapyMode;

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
=======
  const { loading: authLoading } = useAuthCheck(['client']);
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState({
    selectedMonth: "October",
    selectedDay: null,
    selectedTime: null,
    selectedTherapist: null,
    appointmentBooked: false,
  });
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [showPrompt, setShowPrompt] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handlePaymentSelection = (selectedMethod: string) => {
    setPaymentMethod(selectedMethod);
    console.log(`Selected payment method: ${selectedMethod}`);
  };
>>>>>>> master

<<<<<<< HEAD
=======
  const today = new Date();
  const currentYear = today.getFullYear();

  const handleBookAppointment = () => {
    const { selectedTherapist, selectedDay, selectedTime } = appointmentData;
    if (selectedTherapist && selectedDay && selectedTime) {
      setShowPrompt(true);
    }
  };

  const confirmBooking = () => {
    setAppointmentData((prev) => ({ ...prev, appointmentBooked: true }));
    setShowPrompt(false);
  };

  const cancelBooking = () => {
    setShowPrompt(false);
  };

  const handleProceedToPayment = () => {
    setAppointmentData((prev) => ({ ...prev, appointmentBooked: false }));
    setIsModalOpen(true);
    console.log("Proceeding to payment...");
  };

<<<<<<< HEAD
  // Handle window resizing
>>>>>>> origin/jc
=======
>>>>>>> master
  useEffect(() => {
    const fetchData = async () => {
      try {
        const therapistResponse = await databases.listDocuments('Butterfly-Database', 'Psychotherapist');
        const therapists = therapistResponse.documents;
        setPsychotherapists(therapists);

        // Fetch profile images for each psychotherapist
        const profileImages = {};
        for (const therapist of therapists) {
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
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
=======
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
    setSelectedDay(null); // Reset selected day when changing month
  };
=======
  const isFormComplete = appointmentData.selectedDay !== null && appointmentData.selectedTime && appointmentData.selectedTherapist;
>>>>>>> master

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

>>>>>>> origin/jc
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between bg-gray-100 w-3/4">
          <div className="bg-blue-100 shadow-lg py-4 px-6 flex justify-between items-center">
<<<<<<< HEAD
            <div className="text-black w-full flex flex-col bg-gray-100 w-100">
              <div className="flex flex-col p-6 space-y-6">

<<<<<<< HEAD
                {/* Choose Psychotherapist */}
                <h3 className="text-3xl font-bold text-blue-900">Your Psychotherapist</h3>
                <div className="flex space-x-6 mt-4">
                  {therapists.map((therapist) => (
                    <div
                      key={therapist.name}
                      className="w-1/2 bg-white p-4 rounded shadow-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={therapist.imgSrc}
                          alt={therapist.name}
                          className="rounded-full w-16 h-16"
                        />
                        <div>
                          <h3 className="text-lg font-bold">{therapist.name}</h3>
                          <p className="text-sm text-gray-500">
                            Specialty: {therapist.specialty}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
=======
            <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4">
              <div className="mb-4">
                <label className="block mb-2 text-lg font-medium text-gray-700">
                  Select Month and Date {!selectedDay && <span className="text-red-500">*</span>}
                </label>
                {/* Month Selection (display current and next month only) */}
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mb-4 p-2 rounded border border-gray-300"
                >
                  <option value={currentMonth}>{currentMonth}</option>
                  <option value={nextMonth} disabled={currentDate < 22}>
                    {nextMonth}
                  </option>
                </select>
              </div>
=======
            <div className="text-black w-full flex flex-col bg-gray-100">
              <div className="flex flex-col p-6 space-y-6">
                <h3 className="text-3xl font-bold text-blue-900">
                  Choose Psychotherapist <span className="text-red-500">{!appointmentData.selectedTherapist && "*"}</span>
                </h3>

                <div className="flex space-x-6 mt-4">
                  {psychotherapists.map((therapist) => (
                    <div key={therapist.$id} className="flex items-center space-x-4">
                      <img
                        src={profileImageUrls[therapist.$id] || "/images/default-profile.png"}  // fallback to a default image
                        alt={`${therapist.firstName} ${therapist.lastName}`}
                        className="rounded-full w-16 h-16"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{therapist.firstName} {therapist.lastName}</h3>
                        <p className="text-sm text-gray-500">Specialty: {therapist.specialties}</p>
                        <button
                          className={`mt-2 py-1 px-3 rounded ${appointmentData.selectedTherapist?.$id === therapist.$id ? 'bg-[#2563EB] text-white' : 'bg-gray-300 text-blue-500 hover:bg-gray-400'}`}
                          onClick={() => setAppointmentData((prev) => ({ ...prev, selectedTherapist: therapist }))}
                        >
                          {appointmentData.selectedTherapist?.$id === therapist.$id ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
>>>>>>> master

                <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
                <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4">
                  <Calendar
                      currentMonth="October"
                      nextMonth="November"
                      currentDate={today.getDate()}
                      currentYear={currentYear}
                      selectedDay={appointmentData.selectedDay}
                      setSelectedDay={(day) => setAppointmentData((prev) => ({ ...prev, selectedDay: day }))}
                      selectedMonth={appointmentData.selectedMonth}
                      setSelectedMonth={(month) => setAppointmentData((prev) => ({ ...prev, selectedMonth: month, selectedDay: null }))}
                      selectedTime={appointmentData.selectedTime}
                      setSelectedTime={(time) => setAppointmentData((prev) => ({ ...prev, selectedTime: time }))}
                      isTherapistSelected={!!appointmentData.selectedTherapist} // Pass the selection state
                      handleBookAppointment={handleBookAppointment}
                  />
                </div>
              </div>
            </div>
          </div>
<<<<<<< HEAD

          {/* Booking Prompt */}
          {showPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
                <p>
                  You're booking a session with <strong>{selectedTherapist.name}</strong> on{" "}
                  <strong>{selectedMonth} {selectedDay}, {currentYear}</strong> at <strong>{selectedTime}</strong>.
                </p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button className="bg-green-500 text-white py-2 px-4 rounded-lg" onClick={confirmBooking}>
                    Confirm
                  </button>
                  <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={cancelBooking}>
                    Cancel
                  </button>
>>>>>>> origin/jc
                </div>

<<<<<<< HEAD
                {/* Display Selected Therapist */}
                {selectedTherapist && (
                  <div className="mt-8 bg-white p-6 rounded shadow-lg border border-gray-200 max-w-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <img
                          src={selectedTherapist.imgSrc}
                          alt={selectedTherapist.name}
                          className="rounded-full w-20 h-20"
                        />
                        <div>
                          <h3 className="text-xl font-bold">{selectedTherapist.name}</h3>
                          <p className="text-md text-gray-500">{selectedTherapist.specialty}</p>
                        </div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setSelectedTherapist(null)}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                )}

    {/* Select Month and Date */}
    <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
                <div className="bg-white p-6 rounded shadow-lg border border-gray-200 w-full">
                  <div className="mb-4">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                      Select Month and Date {!selectedDay && <span className="text-red-500">*</span>}
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      className="border w-32 border-gray-300 rounded-lg p-2"
                    >
                      {months.map((month) => (
                        <option key={month.name} value={month.name}>
                          {month.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Display Weekday Headers Above the Dates */}
                  <div className="grid grid-cols-7 gap-4 text-center font-bold text-gray-600">
                    {weekdays.map((day) => (
                      <div key={day}>{day.slice(0, 3)}</div>
                    ))}
                  </div>

                  {/* Calendar with Dates */}
                  <div className="grid grid-cols-7 gap-4 mb-4 p-4 rounded shadow-md bg-gray-100">
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                      <div key={index}></div>
                    ))}
                    {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((day) => {
                      const date = new Date(2024, months.findIndex((month) => month.name === selectedMonth), day);
                      const isPastDate = date < currentDate;
                      const isSunday = date.getDay() === 0; // Sunday
                      const isTooFarAhead = date > twoWeeksLater;

                      return (
                        <button
                          key={day}
                          className={`py-2 px-4 rounded-lg ${isPastDate || isSunday || isTooFarAhead ? "bg-gray-200 text-gray-400 cursor-not-allowed" : selectedDay === day.toString() ? "bg-blue-500 text-white" : "bg-gray-300 text-black hover:bg-blue-500"}`}
                          onClick={() => {
                            if (!isPastDate && !isSunday && !isTooFarAhead) {
                              setSelectedDay(day.toString());
                            }
                          }}
                          disabled={isPastDate || isSunday || isTooFarAhead}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

{/* Time Selection */}
<h3 className="text-lg font-bold text-blue-900">Select Time {!selectedTime && <span className="text-red-500">*</span>}</h3>
<div className="grid grid-cols-4 gap-4 mt-4 mb-4"> {/* Add mb-4 here for spacing */}
  {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map((time) => (
    <button
      key={time}
      className={`py-2 px-4 rounded-lg ${
        selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-300 text-black hover:bg-blue-500"
      }`}
      onClick={() => setSelectedTime(time)}
    >
      {time}
    </button>
  ))}
</div>

{/* Therapy Mode Selection */}
<div className="mb-4">
  <label className="block mb-2 text-lg font-medium text-gray-700">
    Select Therapy Mode {!therapyMode && <span className="text-red-500">*</span>}
  </label>
  <select
    value={therapyMode}
    onChange={(e) => setTherapyMode(e.target.value)}
    className="border w-32 border-gray-300 rounded-lg p-2"
  >
    <option value="Online">Online</option>
    <option value="In-Person">In-Person</option>
  </select>
</div>

                  {/* Selected Info */}
                  <div className="mt-6">
                    <p className="text-gray-500">
                      Selected: {selectedMonth} {selectedDay}, {currentYear} | {selectedTime} | Mode: {therapyMode}
                    </p>
                    <button
                      className={`mt-4 py-2 px-4 rounded-lg ${isFormComplete ? "bg-blue-400 text-white hover:bg-blue-500" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                      onClick={handleBookAppointment}
                      disabled={!isFormComplete}
                    >
                      Book
                    </button>
                  </div>
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
                        Mode: {therapyMode}<br />
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
=======
          {/* Success Confetti */}
          {appointmentBooked && (
            <div>
              <Confetti width={width} height={height} numberOfPieces={500} />
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-3xl font-bold text-green-600">Booking Confirmed!</h2>
                  <p className="mt-2">
                    You have successfully booked a session with <strong>{selectedTherapist.name}</strong> on{" "}
                    <strong>{selectedMonth} {selectedDay}, {currentYear}</strong> at <strong>{selectedTime}</strong>.
                  </p>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={handleProceedToPayment}>
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
>>>>>>> origin/jc
=======
>>>>>>> master
        </div>
      </div>

      {/* Confirmation Prompt */}
      {showPrompt && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center relative border border-gray-300">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Are you sure you want to proceed?</h3>
            <div className="mt-6 flex justify-around">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400"
                onClick={cancelBooking}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
                onClick={confirmBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message and Confetti */}
      {appointmentData.appointmentBooked && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <Confetti width={windowDimensions.width} height={windowDimensions.height} />
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center relative border border-gray-300">
            <button
              className="absolute top-2 right-2 bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-black hover:bg-gray-400"
              onClick={() => setAppointmentData((prev) => ({ ...prev, appointmentBooked: false }))}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-green-600">You Are Almost Done With Booking your Appointment!</h3>
            <p className="mt-2">
              Service: Counseling and Therapy<br />
              Date & Time: {appointmentData.selectedMonth} {appointmentData.selectedDay}, {currentYear} | {appointmentData.selectedTime}<br />
              Psychotherapist: {appointmentData.selectedTherapist ? `${appointmentData.selectedTherapist.firstName} ${appointmentData.selectedTherapist.lastName}` : "No therapist selected"}
            </p>
            <p className="text-lg text-gray-700">You can proceed to payment to complete the booking.</p>
            <button
              className="mt-4 bg-green-400 text-white py-2 px-4 rounded-lg hover:bg-green-950"
              onClick={handleProceedToPayment}
              disabled={!isFormComplete}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}


      {/* Modal */}
      <ChoosePaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export default AppointmentBooking;
=======
export default AcceptedClientBooking;
>>>>>>> origin/jc
=======
export default AppointmentBooking;
>>>>>>> master
