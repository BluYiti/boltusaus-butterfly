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
  const [role, setRole] = useState<string | null>(null);

  // Fetch user role and status
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const user = await account.get();
        console.log("Fetched User: ", user); // Debugging step

        // Safely get the role from user preferences
        if (user?.prefs?.role) {
          setRole(user.prefs.role); // Set role to either "New Client" or another value
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

  // Dynamically handle the items based on the role
  const filteredItems = sidebarItems.map((item) => ({
    ...item,
    href: role === "New Client" && item.href === "/client" ? "/client/pages/newClientDashboard" : item.href,
    icon: item.icon as IconType,
    isDisabled: role === "New Client" && ["Book Appointment", "Communication", "Payments", "Goals"].includes(item.label),
  }));

  return (
    <div className="flex h-screen">
      <Sidebar
        isMinimized={isMinimized}
        setIsMinimized={setIsMinimized}
        title={sidebarTitle}
        items={filteredItems} // Pass filteredItems here
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out bg-gray-100 ${isMinimized ? "ml-16" : "ml-60"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
