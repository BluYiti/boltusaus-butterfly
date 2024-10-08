'use client'

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import BackToTopButton from './components/BackToTop';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaMap } from 'react-icons/fa';

const navItems = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact Us", href: "#contacts" },
];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 },
  }),
};

const aboutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HomePage: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contentType, setContentType] = useState<'terms' | 'privacy'>('terms');

  const openModal = (type: 'terms' | 'privacy') => {
    setContentType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const aboutRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleScroll = () => {
    if (aboutRef.current && !hasAnimated) {
      const rect = aboutRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isVisible) {
        setHasAnimated(true); // Set to true to trigger the animation
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAnimated]); // Depend on hasAnimated to avoid unnecessary re-renders

  return (
    <div className='overflow-x-hidden'>
      <BackToTopButton />
      
      {/* Top Section */}
      <section className="relative h-screen flex flex-col justify-center items-start bg-cover bg-center px-4 md:px-8" style={{ backgroundImage: `url('/images/landingbg.jpg')` }}>
        <motion.div
          className="relative z-10 text-left text-white max-w-md ml-4 md:ml-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-paintbrush whitespace-nowrap">Start your Journey</h1>
          <p className="mt-4 text-base md:text-lg">
            We believe that mental health is a collaborative effort. Together, we can navigate the path towards emotional well-being and strength.
          </p>
          <Link href={'/register'}>
            <button className="mt-6 w-full md:w-auto bg-[#2081c3] text-white font-bold py-3 px-6 rounded-full border-2 border-transparent hover:border-[#2081c3] hover:bg-transparent transform hover:scale-110 transition-all duration-300">
              Book an Appointment
            </button>
          </Link>
        </motion.div>

        {/* Centered Navbar */}
        <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-white">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="hover:text-gray-400"
              initial="hidden"
              animate="visible"
              variants={navVariants}
              custom={index}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Right Side Butterfly Header */}
        <h2 className="absolute top-4 left-4 text-white text-2xl md:text-3xl font-bold">Butterfly</h2>

        {/* Adjusted Login Button */}
        <div className="absolute top-4 right-4">
          <Link href={"/login"}>
            <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700'>
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-8 md:py-32 bg-white text-center md:text-left h-[80vh]">
        <motion.div
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          variants={aboutVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center max-w-4xl mx-auto">
            <div className="md:w-2/3 px-2">
              <h1 className="text-3xl md:text-4xl lg:text-7xl font-paintbrush text-blue-800 mb-4 md:mb-8">
                What is Butterfly?
              </h1>
              <p className="text-base md:text-lg mb-8">
                Butterfly is a psychological wellness web application of A.M. Peralta Psychological Services that offers the features: enhanced appointment system with an automated interactive SMS service, refined remote psychotherapy counseling, and a comprehensive client monitoring and management. These integrated services will allow clients and psychotherapists to book appointments and communicate remotely at any time. Butterfly aims to deliver more efficient, effective, and reliable mental healthcare digital service.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-right md:justify-end md:ml-2">
              <img src="/images/amperalta.jpg" alt="A.M. Peralta Psychological Services" className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Booking Section */}
      <section className="bg-[#c2dffd]">
        <div className="absolute mt-16 right-0 w-1/2 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/booksession.png')` }}></div>
        <div className="relative z-10 max-w-5xl py-16 px-4 md:px-8 ml-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-paintbrush mb-8 text-left text-blue-800">
            How to Book a Session
          </h2>
          <p className="mb-8 text-base md:text-lg text-left max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <ol className="space-y-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <span className={`text-6xl font-paintbrush text-gray-${500 + index * 100}`}>
                      {index + 1}
                    </span>
                    <div>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                  </li>
                ))}
              </ol>
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
    </Layout>
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