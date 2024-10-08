import { IconType } from "react-icons";
import { FiHome, FiUser, FiClock, FiBarChart2 } from "react-icons/fi";
import { CiChat1, CiSettings } from "react-icons/ci";

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/client", label: "Home", icon: () => <FiHome /> },
  { href: "/client/pages/bookappointment", label: "Book Appointment", icon: () => <FiClock /> },
  { href: "/client/pages/profile", label: "Profile", icon: () => <FiUser /> },
  { href: "/client/pages/communication", label: "Communication", icon: () => <CiChat1 /> },
  { href: "/client/pages/goals", label: "Goals", icon: () => <FiBarChart2 /> },
  { href: "/client/pages/settings", label: "Settings", icon: () => <CiSettings /> },
];

export default items;
