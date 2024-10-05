'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, UserGroupIcon, CreditCardIcon, ChatIcon, BookOpenIcon, UserCircleIcon, LogoutIcon } from '@heroicons/react/outline';

const Sidebar = () => {
  const currentPath = usePathname();

  const menuItems = [
    { name: 'Home', icon: <HomeIcon className="h-6 w-6" />, path: '/psychotherapist' },
    { name: 'Clients', icon: <UserGroupIcon className="h-6 w-6" />, path: '/psychotherapist/pages/client' },
    { name: 'Payments', icon: <CreditCardIcon className="h-6 w-6" />, path: '/psychotherapist/pages/clientpayment' },
    { name: 'Communication', icon: <ChatIcon className="h-6 w-6" />, path: '/psychotherapist/pages/communication' },
    { name: 'Resources', icon: <BookOpenIcon className="h-6 w-6" />, path: '/psychotherapist/pages/resources' },
    { name: 'Profile', icon: <UserCircleIcon className="h-6 w-6" />, path: '/psychotherapist/pages/aboutme' },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logged out");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white text-black shadow-lg">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8 text-blue-800">Butterfly</h1>
          <ul className="space-y-4">
            {menuItems.map(({ name, icon, path }) => (
              <li
                key={name}
                className={`flex items-center space-x-2 cursor-pointer p-2 rounded-lg transition duration-200 ease-in-out 
                  ${currentPath === path ? 'text-blue-800 font-semibold' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <Link href={path} className="flex items-center space-x-2 w-full">
                  {icon}
                  <span>{name}</span>
                  {currentPath === path && (
                    <div className="ml-2 w-2 h-2 bg-blue-800 rounded-full" />
                  )}
                </Link>
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
