"use client"; // Add this line at the top

import React, { useState } from 'react';
import { format, addMonths, subMonths, getMonth, getYear } from 'date-fns';

const AppointmentDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const goToPreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const formattedMonthYear = format(selectedDate, 'MMMM yyyy');
  const currentMonth = getMonth(selectedDate);
  const currentYear = getYear(selectedDate);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation Bar */}
      <aside className="bg-white w-60 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Butterfly</h1>
        <nav className="space-y-4">
          <button className="block text-gray-600 hover:text-blue-600">Home</button>
          <button className="block text-gray-600 hover:text-blue-600">Profile</button>
          <button className="block text-blue-600 hover:text-gray-600">Appointments</button>
          <button className="block text-gray-600 hover:text-blue-600">Client List</button>
          <button className="block text-gray-600 hover:text-blue-600">Payments</button>
          <button className="block text-gray-600 hover:text-blue-600">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-4 flex space-x-4">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg flex-1 p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                className={`py-2 px-4 rounded-lg ${selectedView === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedView('day')}
              >
                Day
              </button>
              <button
                className={`py-2 px-4 rounded-lg ${selectedView === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedView('week')}
              >
                Week
              </button>
              <button
                className={`py-2 px-4 rounded-lg ${selectedView === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
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

          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-bold text-gray-500">{day}</div>
            ))}
            {selectedView === 'day' && <div className="p-4 rounded-lg text-black">Detailed view for selected day</div>}
            {selectedView === 'week' && Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">Day {i + 1} of the week</div>
            ))}
            {selectedView === 'month' && Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg text-black">{i + 1}</div>
            ))}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-lg flex-1 max-w-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {format(selectedDate, 'MMMM d')} Appointment
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <img src="/path/to/profile-pic.png" alt="Profile" className="w-12 h-12 rounded-full" />
            <div>
              <h3 className="font-bold">Denzel White</h3>
              <p className="text-sm text-gray-600">9:00 AM</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Type:</span> Online</p>
            <p><span className="font-semibold">Status:</span> <span className="text-green-500">Paid</span></p>
            <p><span className="font-semibold">Mode:</span> GCash</p>
            <p><span className="font-semibold">Date Paid:</span> {format(new Date(), 'MMM d, yyyy')}</p>
            <p><span className="font-semibold">Discount:</span> 5%</p>
          </div>

          <div className="flex justify-between mt-4">
            <button onClick={handleDecline} className="bg-red-500 text-white py-2 px-6 rounded-lg">DECLINE</button>
            <button onClick={handleConfirmAppointment} className="bg-green-500 text-white py-2 px-6 rounded-lg">CONFIRM</button>
          </div>
        </div>
      </div>

      {/* Modals for Decline, Reschedule, and Confirm */}
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
                Reschedule
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


      {isRescheduleConfirmed && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              APPOINTMENT RESCHEDULED.
            </h2>
            <p className="text-center mb-6">
              Your appointment has been rescheduled to {selectedRescheduleTime}.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseConfirmation}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isAppointmentConfirmed && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              APPOINTMENT CONFIRMED.
            </h2>
            <p className="text-center mb-6">
              You have confirmed the appointment with Denzel White.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleCloseConfirmation}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDashboard;