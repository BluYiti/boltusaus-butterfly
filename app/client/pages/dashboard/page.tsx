"use client";
import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Link from "next/link";
import RescheduleModal from "@/components/Reschedule"; // Assuming you have this component

const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [missedSessions, setMissedSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const userName = "John"; // Placeholder for dynamic user data

  const mockMissedSessions = [
    {
      id: 1,
      date: "2024-10-15",
      psychotherapist: { name: "Dr. Smith", contactNumber: "123-456-7890" },
    },
    {
      id: 2,
      date: "2024-10-10",
      psychotherapist: { name: "Dr. Jane", contactNumber: "987-654-3210" },
    },
  ];

  useEffect(() => {
    // Set mock data as missed sessions
    setMissedSessions(mockMissedSessions);

    // Generate announcements from missed sessions
    const announcementMessages = mockMissedSessions.map(session => (
      `You have missed your session with ${session.psychotherapist.name}. You can reschedule an appointment at the Missed Sessions section or if you want to request a refund, please call ${session.psychotherapist.contactNumber}.`
    ));
    
    setAnnouncements(announcementMessages);
  }, []);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const firstDayOfMonth = new Date(currentYear, selectedMonth, 1).getDay();

  const handleRescheduleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between bg-blue-100">
          {/* Top Section with User Info and Header */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <FaUser size={24} />
              </div>
              <h1 className="text-xl font-semibold">
                Good Morning, <span className="font-bold">{userName}!</span>
              </h1>
            </div>
          </div>

          {/* Upcoming Sessions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-8">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <h2 className="text-bold text-xl font-bold mb-4">
                <span className="bg-blue-500 text-white p-2 px-10 rounded-lg">Upcoming Sessions</span>
              </h2>
              <div className="space-y-2 flex-grow overflow-y-auto max-h-[300px]">
                <div className="flex justify-between items-center p-2 rounded-lg text-black py-2 px-4">
                  <span className="font-bold">PLACEHOLDER FOR THE FIRST SESSION</span>
                  <span className="text-gray-600 font-semibold">Date and Time</span>
                </div>
              </div>
            </div>

            {/* Announcements & Reminders Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-4">Announcements & Reminders:</h2>
              <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px]">
                {announcements.length > 0 ? (
                  announcements.map((announcement, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                      <h3 className="font-semibold text-lg">Reminder</h3>
                      <p className="text-gray-700">{announcement}</p>
                    </div>
                  ))
                ) : (
                  <p>No announcements.</p>
                )}
              </div>
            </div>
          </div>

          {/* Missed Sessions and Calendar Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mx-8">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
              <h2 className="text-bold text-xl font-bold mb-4">
                <span className="bg-blue-500 text-white p-2 px-14 rounded-lg">Missed Sessions</span>
              </h2>
              <div className="space-y-2 flex-grow overflow-y-auto max-h-[300px]">
                {missedSessions.length > 0 ? (
                  missedSessions.map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-2 rounded-lg bg-white text-black py-2 px-4">
                      <span className="font-bold">You missed your session with {session.psychotherapist.name} on {session.date}.</span>
                      <button
                        className="bg-blue-300 font-bold text-white py-1 px-3 rounded-xl hover:bg-blue-500"
                        onClick={handleRescheduleClick}
                      >
                        Reschedule
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No missed sessions.</p>
                )}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold">Calendar</h2>
              <div className="mt-4">
                <label htmlFor="month-select" className="font-medium text-gray-700">
                  Choose a month:
                </label>
                <select
                  id="month-select"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="ml-2 p-2 border border-gray-300 rounded-lg"
                >
                  {Array.from({ length: 12 }, (_, index) => (
                    <option key={index} value={index}>
                      {new Date(0, index).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6">
                <div className="text-center">
                  <div className="text-bold text-xl font-bold">{new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}</div>
                  <div className="grid grid-cols-7 text-center mt-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-sm font-medium text-gray-700">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 text-center gap-y-4 mt-4">
                    {[...Array(new Date(currentYear, selectedMonth + 1, 0).getDate())].map((_, dayIndex) => (
                      <div key={dayIndex} className={`p-2 rounded-full cursor-pointer ${dayIndex + 1 === currentDay ? "bg-blue-500 text-white" : "text-gray-700"}`}>
                        {dayIndex + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What to do section */}
          <div className="grid grid-cols-1 gap-6 mt-6 mx-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold">What to do?</h2>
              <div className="space-y-4 mt-4">
                {/* Mood Tracker */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Mood Tracker</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">How are you feeling today?</p>
                    <Link href="/client/pages/goals">
                      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">START</button>
                    </Link>
                  </div>
                </div>

                {/* Reading Resources */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Reading Resources</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">Start your day by reading something inspiring!</p>
                    <Link href="/client/pages/explore">
                      <button className="bg-blue-500 text-white py-2 px-5 rounded hover:bg-blue-600">VIEW</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for rescheduling */}
      {showModal && (
        <RescheduleModal onClose={closeModal}>
          <img src="/mnt/data/image.png" alt="Reschedule Details" />
        </RescheduleModal>
      )}
    </Layout>
  );
};

export default Dashboard;
