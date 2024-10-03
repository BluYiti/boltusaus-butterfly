"use client";
import React, { useState } from "react";
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
    <div className="text-black min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow z-50">
        <div className="text-2xl font-bold">Butterfly</div>
        <ul className="flex space-x-10">
          <li>
            <a
              href="#about"
              className="text-[#20206b] font-bold relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#blog"
              className="text-[#20206b] font-bold relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Frequently Asked Questions
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-[#20206b] font-bold relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact Us
            </a>
          </li>
        </ul>
        <button className="relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-blue-600 text-white rounded py-2 px-4 group">
  <span className="absolute inset-0 w-full h-full bg-blue-500 transform translate-x-full transition duration-300 ease-out group-hover:translate-x-0"></span>
  <span className="relative w-full text-left transition-colors duration-300 ease-in-out group-hover:text-white">Login</span>
</button>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-cover bg-center h-96 mt-16" style={{ backgroundImage: `url('/images/background.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">We Help You To Heal Yourself</h1>
            <p className="mt-4">Discover pathways to mental well-being and personal growth.</p>
            <button className="relative inline-block font-medium group mt-6">
  <span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 bg-blue-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
  <span className="absolute inset-0 w-full h-full bg-white border-[#38B6FF] group-hover:bg-[#87CEFA]"></span>
  <span className="relative font-bold text-[#000000] px-6 py-3 rounded">Get Started</span>
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
</section>

 {/* Info Section */}
      <section id="insights" className="py-12">
  <div className="container mx-auto px-4">
    {/* Title with a border line */}
    <h2 className="text-3xl font-bold text-center mb-8 border-b-4 border-[#B3EBF2] inline-block pb-2">
      How does Butterfly work?
    </h2>

  {/* Info list */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {[
    { title: 'Create your Account', description: 'Login or register to access our services.' },
    { title: 'Answer the Pre-assessment Form', description: 'Choose your answers to determine your suitability for our services.' },
    { title: 'Wait for your Evaluation Result', description: 'The psychotherapist will evaluate your pre-assessment form before you get accepted or referred to other services.' },
    { title: 'Set your Appointment', description: 'Choose your preferred Psychotherapist, and date and time for your consultation.' },
    { title: 'Pay your Session Fee', description: 'Choose your payment method and pay for your upcoming session.' },
    { title: 'Start with Therapy', description: 'Explore effective self-care strategies, and communicate with our experts to enhance your well-being.' }
  ].map((insight, index) => (
    <div 
      key={index} 
      className="bg-white p-6 shadow rounded transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-[#B3EBF2] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
      <div className="relative z-10">
        {/* Subtitle with a border line */}
        <h3 className="text-xl font-semibold mb-2 border-b-2 border-white pb-1">{insight.title}</h3>
        <p className="text-gray-600 mt-2">{insight.description}</p>
      </div>
    </div>
  ))}
</div>
  </div>
</section>

  {/* Schedule Visit Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Schedule Your Appointment</h2>
          <p className="text-gray-600 mb-6">Take the first step towards better mental health. Book your appointment with our experts today.</p>
        </div>

        {/* Footer */}
        <div className="bg-white shadow-lg py-4 px-6 text-center">
          <p className="text-gray-500">© 2024 Butterfly Inc. All rights reserved.</p>
        </div>
      </footer>
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
