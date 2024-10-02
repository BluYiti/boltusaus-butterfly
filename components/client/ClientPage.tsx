import React from "react";
import MoodTrackerCard from "./MoodTrackerCard";
import ClientCalendar from "./ClientCalendar";
import Announcements from "./Announcements";
import SetAppointmentCard from "./SetAppointmentCard";

const ClientPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* MIDDLE */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* SET APPOINTMENT CARD */}
        <SetAppointmentCard />
        {/* MOOD TRACKER CARD */}
        <MoodTrackerCard />
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <ClientCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default ClientPage;
