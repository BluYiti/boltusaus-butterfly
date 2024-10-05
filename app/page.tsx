'use client'

import React from "react";
import { motion } from "framer-motion";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF } from 'react-icons/fa';

const HomePage: React.FC = () => {
  const router = useRouter();

  const [clicked, setClicked] = useState(false);

  const handleLogin = () => {
    setClicked(!clicked);
    router.push('/auth/login');
  };

  // States to manage the open/closed state of each FAQ item
  const [open, setOpen] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpen(open === index ? null : index); // Toggle open/close
  };

  const navItems = [
    { label: "About Us", href: "#" },
    { label: "Our Services", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "FAQs", href: "#" },
  ];
  
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 },
    }),
  };
  
  return (
    <div className='overflow-x-hidden'>
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
          <button className="mt-6 w-full md:w-auto bg-[#2081c3] text-white font-bold py-3 px-6 rounded-full border border-transparent hover:border-[#2081c3] hover:bg-transparent hover:text-[#2081c3] transform hover:scale-105 transition-all duration-300">
            Book an Appointment
          </button>
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
        <button 
            className={`${clicked ? 'active' : 'inactive'} bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700`}
            onClick={handleLogin}
        >
            Login
        </button>
        </div>
      </section>

      {/* Second Section */}
      <section className="py-8 md:py-32 bg-white text-center md:text-left h-[80vh]">
        <div className="flex flex-col md:flex-row md:items-center max-w-4xl mx-auto">
          <div className="md:w-2/3 px-2"> {/* Add horizontal padding here */}
            <h1 className="text-3xl md:text-4xl lg:text-7xl font-paintbrush text-blue-800 mb-4 md:mb-8">
              What is Butterfly?
            </h1>
            <p className="text-base md:text-lg mb-8">
              Butterfly is a psychological wellness web application of A.M. Peralta Psychological Services that offers the features: enhanced appointment system with an automated interactive SMS service, refined remote psychotherapy counseling, and a comprehensive client monitoring and management. These integrated services will allow clients and psychotherapists to book appointments and communicate remotely at any time. Butterfly aims to deliver more efficient, effective, and reliable mental healthcare digital service.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-right md:justify-end md:ml-2"> {/* Reduce margin-left here */}
            <img src="/images/amperalta.jpg" alt="A.M. Peralta Psychological Services" className="w-48 h-48 md:w-64 md:h-64 rounded-full" />
          </div>
        </div>
      </section>

      {/* Third Section */}
      <section className="bg-[#c2dffd]">
        {/* Background Image */}
        <div className="absolute mt-16 right-0 w-1/2 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/booksession.png')` }}></div>
        
        {/* Content Container */}
        <div className="relative z-10 max-w-5xl py-16 px-4 md:px-8 ml-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-paintbrush mb-8 text-left text-blue-800">
            How to Book a Session
          </h2>
          <p className="mb-8 text-base md:text-lg text-left max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2"> {/* First column takes 2/3 */}
              <ol className="space-y-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <span className={`text-6xl font-paintbrush text-${index === 0 ? 'gray-500' : index === 1 ? 'gray-600' : index === 2 ? 'gray-700' : 'gray-800'}`}>
                      {index + 1}
                    </span>
                    <div>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="md:col-span-1"> {/* Second column takes 1/3 */}
              {/* You can put any additional content here if needed */}
            </div>
          </div>
        </div>
      </section>

      {/* Fourth Section */}
      <section className="bg-white h-screen relative flex flex-col justify-center items-start">
        {/* Background Image */}
        <div
          className="absolute right-20 w-screen h-screen bg-contain bg-no-repeat"
          style={{ backgroundImage: `url('/images/cloud.png')`, backgroundPosition: 'right center' }}
        ></div>
        
        {/* Second Background Image */}
        <div
          className="absolute bottom-0 left-20 w-screen h-1/2 bg-contain bg-no-repeat"
          style={{ backgroundImage: `url('/images/services.png')`, backgroundPosition: 'left bottom' }}
        ></div>

        {/* Header */}
        <h1 className="absolute top-10 left-10 text-8xl z-10 font-paintbrush text-blue-800">
          Butterfly Offers
        </h1> 

        {/* Content */}
        <div className="relative z-10 flex-grow flex items-center justify-end pr-10">
          <p className="max-w-md text-lg">
            Your content goes here. You can add any text, images, or other elements you need.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-10">
        <h2 className="text-center text-4xl font-bold text-blue-800 mb-10">FAQs</h2>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item, index) => (
            <div key={index} className="rounded-lg border shadow-md">
              <div
                onClick={() => toggleOpen(index)}
                className="cursor-pointer flex justify-between items-center p-4 bg-blue-100 hover:bg-blue-200"
              >
                <p className="text-lg font-medium">Lorem ipsum dolor sit amet?</p>
                <span className="text-xl">{open === index ? '▲' : '▼'}</span>
              </div>
              {open === index && (
                <div className="p-4 bg-blue-50 text-gray-700">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#977b9b] py-3 text-white">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-5xl font-paintbrush">Butterfly</h2>
            <div className="ml-4">
              <img src="/images/WhiteLogoNoBg.png" alt="Butterfly Logo" className="h-20 w-20" />
            </div>
          </div>

          <div className="text-right">
            <div className="text-left">
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <a 
                  href="https://maps.app.goo.gl/yiV8BHgQP4zqpPta8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative inline-block hover:transition-colors duration-300 group"
                >
                  Unit 303 Sam-son's Building, Lower Mabini St., Baguio City
                  <span className="absolute inset-0 bg-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-50"></span>
                </a>
              </p>
              <p className="flex items-center">
                <FaEnvelope className="mr-2" />
                <a 
                  href="mailto:amperaltapsychservices@gmail.com" 
                  className="relative inline-block hover:transition-colors duration-300 group"
                >
                  amperaltapsychservices@gmail.com
                  <span className="absolute inset-0 bg-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-50"></span>
                </a>
              </p>
              <p className="flex items-center">
                <FaPhone className="mr-2" />
                0926 669 6242
              </p>
              <p className="flex items-center">
                <FaFacebookF className="mr-2" />
              <a
                href="https://www.facebook.com/amperaltapsychservices" // Replace with your URL
                className="relative inline-block hover:transition-colors duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                A.M.Peralta Psychological Services
                <span className="absolute inset-0 bg-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-50"></span>
              </a>
              </p>
            </div>
          </div>
        </div>
        <br />
        <hr />

        <div className="text-left mt-4 ml-36">
          <a href="#" className="text-sm">Terms and Conditions</a> | <a href="#" className="text-sm">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
