"use client";

// admin/components/AdminLayout.tsx
import { useState, useEffect } from "react";
import Sidebar from "./SideBar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarMinimized');
    if (savedState) {
      setIsMinimized(JSON.parse(savedState));
    } else {
      setIsMinimized(false);
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isMinimized={isMinimized} setIsMinimized={setIsMinimized} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out p-6 bg-gray-100 ${
          isMinimized ? "ml-16" : "ml-64"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
