import { IconType } from "react-icons";
import { FiHome, FiUser, FiClock, FiBarChart2 } from "react-icons/fi";
import { CiChat1, CiSettings } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import { GoCodeOfConduct } from "react-icons/go";

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/client/pages/dashboard", label: "Home", icon: () => <FiHome /> },
  { href: "/client/pages/acceptedClientBooking", label: "Book Appointment", icon: () => <FiClock /> },
  { href: "/client/pages/profile", label: "Profile", icon: () => <FiUser /> },
  { href: "/client/pages/cmessage", label: "Communication", icon: () => <CiChat1 /> },
  { href: "/client/pages/payment", label: "Payments", icon: () => <CiWallet /> },
  { href: "/client/pages/goals", label: "Goals", icon: () => <FiBarChart2 /> },
  { href: "/client/pages/settings", label: "Settings", icon: () => <CiSettings /> },
  { href: "/client/pages/hotline", label: "Hotline", icon: () => <GoCodeOfConduct /> },
];

export default items;