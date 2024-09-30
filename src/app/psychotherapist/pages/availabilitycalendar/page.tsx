'use client'

import React, { useState } from 'react';

const AvailabilityCalendar = () => {
  // State for the selected date
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when a new date is selected
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <button className="mr-4">
            <img src="/back-arrow-icon.png" alt="Back" className="h-6" />
          </button>
          <h1 className="text-2xl font-bold">Availability Calendar</h1>
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="#" className="hover:text-black">Dashboard</a>
          <a href="#" className="hover:text-black">Client List</a>
          <a href="#" className="hover:text-black">Reports</a>
          <a href="#" className="hover:text-black">Recordings</a>
          <a href="#" className="hover:text-black">Resources</a>
          <a href="#" className="hover:text-black">About</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Section - Calendar */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">September</h2>
            <div className="space-x-2">
              <button>&lt;</button>
              <button>&gt;</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>

            {/* Calendar dates */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className={`p-2 rounded-full ${selectedDate === i + 1 ? 'bg-blue-200 text-black font-bold' : 'hover:bg-gray-200'} cursor-pointer`} 
                onClick={() => handleDateSelect(i + 1)}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Time Selection */}
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h3 className="text-xl font-semibold">Tuesday, {selectedDate ? `September ${selectedDate}` : "Select a Date"}</h3>
          <div className="mt-4">
            <h4 className="font-semibold">Available Time</h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {["9-10 AM", "10-11 AM", "1-2 PM", "2-3 PM", "3-4 PM"].map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`py-2 px-4 rounded-lg border border-gray-300 ${selectedTime === time ? 'bg-blue-300 text-white' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
            <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
