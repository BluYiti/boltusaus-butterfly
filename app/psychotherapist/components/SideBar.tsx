'use client'

import React, { useState } from 'react';
import { HomeIcon, UserGroupIcon, CreditCardIcon, ChatIcon, BookOpenIcon, UserCircleIcon, LogoutIcon } from '@heroicons/react/outline';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Home');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logged out");
  };

  const menuItems = [
    { name: 'Home', icon: <HomeIcon className="h-6 w-6" /> },
    { name: 'Clients', icon: <UserGroupIcon className="h-6 w-6" /> },
    { name: 'Payments', icon: <CreditCardIcon className="h-6 w-6" /> },
    { name: 'Communication', icon: <ChatIcon className="h-6 w-6" /> },
    { name: 'Resources', icon: <BookOpenIcon className="h-6 w-6" /> },
    { name: 'Profile', icon: <UserCircleIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white text-black shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8 text-blue-800">Butterfly</h1>
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition duration-200 ease-in-out 
                  ${activeItem === item.name ? 'text-blue-800 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
                onClick={() => handleItemClick(item.name)}
              >
                {item.icon}
                <span>{item.name}</span>
                {activeItem === item.name && (
                  <div className="ml-2 w-2 h-2 bg-blue-800 rounded-full" />
                )}
              </li>
            ))}
            {/* Logout button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition duration-200 ease-in-out text-red-600 hover:text-red-800 w-full text-left"
              >
                <LogoutIcon className="h-6 w-6" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
