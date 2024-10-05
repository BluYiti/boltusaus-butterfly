"use client";
import React from "react";
import { FaBell, FaBars, FaHome, FaUserMd, FaUserFriends, FaTasks } from "react-icons/fa";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Top Section with User Info and Header */}
      <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <i className="fas fa-user"></i>
          </div>
          <h1 className="text-xl font-semibold">
            Good Morning, <span className="font-bold">Raianna!</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <i className="fas fa-bell text-lg"></i>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">1</span>
          </div>
          <i className="fas fa-bars text-lg"></i>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-auto p-6">
        {/* Upcoming Sessions Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-400 mr-3"></div>
                <span className="font-medium text-gray-700">April 25, 2024</span>
              </div>
              <span className="text-gray-500">8:00 AM</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-400 mr-3"></div>
                <span className="font-medium text-gray-700">May 2, 2024</span>
              </div>
              <span className="text-gray-500">10:00 AM</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-400 mr-3"></div>
                <span className="font-medium text-gray-700">May 9, 2024</span>
              </div>
              <span className="text-gray-500">1:00 PM</span>
            </div>
          </div>
        </div>

        {/* Mood Tracker Section */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">How are you?</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">GO</button>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <span className="block text-3xl text-green-500">😊</span>
              <span className="text-gray-500 text-sm">Happy</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl text-yellow-500">😐</span>
              <span className="text-gray-500 text-sm">Neutral</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl text-red-500">😢</span>
              <span className="text-gray-500 text-sm">Sad</span>
            </div>
          </div>
        </div>

        {/* Clinic Location Section */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Clinic Location</h2>
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509454!2d144.95373531589787!3d-37.816279979751594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f3f8d3b1%3A0x5045675218ce6e0!2sMelbourne!5e0!3m2!1sen!2sau!4v1615343795043!5m2!1sen!2sau"
              width="100%"
              height="200"
              loading="lazy"
            ></iframe>
          </div>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            View Location
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-blue-500 p-4 shadow-md flex justify-between items-center">
        <NavButton icon={<FaHome size={24} />} label="Home" />
        <NavButton icon={<FaUserMd size={24} />} label="Therapy" />
        <NavButton icon={<FaUserFriends size={24} />} label="Psychcare" />
        <NavButton icon={<FaTasks size={24} />} label="Goals" />
      </div>
    </div>
  );
};
// Navigation Button Component
const NavButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex flex-col items-center text-white hover:text-gray-200">
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

export default Dashboard;
