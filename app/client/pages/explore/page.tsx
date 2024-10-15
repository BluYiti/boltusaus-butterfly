"use client";
import React from 'react';
import { FaUserCircle, FaBars, FaHeart } from 'react-icons/fa';
import { FaBell, FaUser } from "react-icons/fa";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
const userName = "John"; // Placeholder for dynamic user data
const categories = [
  
  {
    title: "Wellness",
    items: [
      { name: "Yoga", time: "10 mins", description: "Find balance, strength, and serenity on the mat.", img: "/images/reading1.jpg" },
      { name: "Goals", time: "10 mins", description: "Track your goals.", img: "/images/reading3.jpg" },
      { name: "Workout", time: "10 mins", description: "Stay fit and healthy.", img: "/images/reading3.jpg" },
      { name: "Swimming", time: "10 mins", description: "Flow with the water.", img: "/images/reading1.jpg" },
    ]
  },
  {
    title: "Worklife",
    items: [
      { name: "Reading", time: "5 mins", description: "Mental Health at work: How to improve it?", img: "/images/reading1.jpg" },
      { name: "Drawing", time: "3 mins", description: "Express yourself with art.", img: "/images/reading3.jpg" },
      { name: "Take time off", time: "5 mins", description: "It is okay to rest.", img: "/images/reading3.jpg" },
      { name: "Contemplate", time: "3 mins", description: "Reflect and learn.", img: "/images/reading1.jpg" }
    ]
  },
];

const App = () => {
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-between bg-gray-100">
          {/* Top Section with User Info and Header */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <FaUser size={24} />
              </div>
              <h1 className="text-xl font-semibold">
                Good Morning, <span className="font-bold">{userName}!</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
          <div className="text-black min-h-screen bg-white">
            {/* Content */}
            <main className="p-6">
              <h2 className="text-xl font-semibold mb-4">Explore</h2>

              {categories.map((category) => (
                <section key={category.title}>
                  <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="relative bg-gray-100 rounded-lg shadow-md transition-transform transform hover:translate-x-2 hover:shadow-lg duration-300"
                      >
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="p-3">
                          <h4 className="text-md font-bold">{item.name}</h4>
                          <p className="text-sm">{item.time}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
