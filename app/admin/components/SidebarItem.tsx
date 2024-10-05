import Link from "next/link";
import { usePathname } from "next/navigation"; // For App Router
import { IconType } from "react-icons";

interface SidebarItemProps {
  href: string;
  icon: IconType;
  label: string;
  isMinimized: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, label, isMinimized }) => {
  const pathname = usePathname(); // Get the current path
  
  // Check if the current path matches the href
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center p-2 rounded transition-all duration-300 ease-in-out ${isActive ? "bg-blue-800 text-white" : "hover:bg-blue-700"}`}>
      <Icon size={24} />
      {!isMinimized && <span className="ml-4">{label}</span>}
    </Link>
  );
};

export default SidebarItem;
