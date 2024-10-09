import { IconType } from "react-icons";
import { HomeIcon, CreditCardIcon } from '@heroicons/react/outline';

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/associate", label: "Home", icon: () => <HomeIcon className="w-6 h-6" /> },
  { href: "/associate/pages/payments", label: "Payment History", icon: () => <CreditCardIcon className="w-6 h-6" /> }, // Adjust both class and inline styles
];

export default items;
