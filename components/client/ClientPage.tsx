import React from "react";
import MoodTrackerCard from "./dashboard/MoodTrackerCard";
import ClientCalendar from "./dashboard/ClientCalendar";
import Announcements from "./dashboard/Announcements";
import SetAppointmentCard from "./dashboard/SetAppointmentCard";
import StartPreAssessmentCard from "./dashboard/StartPreAssessmentCard";
import ReadingResourcesCard from "./dashboard/ReadingResourcesCard";

const ClientPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* MIDDLE */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        <StartPreAssessmentCard />
        {/* Set Appointment Card*/}
        <SetAppointmentCard />
        {/* Mood Tracker Card */}
        <MoodTrackerCard />
        {/* Reading Resources Card */}
        <ReadingResourcesCard />
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <Announcements />
        <ClientCalendar />
      </div>
    </div>
  );
};

export default ClientPage;
