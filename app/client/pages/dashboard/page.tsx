"use client";
import React, { useState } from "react";
import {
  FaBell,
  FaBars,
  FaHome,
  FaUserMd,
  FaCalendarAlt,
  FaCogs,
  FaSignOutAlt,
  FaUser,
  FaBullseye,
  FaComments,
} from "react-icons/fa";

const Dashboard: React.FC = () => {
  // State for selected month (default: current month)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Get the current date info
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Placeholder for dynamic user data (use your actual data fetching method)
  const userName = "John"; // Replace this with actual user data

  // Months of the year
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Days in each month for the year 2024 (leap year)
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Function to handle month change
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  // Calculate the first day of the selected month (0 for Sunday, 1 for Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1).getDay();

  return (
    <div className="text-black min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-white shadow-md w-64 min-h-screen px-4">
        <div className="py-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold text-blue-500">Butterfly</div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg text-blue-600 hover:bg-gray-100">
              <FaHome className="text-xl" />
              <span className="font-medium">Home</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
              <FaUser className="text-xl" />
              <span className="font-medium">Profile</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
              <FaComments className="text-xl" />
              <span className="font-medium">Communication</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
              <FaCogs className="text-xl" />
              <span className="font-medium">Settings</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
              <FaBullseye className="text-xl" />
              <span className="font-medium">Goals</span>
            </a>
            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Logout</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-between bg-gray-100">
        {/* Top Section with User Info and Header */}
        <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              <FaUser size={24} />
            </div>
            <h1 className="text-xl font-semibold">
              Good Morning, <span className="font-bold">{userName}!</span>
            </h1>
          </div>

          {/* Menu and Notification Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
              <FaBell size={24} />
            </button>
          </div>
        </div>

        {/* Upcoming Sessions and Announcements Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-8">
          {/* Upcoming Sessions Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-">
            <h2 className="text-bold text-xl font-bold mb-4">Upcoming Sessions</h2>
            <div className="space-y-2 flex-grow overflow-y-auto max-h-[300px]">
              <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x">
                <span className="font-bold">PLACEHOLDER FOR THE FIRST SESSION</span>
                <span className="text-gray-600 font-bold">Date and Time</span>
              </div>         
            </div>
          </div>

          {/* Reminders Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">A Daily Reminder to Yourself</h2>
            <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px]">
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg">This Too Shall Pass</h3>
                <p className="text-gray-700">Feelings are temporary. Hold on, better days are coming.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg">Breathe In, Let Go</h3>
                <p className="text-gray-700">Take a moment to breathe. Release the tension in your mind and body.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg">You Are Enough.</h3>
                <p className="text-gray-700">Your worth isn’t measured by your struggles. You are enough just as you are.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-grow overflow-auto p-8">
          {/* Calendar and What to do section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold">Calendar</h2>

              {/* Dropdown to select month */}
              <div className="mt-4">
                <label htmlFor="month-select" className="font-medium text-gray-700">
                  Choose a month:
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="ml-2 p-2 border border-gray-300 rounded-lg"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calendar Grid */}
              <div className="mt-6">
                <div className="text-center">
                  <div className="text-bold text-xl font-bold">{months[selectedMonth]}</div>
                  <div className="grid grid-cols-7 text-center mt-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-sm font-medium text-gray-700">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center gap-y-4 mt-4">
                    {/* Fill the empty spaces before the first day of the month */}
                    {[...Array(firstDayOfMonth)].map((_, index) => (
                      <div key={index}></div>
                    ))}
                    {/* Fill the days of the selected month */}
                    {[...Array(daysInMonth[selectedMonth])].map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`p-2 rounded-full cursor-pointer ${
                          dayIndex + 1 === currentDay && selectedMonth === currentMonth
                            ? "bg-blue-500 text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {dayIndex + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

{/* What to do section */}
<div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold">What to do?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <ActivityCard
                  title="Meditate"
                  description="20-30 minutes/day"
                  icon="🧘‍♀️"
                />
                <ActivityCard
                  title="Pet Time"
                  description="Be sure to have some play time with your beloved pets"
                  icon="🐶"
                />
                <ActivityCard
                  title="Exercise"
                  description="30-35 minutes/day"
                  icon="💪"
                />
                <ActivityCard
                  title="Arts"
                  description="Showcase your talent, express yourself!"
                  icon="🎨"
                />
              </div>
            </div>
          </div>

          {/* Mood Tracker Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Mood Tracker */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">How are you feeling today?</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">START</button>
              </div>
            </div>

            {/* Reading Resources */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Reading Resources</h2>
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">Start your day by reading something inspiring!</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">VIEW</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white shadow-lg py-4 px-6 text-center">
          <p className="text-gray-500">© 2024 Butterfly Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

// ActivityCard Component
const ActivityCard: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow flex items-center">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Dashboard;
