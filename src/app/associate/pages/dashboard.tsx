import React from 'react';

const AssociateDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation Bar */}
      <aside className="bg-white w-60 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">Butterfly</h1>
        <nav className="space-y-4">
          <button className="block text-blue-600">Home</button>
          <button className="block text-gray-600 hover:text-blue-600">Profile</button>
          <button className="block text-gray-600 hover:text-blue-600">Appointments</button>
          <button className="block text-gray-600 hover:text-blue-600">Client List</button>
          <button className="block text-gray-600 hover:text-blue-600">Payments</button>
          <button className="block text-gray-600 hover:text-blue-600">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-semibold mb-6">Good Morning, Associate!</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Sessions</h3>
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x p-4 rounded-lg">
                <p>John Doe - Oct 3, 2024, 10:00 AM</p>
              </div>
              <div className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x p-4 rounded-lg">
                <p>Jane Smith - Oct 10, 2024, 2:00 PM</p>
              </div>
              <div className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x p-4 rounded-lg">
                <p>Alex Johnson - Oct 15, 2024, 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Appointment List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Appointment List</h3>
            <div className="space-y-2">
              <div className="border-b border-gray-300 pb-2">
                <p className="font-semibold">Client: John Doe</p>
                <p>Date: Oct 3, 2024</p>
                <p>Time: 10:00 AM</p>
              </div>
              <div className="border-b border-gray-300 pb-2">
                <p className="font-semibold">Client: Jane Smith</p>
                <p>Date: Oct 10, 2024</p>
                <p>Time: 2:00 PM</p>
              </div>
              <div className="border-b border-gray-300 pb-2">
                <p className="font-semibold">Client: Alex Johnson</p>
                <p>Date: Oct 15, 2024</p>
                <p>Time: 1:00 PM</p>
              </div>
            </div>
          </div>

          {/* Reschedule Requests */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Reschedule Requests</h3>
            <div className="space-y-2">
              <div className="bg-indigo-400 text-white p-4 rounded-lg">
                <p>John Doe requests to reschedule to Oct 4, 2024, 11:00 AM</p>
              </div>
              <div className="bg-indigo-400 text-white p-4 rounded-lg">
                <p>Jane Smith requests to reschedule to Oct 11, 2024, 3:00 PM</p>
              </div>
            </div>
          </div>

          {/* Payment Notifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Payment Notifications</h3>
            <div className="space-y-2">
              <div className="bg-green-500 text-white p-4 rounded-lg">
                <p>Payment received from John Doe - $100</p>
              </div>
              <div className="bg-red-500 text-white p-4 rounded-lg">
                <p>Pending payment from Jane Smith - $200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociateDashboard;