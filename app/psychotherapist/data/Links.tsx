import { IconType } from "react-icons";
import { HomeIcon, UserGroupIcon, CreditCardIcon, ChatIcon, BookOpenIcon, UserCircleIcon } from '@heroicons/react/outline';

const items: { href: string; label: string; icon: IconType }[] = [
  { href: "/psychotherapist", label: "Home", icon: () => <HomeIcon className="h-6 w-6"/> },
  { href: "/psychotherapist/pages/client", label: "Clients", icon: () => <UserGroupIcon className="h-6 w-6"/> },
  { href: "/psychotherapist/pages/clientpayment", label: "Payments", icon: () => <CreditCardIcon className="h-6 w-6"/> },
  { href: "/psychotherapist/pages/communication", label: "Communication", icon: () => <ChatIcon className="h-6 w-6"/> },
  { href: "/psychotherapist/pages/resources", label: "Resources", icon: () => <BookOpenIcon className="h-6 w-6"/> },
  { href: "/psychotherapist/pages/aboutme", label: "About Me", icon: () => <UserCircleIcon className="h-6 w-6"/> },
];

export default items;
