// components/SidebarItem.tsx

import Link from "next/link";
import { IconType } from "react-icons";

interface SidebarItemProps {
  href: string;
  icon: IconType;
  label: string;
  isMinimized: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, label, isMinimized }) => {
  return (
    <Link href={href} className="flex items-center hover:bg-blue-700 p-2 rounded">
      <Icon size={24} />
      {!isMinimized && <span className="ml-4">{label}</span>}
    </Link>
  );
};

export default SidebarItem;
