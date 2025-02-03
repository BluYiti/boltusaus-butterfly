import { useEffect, useState } from "react";
import { FiChevronLeft, FiMenu } from "react-icons/fi";
import { IconType } from "react-icons";
import SidebarItem from "./SidebarItem";
import LogoutButton from "@/auth/logout/component/logoutButton";

interface SidebarProps {
  title: string;
  items: Array<{ href: string; label: string; icon: IconType; isDisabled?: boolean }>;
  isMinimized: boolean;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ title, items, isMinimized, setIsMinimized }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768); // Mobile layout if width <= 768px
      };

      handleResize(); // Set initial state on mount
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsMinimized(true); // Always minimized on mobile
    } else {
      const savedState = localStorage.getItem("sidebarMinimized");
      setIsMinimized(savedState ? JSON.parse(savedState) : false);
    }
  }, [isMobile, setIsMinimized]);

  const toggleSidebar = () => {
    if (!isMobile) {
      const newState = !isMinimized;
      setIsMinimized(newState);
      localStorage.setItem("sidebarMinimized", JSON.stringify(newState));
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white text-black transition-all duration-300 ease-in-out ${
        isMinimized ? "w-16" : "w-60"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between">
        {!isMinimized && <h1 className="text-xl font-bold text-blue-800">{title}</h1>}
        {!isMobile && (
          <button onClick={toggleSidebar} className="text-blue-900 hover:bg-gray-400 p-1 rounded flex ml-auto">
            {isMinimized ? <FiChevronLeft size={23} /> : <FiMenu size={24} />}
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex flex-col space-y-4 p-4">
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isMinimized={isMobile ? true : isMinimized} // Always minimized in mobile
            isDisabled={item.isDisabled}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <LogoutButton isMinimized={isMobile ? true : isMinimized} />
    </div>
  );
};

export default Sidebar;
