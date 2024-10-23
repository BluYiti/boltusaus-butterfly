"use client";

import { useEffect, useState } from "react";
import { FiMenu, FiChevronLeft } from "react-icons/fi";
import { IconType } from "react-icons"; // Import IconType from react-icons
import SidebarItem from "./SidebarItem";
import Loading from "./Loading";
import LogoutButton from '@/auth/logout/component/logoutButton';

interface SidebarProps {
  title: string;
  items: Array<{ href: string; label: string; icon: IconType; isDisabled?: boolean }>; // Accept isDisabled
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ title, items, isMinimized, setIsMinimized }) => {
  const [isLoading, setIsLoading] = useState(true);

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
    <div className={`fixed top-0 left-0 h-full bg-white text-black transition-all duration-300 ease-in-out ${isMinimized ? "w-16" : "w-60"}`}>
      <div className="p-4 flex justify-between">
        <h1 className={`text-xl font-bold text-blue-800 ${isMinimized ? "hidden" : ""}`}>
          {title}
        </h1>
        <button onClick={toggleSidebar} className="text-blue-900 hover:bg-gray-400 p-1 rounded flex ml-auto">
          {isMinimized ? <FiChevronLeft size={23} /> : <FiMenu size={24} />}
        </button>
      </div>

      <nav className="flex flex-col space-y-4 p-4">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isMinimized={isMinimized}
            isDisabled={item.isDisabled} // Pass isDisabled
          />
        ))}
      </nav>

      <LogoutButton isMinimized={isMinimized} />
    </div>
  );
};

export default Sidebar;
