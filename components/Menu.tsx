import Link from "next/link";
import Image from "next/image";
import React from "react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/assets/icons/home.svg",
        label: "Home",
        href: "/client/dashboard",
      },
      {
        icon: "/assets/icons/appointments.svg",
        label: "Appointments",
        href: "/client/appointments",
      },
    ],
  },
  {
    title: "OTHERS",
    items: [
      {
        icon: "/assets/icons/profile.svg",
        label: "Profile",
        href: "/client/profile",
      },
      {
        icon: "/assets/icons/settings.svg",
        label: "Settings",
        href: "/client/settings",
      },
      {
        icon: "/assets/icons/logout.svg",
        label: "Logout",
        href: "/login",
      },
    ],
  },
];
const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2">
              <Image src={item.icon} alt="" width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
