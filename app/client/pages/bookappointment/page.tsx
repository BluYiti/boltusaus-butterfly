'use client'

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout"; // Adjust the path if necessary
import Confetti from "react-confetti"; // Import the Confetti component
import items from "@/client/data/Links";

const therapists = [
  {
    name: "Mrs. Angelica Peralta",
    specialty: "Psychotherapy and Counseling",
    imgSrc: "https://via.placeholder.com/60",
  },
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AcceptedClientBooking = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTherapist] = useState(therapists[0]); // Default selection for the therapist
  const [appointmentBooked, setAppointmentBooked] = useState(false); // State for success message
  const [showPrompt, setShowPrompt] = useState(false); // State to control the confirmation prompt
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth(); // Get the index of the current month
  const currentMonth = today.toLocaleString("default", { month: "long" });
  const currentDate = today.getDate();

  // Get the next month and its name
  const nextMonthIndex = (currentMonthIndex + 1) % 12;
  const nextMonth = new Date(currentYear, nextMonthIndex).toLocaleString("default", { month: "long" });

  // Create an array with only the current and next months
  const monthsToDisplay = [
    { name: currentMonth, days: new Date(currentYear, currentMonthIndex + 1, 0).getDate() },
    { name: nextMonth, days: new Date(currentYear, nextMonthIndex + 1, 0).getDate() },
  ];

  const firstDayOfCurrentMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
  const firstDayOfNextMonth = new Date(currentYear, nextMonthIndex, 1).getDay();

  // Determine the first day of the selected month
  const firstDayOfMonth = selectedMonth === currentMonth
    ? new Date(currentYear, currentMonthIndex, 1).getDay()
    : new Date(currentYear, nextMonthIndex, 1).getDay();

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
                {Array.from({ length: selectedMonth === currentMonth ? monthsToDisplay[0].days : monthsToDisplay[1].days }, (_, i) => {
                  const day = i + 1;
                  const date = new Date(currentYear, selectedMonth === currentMonth ? currentMonthIndex : nextMonthIndex, day);
                  const isSunday = date.getDay() === 0; // Check if the date is Sunday
                  const isPastDate = day < currentDate || day > currentDate + 10 || isSunday; // Disable Sundays and past dates

                  return (
                    <button
                      key={day}
                      className={`py-2 px-1 rounded-lg ${
                        selectedDay === day
                          ? "bg-blue-300 rounded-3xl text-white"
                          : isPastDate
                          ? "bg-gray-400 text-gray-700 rounded-3xl cursor-not-allowed"
                          : "rounded-3xl bg-[#49c987] text-white font-poppins hover:bg-green-300 hover:text-black hover:scale-110"
                      }`}
                      onClick={() => !isPastDate && setSelectedDay(day)} // Prevent click if it's a past date or Sunday
                      disabled={isPastDate} // Disable the button if it's a past date or Sunday
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Time Selection */}
              <h3 className="text-lg font-bold mb-4">
                Time {!selectedTime && <span className="text-red-500">*</span>}
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"].map((time) => (
                  <button
                    key={time}
                    className={`py-2 rounded-lg ${selectedTime === time ? "bg-blue-300 text-white" : "bg-gray-300 text-black hover:bg-blue-500"}`}
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
                  className={`mt-4 py-2 px-4 rounded-lg text-white ${
                    isFormComplete ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={handleBookAppointment}
                  disabled={!isFormComplete}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>

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
                </div>
              </div>
            </div>
          )}

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
        </div>
      </div>
    </Layout>
  );
};

export default AcceptedClientBooking;
