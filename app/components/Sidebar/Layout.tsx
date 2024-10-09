import { useState, useEffect } from "react";
import { account } from "@/appwrite";
import Sidebar from "./SideBar";
import { IconType } from "react-icons";

interface LayoutProps {
  children: React.ReactNode;
  sidebarTitle: string;
  sidebarItems: Array<{ href: string; label: string; icon: React.ComponentType; }>;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarTitle, sidebarItems }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAcceptedClient, setIsAcceptedClient] = useState(false);

  // Check user status
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const user = await account.get();

        if (user?.prefs?.position === "Accepted Client") {
          setIsAcceptedClient(true);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUserStatus();

    const savedState = localStorage.getItem('sidebarMinimized');
    if (savedState) {
      setIsMinimized(JSON.parse(savedState));
    } else {
      setIsMinimized(false);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
        title={sidebarTitle}
        items={sidebarItems.map((item) => ({
          ...item,
          icon: item.icon as IconType,
          isDisabled: !isAcceptedClient && ["Book Appointment", "Communication", "Goals"].includes(item.label),
        }))}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out bg-gray-100 ${isMinimized ? "ml-16" : "ml-60"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
