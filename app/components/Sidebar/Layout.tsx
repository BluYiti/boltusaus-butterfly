import { useState, useEffect } from "react";
import { account, databases, Query } from "@/appwrite";
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
  const [state, setState] = useState<string | null>(null); // State to track user state
  const [status, setStatus] = useState<string | null>(null); // State to track user status

  // Fetch user role and status
  useEffect(() => {
    const fetchUserState = async () => {
      try {
        const user = await account.get(); // Get user information
        const response = await databases.listDocuments(
          'Butterfly-Database', 
          'Client', 
          [Query.equal('userid', user.$id)] // Fetch documents where userid matches the logged-in user
        );
        
        // Assuming the user's state is in response.documents[0] (adjust if needed)
        const userState = response.documents[0]?.state;
        const userStatus = response.documents[0]?.status;
        setState(userState);
        setStatus(userStatus);
      } catch (error) {
        console.error('Error fetching user state:', error);
      }
    };

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
      <div className={`flex-1 transition-all duration-300 ease-in-out bg-[#eff6ff] ${isMinimized ? "ml-16" : "ml-60"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
