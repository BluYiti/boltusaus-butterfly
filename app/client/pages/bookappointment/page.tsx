"use client";
import React, { useState } from "react";
import Layout from "@/components/Sidebar/Layout";
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
  {
    name: "Psychotherapist 2",
    specialty: "Psychotherapy and Counseling",
    imgSrc: "https://via.placeholder.com/60",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
];

const AppointmentBooking = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedDay, setSelectedDay] = useState("6");
  const [selectedTime, setSelectedTime] = useState("9:30");
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const handleMonthChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSelectedMonth(event.target.value);
    setSelectedDay("1"); // Reset selected day when changing month
  };

  const handleTherapistSelect = (therapist: any) => {
    setSelectedTherapist(therapist);
  };

  const daysInSelectedMonth = months.find((month) => month.name === selectedMonth)?.days || 31;

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-between bg-gray-100">
          {/* Top Section with User Info and Header */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black min-h-screen flex flex-col bg-gray-100">
              {/* Main Appointment Content */}
              <div className="flex flex-col p-6 space-y-6">
                {/* Title Section */}
                <h2 className="text-3xl font-bold text-left text-blue-900">
                  Counseling and Therapy Sessions
                </h2>

                {/* Choose Date */}
                <div className="bg-white p-6 rounded shadow-lg border border-gray-200">
                  {/* Month Dropdown */}
                  <div className="mb-4">
                    <label className="block mb-2 text-lg font-medium text-gray-700">
                      Select Month and Date
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      className="border border-gray-300 rounded-lg p-2"
                    >
                      {months.map((month) => (
                        <option key={month.name} value={month.name}>
                          {month.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Days of the Selected Month */}
                  <div className="grid grid-cols-7 gap-4 mb-4">
                    {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        className={`py-2 px-4 rounded-lg ${
                          selectedDay === day.toString()
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-black"
                        }`}
                        onClick={() => setSelectedDay(day.toString())}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Time Selection */}
                  <div className="bg-white p-6 rounded shadow-lg border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Time</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {/* Time options */}
                      {["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00"].map((time) => (
                        <button
                          key={time}
                          className={`py-2 px-4 rounded-lg ${
                            selectedTime === time
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-black"
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <p className="text-gray-500">
                        Selected: {selectedMonth} {selectedDay}, 2024 | {selectedTime}
                      </p>
                      <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg">
                        Book
                      </button>
                    </div>
                  </div>

                  {/* Title for Psychotherapist Section */}
                  <h3 className="text-2xl font-bold text-blue-900 mt-8">
                    Choose Psychotherapist
                  </h3>

                  {/* List of Psychotherapists */}
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
                            <button
                              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                              onClick={() => handleTherapistSelect(therapist)}
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
{/* Display Selected Psychotherapist */}
{selectedTherapist && (
  <div className="mt-8 bg-white p-6 rounded shadow-lg border border-gray-200 max-w-lg">
    <div className="flex justify-between items-start">
      {/* Psychotherapist Information */}
      <div className="flex items-center space-x-4">
        {/* Link the image directly */}
        <img
          src="/path/to/therapist-image.jpg"  // Replace with actual image file path
          alt="Mrs. Angelica Peralta"  // Name of the therapist
          className="rounded-full w-20 h-20"
        />
        <div>
          <h3 className="text-xl font-bold">Mrs. Angelica Peralta</h3>  {/* Static Name */}
          <p className="text-md text-gray-500">Psychotherapist and Counselor</p>  {/* Static Specialty */}
        </div>
      </div>

      {/* Close Button */}
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => setSelectedTherapist(null)}
      >
        &times;
      </button>
    </div>

    {/* Biography Section */}
    <div className="mt-4">
      <h4 className="text-lg font-bold">Biography</h4>
      {/* You can directly type the bio here */}
      <p className="text-gray-600">
        Mrs. Angelica Peralta has over 15 years of experience in psychotherapy and counseling. She specializes in cognitive-behavioral therapy and mindfulness techniques to help her clients manage stress, anxiety, and depression.
      </p>
    </div>
  </div>
)}
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
