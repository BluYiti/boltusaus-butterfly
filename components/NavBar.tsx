import React from "react";
import Image from "next/image";

const NavBar = () => {
  return (
    <div className="bg-light-200 flex items-center justify-between p-4">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          height={16}
          width={16}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-[200px] p-2 bg-transparent outline-none"
        ></input>
      </div>
      {/* Icons and User */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-light-200 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/assets/icons/chat.svg"
            alt="Chat"
            height={20}
            width={20}
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-400 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="bg-light-200 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/assets/icons/notification.svg"
            alt="Notifications"
            height={20}
            width={20}
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-red-400 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">Butterfly</span>
          <span className="text-[10px] text-gray-500 text-right">Client</span>
        </div>
        <Image
          src="/assets/icons/butterfly-black&blue.svg"
          alt="Profile"
          height={36}
          width={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default NavBar;
