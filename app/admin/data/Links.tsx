import { IconType } from "react-icons";
import { FiUser, FiList } from "react-icons/fi";

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/admin/pages/account", label: "Account", icon: () => <FiUser /> },
];

export default items;
