"use client"; // Add this at the top of the file

import React, { useState } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import items from "@/client/data/Links";

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
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
];

const AppointmentBooking = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist] = useState(therapists[0]); // Default selection for the therapist
  const [appointmentBooked, setAppointmentBooked] = useState(false); // State for success message
  const [showPrompt, setShowPrompt] = useState(false); // State to control the confirmation prompt

  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDay("1"); // Reset selected day when changing month
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

  const isFormComplete = selectedDay && selectedTime;

  const handleProceedToPayment = () => {
    alert("Proceeding to payment..."); // Placeholder for payment logic
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between bg-gray-100">
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black flex flex-col flex-grow p-6 space-y-6 mx-auto w-3/4"> {/* Set width to 75% */}
              
              {/* Display Psychotherapist */}
              <h3 className="text-3xl font-bold text-blue-900">
                Your Psychotherapist
              </h3>
              <div className="flex space-x-6 mt-4">
                <div className={`w-full bg-white p-4 rounded shadow-lg border border-gray-200`}>
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedTherapist.imgSrc}
                      alt={selectedTherapist.name}
                      className="rounded-full w-16 h-16"
                    />
                    <div>
                      <h3 className="text-lg font-bold">{selectedTherapist.name}</h3>
                      <p className="text-sm text-gray-500">
                        Specialty: {selectedTherapist.specialty}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Select Month and Date */}
              <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">
                Counseling and Therapy Sessions
              </h2>

              <div className="bg-white p-6 rounded shadow-lg border border-gray-200 w-full">
                <div className="mb-4">
                  <label className="block mb-2 text-lg font-medium text-gray-700">
                    Select Month and Date {!selectedDay && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="border w-32 border-gray-300 rounded-lg p-2" // Reduced width
                  >
                    {months.map((month) => (
                      <option key={month.name} value={month.name}>
                        {month.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4 p-4 rounded shadow-md bg-gray-100">
                  {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      className={`py-2 px-4 rounded-lg ${selectedDay === day.toString() ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
                      onClick={() => setSelectedDay(day.toString())}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Time Selection */}
                <h3 className="text-lg font-bold mb-4">
                  Time {!selectedTime && <span className="text-red-500">*</span>}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"].map((time) => (
                    <button
                      key={time}
                      className={`py-2 px-4 rounded-lg ${selectedTime === time ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Selected Info */}
                <div className="mt-6">
                  <p className="text-gray-500">
                    Selected: {selectedMonth} {selectedDay}, {currentYear} | {selectedTime}
                  </p>
                  <button
                    className={`mt-4 py-2 px-4 rounded-lg ${isFormComplete ? "bg-blue-500 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
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
                        className="bg-gradient-to-r from-red-400 to-red-600 text-white py-2 px-5 rounded-full shadow-md hover:shadow-lg transition duration-200 w-28 hover:bg-gradient-to-l"
                        onClick={cancelBooking}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white py-2 px-5 rounded-full shadow-md hover:shadow-lg transition duration-200 w-28 hover:bg-gradient-to-l"
                        onClick={confirmBooking}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {appointmentBooked && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center relative border border-gray-300">
                    <h3 className="text-2xl font-bold text-green-600">
                      Your Appointment was Booked Successfully!
                    </h3>
                    <p className="mt-4">We have sent your booking information to your SMS.</p>
                    <p className="mt-2">
                      Service: Counseling and Therapy<br />
                      Date & Time: {selectedMonth} {selectedDay}, {currentYear} | {selectedTime}<br />
                      Name: {selectedTherapist.name}
                    </p>
                    <button
                      className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-600"
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
    </Layout>
  );
};

export default AppointmentBooking;
