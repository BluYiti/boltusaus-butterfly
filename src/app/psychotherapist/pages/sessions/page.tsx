'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IconButtonProps {
    icon: any; // Use the appropriate type for your icon
  }

type ClientSession = {
  initials: string;
  name: string;
  time: string;
  color: string;
};

const sessionsData: ClientSession[] = [
  { initials: "DW", name: "Denzel White", time: "8:00 AM", color: "bg-blue-300" },
  { initials: "GS", name: "Gwen Stacey", time: "10:00 AM", color: "bg-red-300" },
  { initials: "RJ", name: "Robert Junior", time: "1:00 PM", color: "bg-indigo-300" },
  { initials: "HA", name: "Hev Abigail", time: "2:00 PM", color: "bg-orange-300" },
  { initials: "TE", name: "Thomas Edison", time: "4:00 PM", color: "bg-teal-300" },
];

export default function UpcomingSessionsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Component is mounted, can use useRouter safely
  }, []);

  if (!isMounted) {
    return null; // Render nothing until component is mounted on the client
  }

  // Navigate to the call page
  const handleCallClick = (clientName: string) => {
    router.push(`./pvideocall/`);
  };

  // Navigate to the message page
  const handleMessageClick = (clientName: string) => {
    router.push(`./pchatfeature/`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button className="text-3xl" onClick={() => router.back()}>
            ⬅️
          </button>
          <h1 className="ml-4 text-2xl">Upcoming Sessions</h1>
        </div>
        <nav className="space-x-4">
          <a href="#" className="hover:text-blue-200">Dashboard</a>
          <a href="#" className="hover:text-blue-200">Client List</a>
          <a href="#" className="hover:text-blue-200">Sessions</a>
          <a href="#" className="hover:text-blue-200">Reports</a>
          <a href="#" className="hover:text-blue-200">Recordings</a>
          <a href="#" className="hover:text-blue-200">Resources</a>
          <a href="#" className="hover:text-blue-200">About</a>
        </nav>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Today</h2>
          <ul id="sessions-list">
            {sessionsData.map((session) => (
              <li key={session.name} className="flex items-center justify-between bg-gray-50 p-4 rounded-md mb-2">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${session.color} text-white font-bold`}
                  >
                    {session.initials}
                  </div>
                  <span className="ml-4 font-semibold">{session.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">{session.time}</span>
                  <button
                    onClick={() => handleCallClick(session.name)}
                    className="text-xl bg-black text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faVideo} style={{color: "#ffffff",}} size="lg" />                  
                  </button>
                  <button
                    onClick={() => handleMessageClick(session.name)}
                    className="text-xl bg-black text-white p-2 rounded-full hover:bg-gray-700"
                  >
                    💬
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
