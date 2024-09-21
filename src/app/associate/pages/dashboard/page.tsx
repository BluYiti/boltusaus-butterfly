// page.tsx

'use client';

import React, { useState } from 'react';

const AppointmentDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('April 8');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="/path/to/profile-pic.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <h1 className="text-xl">Dashboard</h1>
        </div>
        <div className="flex space-x-6">
          <button className="hover:underline">Dashboard</button>
          <button className="hover:underline">Appointments</button>
          <button className="hover:underline">Client List</button>
        </div>
        <button className="sm:hidden">
          {/* Mobile menu icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-grow p-4 flex space-x-4">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                Day
              </button>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                Week
              </button>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                Month
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button>&lt;</button>
              <h2 className="font-bold text-lg">APRIL</h2>
              <button>&gt;</button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-gray-500">
                {day}
              </div>
            ))}
            {/* Dates */}
            {/* Row 1 */}
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-gray-100 text-gray-300 p-4 rounded-lg">
                {i + 29}
              </div>
            ))}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-green-500">
                {i + 1}
              </div>
            ))}

            {/* Row 2 */}
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  i === 2
                    ? 'bg-gray-300 text-white'
                    : i % 2 === 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {i + 5}
              </div>
            ))}

            {/* Row 3 */}
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  i % 2 === 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {i + 12}
              </div>
            ))}

            {/* Row 4 */}
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  i % 2 === 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {i + 19}
              </div>
            ))}

            {/* Row 5 */}
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  i % 2 === 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {i + 26}
              </div>
            ))}

            {/* Row 6 */}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-green-500">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-lg flex-1 max-w-sm p-6">
          <h2 className="text-lg font-semibold mb-4">This {selectedDate}</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/path/to/profile-pic.png"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-bold">Denzel White</h3>
              <p className="text-sm text-gray-600">9:00 AM</p>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Type:</span> Online
            </p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              <span className="text-green-500">Paid</span>
            </p>
            <p>
              <span className="font-semibold">Mode:</span> GCash
            </p>
            <p>
              <span className="font-semibold">Date Paid:</span> Apr 1, 2024
            </p>
            <p>
              <span className="font-semibold">Discount:</span> 5%
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button className="bg-red-500 text-white py-2 px-6 rounded-lg">
              DECLINE
            </button>
            <button className="bg-green-500 text-white py-2 px-6 rounded-lg">
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
