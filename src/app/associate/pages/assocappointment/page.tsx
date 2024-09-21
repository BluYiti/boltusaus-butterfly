'use client';

import React, { useState } from 'react';

const AppointmentDashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('April 8');
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isRescheduleViewOpen, setIsRescheduleViewOpen] = useState(false);
  const [isRescheduleConfirmed, setIsRescheduleConfirmed] = useState(false);
  const [isAppointmentConfirmed, setIsAppointmentConfirmed] = useState(false); // New state for appointment confirmation
  const [selectedRescheduleTime, setSelectedRescheduleTime] = useState(''); // State to store the selected reschedule time

  const handleDecline = () => {
    setIsDeclineModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeclineModalOpen(false);  // Close decline modal
    setIsRescheduleViewOpen(false);  // Close reschedule view if open
    setIsRescheduleConfirmed(false); // Close reschedule confirmation modal
    setIsAppointmentConfirmed(false); // Close appointment confirmation modal
  };

  const handleConfirmReschedule = () => {
    setIsDeclineModalOpen(false);
    setIsRescheduleViewOpen(true);
  };

  const handleReschedule = () => {
    if (selectedRescheduleTime) {
      setIsRescheduleViewOpen(false);
      setIsRescheduleConfirmed(true); // Show confirmation modal
    } else {
      alert("Please select a reschedule time.");
    }
  };

  const handleCloseConfirmation = () => {
    setIsRescheduleConfirmed(false); // Hide confirmation modal
    setIsAppointmentConfirmed(false); // Hide appointment confirmation modal
  };

  const handleConfirmAppointment = () => {
    setIsAppointmentConfirmed(true); // Show appointment confirmation modal
  };

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
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="bg-gray-100 text-gray-400 p-4 rounded-lg">
                {i + 29}
              </div>
            ))}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">
                {i + 1}
              </div>
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">
                {i + 3}
              </div>
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">
                {i + 10}
              </div>
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">
                {i + 17}
              </div>
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">
                {i + 24}
              </div>
            ))}
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">
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
            <button
              onClick={handleDecline}
              className="bg-red-500 text-white py-2 px-6 rounded-lg"
            >
              DECLINE
            </button>
            <button
              onClick={handleConfirmAppointment} // Trigger appointment confirmation modal
              className="bg-green-500 text-white py-2 px-6 rounded-lg"
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>

      {/* Decline Modal */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              APPOINTMENT DECLINED.
            </h2>
            <p className="text-center mb-6">
              Do you want to reschedule the appointment?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule View */}
      {isRescheduleViewOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Reschedule Appointment
            </h2>
            <div className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <label htmlFor="reschedule-date" className="font-semibold">
                  Select Date:
                </label>
                <input
                  id="reschedule-date"
                  type="date"
                  className="border p-2 rounded-lg w-full"
                />
              </div>
              {/* Time Selection */}
              <div className="flex space-x-2 mb-4">
                <label htmlFor="reschedule-time" className="font-semibold">
                  Select Time:
                </label>
                <input
                  id="reschedule-time"
                  type="time"
                  className="border p-2 rounded-lg w-full"
                  value={selectedRescheduleTime}
                  onChange={(e) => setSelectedRescheduleTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Confirmation Modal */}
      {isRescheduleConfirmed && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Appointment Rescheduled
            </h2>
            <p className="text-center mb-6">
              Your appointment has been successfully rescheduled.
            </p>
            <button
              onClick={handleCloseConfirmation}
              className="bg-green-500 text-white py-2 px-4 rounded-lg mx-auto block"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Appointment Confirmation Modal */}
      {isAppointmentConfirmed && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Appointment Confirmed
            </h2>
            <p className="text-center mb-6">
              Your appointment has been successfully confirmed.
            </p>
            <button
              onClick={handleCloseConfirmation}
              className="bg-green-500 text-white py-2 px-4 rounded-lg mx-auto block"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;
