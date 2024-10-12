"use client"; // Add this at the top of the file

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";
import Confetti from "react-confetti"; // Import the Confetti component

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
    name: "Mrs. Angelica Peralta",
    specialty: "Psychotherapy and Counseling",
    imgSrc: "https://via.placeholder.com/60",
  },
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AppointmentBooking = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist] = useState(therapists[0]); // Default selection for the therapist
  const [appointmentBooked, setAppointmentBooked] = useState(false); // State for success message
  const [showPrompt, setShowPrompt] = useState(false); // State to control the confirmation prompt
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  // Handle window resizing
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

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
    setSelectedDay(null); // Reset selected day when changing month
  };

  const handleBookAppointment = () => {
    if (selectedDay && selectedTime) {
      setShowPrompt(true); // Show confirmation prompt when booking is attempted
    }
  };

  const confirmBooking = () => {
    setAppointmentBooked(true); // Show success message when confirmed
    setShowPrompt(false); // Close the prompt
  };

  const cancelBooking = () => {
    setShowPrompt(false); // Close the prompt without booking
  };

  const daysInSelectedMonth = months.find((month) => month.name === selectedMonth)?.days || 31;

  // Get the weekday of the 1st day of the selected month
  const firstDayOfMonth = new Date(`${selectedMonth} 1, ${currentYear}`).getDay();

  const isFormComplete = selectedDay !== null && selectedTime;

  const handleProceedToPayment = () => {
    alert("Proceeding to payment..."); // Placeholder for payment logic
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-100 text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h3 className="text-3xl font-bold text-blue-900">Your Psychotherapist</h3>
            <div className="flex space-x-6 mt-4 items-center">
              <img
                src={selectedTherapist.imgSrc}
                alt={selectedTherapist.name}
                className="rounded-full w-16 h-16 border-2 border-blue-300"
              />
              <div>
                <h3 className="text-lg font-bold">{selectedTherapist.name}</h3>
                <p className="text-sm text-gray-500">Specialty: {selectedTherapist.specialty}</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4">
              <div className="mb-4">
                <label className="block mb-2 text-lg font-medium text-gray-700">
                  Select Month and Date {!selectedDay && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="border w-1/2 border-gray-300 rounded-lg p-2"
                >
                  {months.map((month) => (
                    <option key={month.name} value={month.name}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Weekday Headers Above the Dates */}
              <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600 mb-2">
                {weekdays.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Calendar with Dates */}
              <div className="grid grid-cols-7 gap-2 mb-4 p-4 rounded shadow-md bg-gray-200">
                {/* Empty divs to shift the 1st day to the correct weekday */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={index}></div>
                ))}
                {/* Display days of the selected month */}
                {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((day) => (
                  <button
                    key={day}
                    className={`py-2 px-1 rounded-lg ${selectedDay === day ? "bg-blue-500 text-white" : "bg-gray-300 text-black hover:bg-blue-300"}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time Selection */}
              <h3 className="text-lg font-bold mb-4">
                Time {!selectedTime && <span className="text-red-500">*</span>}
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"].map((time) => (
                  <button
                    key={time}
                    className={`py-2 rounded-lg ${selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-300 text-black hover:bg-blue-300"}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* Selected Info */}
              <div className="mt-4">
                <p className="text-gray-500">
                  Selected: {selectedMonth} {selectedDay}, {currentYear} | {selectedTime}
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
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400"
                    onClick={cancelBooking}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500"
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
            <>
              <Confetti width={width} height={height} />
              <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
                <div className="bg-blue-100 p-8 rounded-lg shadow-lg text-center">
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">Appointment Booked!</h3>
                  <p className="text-lg text-gray-600">You have successfully booked an appointment.</p>
                  <button
                    className="mt-4 py-2 px-4 rounded bg-blue-400 text-white hover:bg-blue-500"
                    onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentBooking;
