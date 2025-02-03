import { useState, useEffect } from "react";
import { account } from "@/appwrite";
import Sidebar from "./SideBar";
import { IconType } from "react-icons";
import { fetchUserStatus, fetchUserState } from '@/hooks/userService';
import LoadingScreen from "@/components/LoadingScreen"; // Import LoadingScreen component

interface LayoutProps {
  children: React.ReactNode;
  sidebarTitle: string;
  sidebarItems: Array<{ href: string; label: string; icon: IconType; }>;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarTitle, sidebarItems }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [, setStatus] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const userStatus = await fetchUserStatus(user.$id);
        const userState = await fetchUserState(user.$id);
        
        setStatus(userStatus);
        setState(userState);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Ensure that window is only accessed in the client
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem('sidebarMinimized');
      if (savedState) {
        setIsMinimized(JSON.parse(savedState));
      } else {
        setIsMinimized(false);
      }
    }
  }, []);

  // Dynamically handle the items based on the role
  const filteredItems = sidebarItems.map((item) => ({
    ...item,
    href: state === "new" && item.href === "/client" ? "/client" : item.href,
    icon: item.icon as IconType,
    isDisabled: (state === "new" || state === "evaluate") && ["Book Appointment", "Communication", "Payments", "Goals"].includes(item.label),
  }));

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        isMinimized={isMinimized}
        setIsMinimized={(value) => {
          setIsMinimized(value);
          localStorage.setItem('sidebarMinimized', JSON.stringify(value));
        }}
        title={sidebarTitle}
        items={filteredItems}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out bg-[#eff6ff] overflow-x-hidden ${isMinimized ? "ml-16" : "ml-60"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
