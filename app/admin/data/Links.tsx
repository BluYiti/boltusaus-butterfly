import { IconType } from "react-icons";
import { FiBarChart2, FiUser, FiLock, FiClipboard, FiList } from "react-icons/fi";

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/admin/pages/analytics", label: "Analytics", icon: () => <FiBarChart2 /> },
  { href: "/admin/pages/account", label: "Account", icon: () => <FiUser /> },
  { href: "/admin/pages/security", label: "Security", icon: () => <FiLock /> },
  { href: "/admin/pages/tickets", label: "Tickets", icon: () => <FiClipboard /> },
  { href: "/admin/pages/logs", label: "Logs", icon: () => <FiList /> },
];

export default items;
