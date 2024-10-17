import Link from "next/link";
import Image from "next/image";
import React from "react";
import { role } from "@/lib/role/client.data";

const Menu = ({ userId, clientId }: { userId: string; clientId: string }) => {
  const menuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/assets/icons/home.svg",
          label: "Home",
          href: `/client/${userId}/dashboard`,
          visible: ["admin", "psychotherapist", "client", "associate"],
        },
        {
          icon: "/assets/icons/goals.svg",
          label: "Goals",
          href: `/client/${userId}/goals`,
          visible: ["client"],
        },
        {
          icon: "/assets/icons/appointments.svg",
          label: "Appointments",
          href: `/client/${userId}/new-appointment`,
          visible: ["client"],
        },
      ],
    },
    {
      title: "OTHERS",
      items: [
        {
          icon: "/assets/icons/profile.svg",
          label: "Profile",
          href: `/client/profile`,
          visible: ["admin", "psychotherapist", "client", "associate"],
        },
        {
          icon: "/assets/icons/settings.svg",
          label: "Settings",
          href: "/client/settings",
          visible: ["admin", "psychotherapist", "client", "associate"],
        },
        {
          icon: "/assets/icons/logout.svg",
          label: "Logout",
          href: "/login",
          visible: ["admin", "psychotherapist", "client", "associate"],
        },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-xl hover:text-blue-300"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
      <p className="copyright mt-10 py-12">© 2024 Butterfly</p>
    </div>
  );
};

export default Menu;
