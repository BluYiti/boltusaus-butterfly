import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

interface SidebarItemProps {
  href: string;
  icon: IconType;
  label: string;
  isMinimized: boolean;
  isDisabled?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ href, icon: Icon, label, isMinimized, isDisabled }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // If the item is disabled, render it without the Link wrapper
  if (isDisabled) {
    return (
      <div className="flex items-center p-2 rounded text-gray-400 cursor-not-allowed">
        <Icon size={24} />
        {!isMinimized && (
          <span className="flex-1 ml-4 flex items-center justify-between">
            {label}
          </span>
        )}
      </div>
    );
  }

  // If the item is not disabled, render it with the Link wrapper
  return (
    <Link
      href={href}
      className={`flex items-center p-2 rounded transition-all duration-300 ease-in-out ${
        isActive ? "text-blue-800" : "hover:text-blue-600"
      }`}
    >
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
