// components/SidebarItem.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

interface SidebarItemProps {
  href: string;
  icon: IconType;
  label: string;
  isMinimized: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, label, isMinimized }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center p-2 rounded transition-all duration-300 ease-in-out ${isActive ? "text-blue-800" : "hover:text-blue-600"}`}>
      <Icon size={24} />
      {!isMinimized && (
        <span className="flex-1 ml-4 flex items-center justify-between">
          {label}
          {isActive && <span className="w-2 h-2 rounded-full bg-blue-800"></span>}
        </span>
      )}
    </Link>
  );
};

export default SidebarItem;
