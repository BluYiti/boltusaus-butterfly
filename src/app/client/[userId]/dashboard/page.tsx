import Announcements from "@/components/Announcements";
import EventCalendar from "@/components/EventCalendar";
import Menu from "@/components/Menu";
import MoodTracker from "@/components/MoodTracker";
import NavBar from "@/components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ClientDashboard = () => {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/assets/icons/butterfly-logo-round.svg"
            alt="Butterfly Logo"
            height={32}
            width={32}
          />
          <span className="hidden lg:block">Butterfly</span>
        </Link>
        <Menu />
      </div>
      {/* MIDDLE */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Set an Appointment */}
        <div className="w-full lg:w-1/3 h-[450px]"> 
        
        </div>
        {/* Mood Tracker */}
        <div className="w-full lg:w-2/3 h-[450px]">
          <MoodTracker />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
        <NavBar />
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
