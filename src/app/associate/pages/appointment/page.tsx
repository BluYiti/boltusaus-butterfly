'use client';

import React, { useState } from 'react';
import { format, addMonths, subMonths, getMonth, getYear } from 'date-fns';

const AppointmentDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Start with today
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isRescheduleViewOpen, setIsRescheduleViewOpen] = useState(false);
  const [isRescheduleConfirmed, setIsRescheduleConfirmed] = useState(false);
  const [isAppointmentConfirmed, setIsAppointmentConfirmed] = useState(false);
  const [selectedRescheduleTime, setSelectedRescheduleTime] = useState('');

  const handleDecline = () => {
    setIsDeclineModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeclineModalOpen(false);
    setIsRescheduleViewOpen(false);
    setIsRescheduleConfirmed(false);
    setIsAppointmentConfirmed(false);
  };

  const handleConfirmReschedule = () => {
    setIsDeclineModalOpen(false);
    setIsRescheduleViewOpen(true);
  };

  const handleReschedule = () => {
    if (selectedRescheduleTime) {
      setIsRescheduleViewOpen(false);
      setIsRescheduleConfirmed(true);
    } else {
      alert('Please select a reschedule time.');
    }
  };

  const handleCloseConfirmation = () => {
    setIsRescheduleConfirmed(false);
    setIsAppointmentConfirmed(false);
  };

  const handleConfirmAppointment = () => {
    setIsAppointmentConfirmed(true);
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  // Get formatted month and year
  const formattedMonthYear = format(selectedDate, 'MMMM yyyy');
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

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
      </header>

      {/* Main Content */}
      <div className="flex-grow p-4 flex space-x-4">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                className={`py-2 px-4 rounded-lg ${
                  selectedView === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedView('day')}
              >
                Day
              </button>
              <button
                className={`py-2 px-4 rounded-lg ${
                  selectedView === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedView('week')}
              >
                Week
              </button>
              <button
                className={`py-2 px-4 rounded-lg ${
                  selectedView === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedView('month')}
              >
                Month
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={goToPreviousMonth}>&lt;</button>
              <h2 className="font-bold text-lg">{formattedMonthYear}</h2>
              <button onClick={goToNextMonth}>&gt;</button>
            </div>
          </div>

          {/* Calendar Grid based on selected view */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-gray-500">
                {day}
              </div>
            ))}
            {/* Render Calendar based on the view */}
            {selectedView === 'day' && (
              <div className="p-4 rounded-lg text-black">Detailed view for selected day</div>
            )}
            {selectedView === 'week' &&
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg text-black">
                  Day {i + 1} of the week
                </div>
              ))}
            {selectedView === 'month' &&
              Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg text-black">
                  {i + 1}
                </div>
              ))}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-lg flex-1 max-w-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {format(selectedDate, 'MMMM d')} Appointment
          </h2>
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
              <span className="font-semibold">Date Paid:</span> {format(new Date(), 'MMM d, yyyy')}
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
              onClick={handleConfirmAppointment}
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

      {/* Reschedule Confirmation */}
      {isRescheduleConfirmed && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              APPOINTMENT RESCHEDULED.
            </h2>
            <p className="text-center mb-6">
              Your appointment has been rescheduled.
            </p>
            <div className="text-center">
              <button
                onClick={handleCloseConfirmation}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Confirmation */}
      {isAppointmentConfirmed && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              APPOINTMENT CONFIRMED.
            </h2>
            <p className="text-center mb-6">
              Your appointment has been confirmed.
            </p>
            <div className="text-center">
              <button
                onClick={handleCloseConfirmation}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;
