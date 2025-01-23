import { IconType } from "react-icons";
import { FiUser, FiList } from "react-icons/fi";

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/admin/pages/account", label: "Account", icon: () => <FiUser /> },
  { href: "/admin/pages/logs", label: "Logs", icon: () => <FiList /> },
];

export default items;
