import { IconType } from "react-icons";
import { FiUser } from "react-icons/fi";

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/admin", label: "Account", icon: () => <FiUser /> },
];

export default items;
