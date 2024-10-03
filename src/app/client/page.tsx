"use client";
import React, { useState } from "react";

import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/auth/logout/component/logoutButton';

import {
  FaBell,
  FaBars,
  FaHome,
  FaUserMd,
  FaUserFriends,
  FaTasks,
  FaCalendarAlt,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";

const Dashboard: React.FC = () => {

  const router = useRouter();
    // Function to navigate to Mood Tracker page
  const handleNavigateToMoodTracker = () => {
      router.push('/client/pages/moods'); 
  };
  
    // Function to navigate to Reading Resources page
  const handleNavigateToReadingResources = () => {
    router.push('/client/pages/explore'); 
  };
  
  // State for selected month (default: current month)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Get the current date info
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();

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
            <a
              onClick={() => router.push('/')}
              className="flex items-center space-x-3 p-2 rounded-lg text-blue-600 hover:bg-gray-100 cursor-pointer"
            >
              <FaHome className="text-xl" />
              <span className="font-medium">Home</span>
            </a>
            <a
              onClick={() => router.push('/client/pages/profile')}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FaCalendarAlt className="text-xl" />
              <span className="font-medium">Profile</span>
            </a>
            <a
              onClick={() => router.push('/client/pages/communication')}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FaUserMd className="text-xl" />
              <span className="font-medium">Communication</span>
            </a>
            <a
              onClick={() => router.push('/client/pages/settings')}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FaCogs className="text-xl" />
              <span className="font-medium">Settings</span>
            </a>
            <a
              onClick={() => router.push('/client/pages/goals')}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FaCogs className="text-xl" />
              <span className="font-medium">Goals</span>
            </a>
            
            <LogoutButton isMinimized={false} />

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
              <i className="fas fa-user"></i>
            </div>
            <h1 className="text-xl font-semibold">
              Good Morning, <span className="font-bold">"Client!"</span>
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
  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
    <h2 className="text-bold text-xl font-bold mb-4">Upcoming Sessions</h2>
    <div className="space-y-2 flex-grow overflow-y-auto max-h-[300px]">
      <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x">
        <span className="font-bold">First Session</span>
        <span className="text-gray-600 font-bold">Oct 3, 2024, 10:00 AM</span>
      </div>
      <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x">
        <span className="font-bold">Second Session</span>
        <span className="text-gray-600 font-bold">Oct 10, 2024, 2:00 PM</span>
      </div>
      <div className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 animate-gradient-x">
        <span className="font-bold">Third Session</span>
        <span className="text-gray-600 font-bold">Oct 15, 2024, 1:00 PM</span>
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
      {/* Add more reminders if needed */}
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
                  <div className="font-bold text-xl">{months[selectedMonth]}</div>
                  <div className="grid grid-cols-7 text-center mt-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-sm font-medium text-gray-700">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 mt-2">
                    {[...Array(daysInMonth[selectedMonth])].map((_, dayIndex) => {
                      const day = dayIndex + 1;
                      const isToday =
                        selectedMonth === currentMonth && day === currentDay;

                      return (
                        <div
                          key={dayIndex}
                          className={`py-2 rounded ${
                            isToday
                              ? "bg-blue-500 text-white font-bold" // Highlight today's date
                              : [6, 7, 13, 14, 20, 21].includes(day)
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
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
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleNavigateToMoodTracker} // Navigate to Mood Tracker page
              >
                START
              </button>
            </div>
          </div>

          {/* Reading Resources */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Reading Resources</h2>
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Start your day by reading something inspiring!</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleNavigateToReadingResources} // Navigate to Reading Resources page
              >
                VIEW
              </button>
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

    {/* Clinic Location Section */}
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Clinic Location</h2>
    <div className="rounded-lg overflow-hidden shadow-md">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1221.4468853018993!2d120.5977013968742!3d16.410048859398453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a16008c97969%3A0x6fdba0b90e8c2642!2sSam-sons%20Building%2C%20Lower%20Mabini%20St%2C%20Baguio%2C%20Benguet%2C%20Philippines!5e0!3m2!1sen!2sus!4v1692571430635!5m2!1sen!2sus"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  </div>

export default Dashboard;
