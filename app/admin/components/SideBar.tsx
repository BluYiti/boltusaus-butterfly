// admin/components/SideBar.tsx
"use client";

import { useEffect, useState } from "react";
import { FiUser, FiBarChart2, FiLock, FiClipboard, FiList, FiLogOut } from "react-icons/fi";
import ToggleButton from "./ToggleButton";
import SidebarItem from "./SidebarItem";
import Loading from "./Loading";
import LogoutButton from '@/auth/logout/component/logoutButton';

const Sidebar = ({ isMinimized, setIsMinimized }: { isMinimized: boolean, setIsMinimized: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Load sidebar state from local storage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarMinimized');
    if (savedState) {
      setIsMinimized(JSON.parse(savedState));
    } else {
      setIsMinimized(false);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('sidebarMinimized', JSON.stringify(newState));
  };

  if (isMinimized === null) {
    return <Loading fullPage={true} />;
  }

  return (
    <div className={`fixed top-0 left-0 h-full bg-blue-900 text-white transition-all duration-300 ease-in-out ${isMinimized ? "w-16" : "w-64"}`}>
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
      <LogoutButton isMinimized={isMinimized} />
    </div>
  );
};

export default Sidebar;
