// admin/components/SideBar.tsx
"use client";

import { useEffect, useState } from "react";
import { FiUser, FiBarChart2, FiLock, FiClipboard, FiList, FiLogOut } from "react-icons/fi";
import ToggleButton from "./ToggleButton";
import SidebarItem from "./SidebarItem";
import Loading from "./Loading"; // Import the Loading component

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState<boolean | null>(null); // Using `null` to represent the loading state
  const [isLoading, setIsLoading] = useState(true); // Manage a separate loading state to control the delay

  // Load sidebar state from local storage with delay
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarMinimized');
    if (savedState) {
      setIsMinimized(JSON.parse(savedState));
    } else {
      setIsMinimized(false); // Default state if no saved state is found
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('sidebarMinimized', JSON.stringify(newState));
  };

  const handleLogout = () => {
    // Handle your logout logic here
    console.log('Logging out...');
  };

  // Display the loading component until the state is loaded
  if (isMinimized === null) {
    return <Loading fullPage={true} />; // Pass a prop to indicate full page loading
  }

  return (
    <div className={`h-screen ${isMinimized ? "w-16" : "w-64"} bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Toggle Button */}
      <div className="p-4 flex justify-end">
        <ToggleButton isMinimized={isMinimized} toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar Links */}
      <nav className="flex flex-col space-y-4 p-4">
        <SidebarItem href="/admin/pages/analytics" icon={FiBarChart2} label="Analytics" isMinimized={isMinimized} />
        <SidebarItem href="/admin/pages/account" icon={FiUser} label="Account" isMinimized={isMinimized} />
        <SidebarItem href="/admin/pages/security" icon={FiLock} label="Security" isMinimized={isMinimized} />
        <SidebarItem href="/admin/pages/tickets" icon={FiClipboard} label="Tickets" isMinimized={isMinimized} />
        <SidebarItem href="/admin/pages/logs" icon={FiList} label="Logs" isMinimized={isMinimized} />
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4 flex items-center">
        <button onClick={handleLogout} className="w-full flex items-center hover:bg-red-600 p-2 rounded text-red-400">
          <FiLogOut size={24} />
          {!isMinimized && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
