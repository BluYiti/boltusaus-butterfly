'use client';

import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { useEffect, useState } from "react";

const Sessions = () => {
  const [clientData, setClientData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      name: "Client A",
      upcomingSessions: [
        { clientName: "Client A", date: "2024-10-15", time: "10:00 AM" },
        { clientName: "Client A", date: "2024-10-22", time: "2:00 PM" }
      ],
      missedSessions: [
        { clientName: "Client A", date: "2024-10-01", time: "1:00 PM" }
      ]
    },
    {
      id: 2,
      name: "Client B",
      upcomingSessions: [
        { clientName: "Client B", date: "2024-10-16", time: "11:00 AM" }
      ],
      missedSessions: []
    },
    {
      id: 3,
      name: "Client C",
      upcomingSessions: [],
      missedSessions: [
        { clientName: "Client C", date: "2024-10-03", time: "3:00 PM" }
      ]
    }
  ];

  // Set mock data instead of fetching from the database
  useEffect(() => {
    setClientData(mockData);
    setLoading(false);
  }, []);

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-gray-100 h-screen overflow-auto">
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10">
          <h2 className="text-2xl font-bold">Sessions</h2>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center mt-10">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center mt-10">{error}</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Upcoming Sessions */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Upcoming Sessions</h3>
                {clientData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {clientData.map((client) => (
                      client.upcomingSessions && client.upcomingSessions.length > 0 ? (
                        client.upcomingSessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="bg-blue-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">
                            <h4 className="font-semibold text-blue-700">{session.clientName}</h4>
                            <p className="text-gray-600">Date: <span className="font-semibold">{session.date}</span></p>
                            <p className="text-gray-600">Time: <span className="font-semibold">{session.time}</span></p>
                          </div>
                        ))
                      ) : (
                        <div key={client.id} className="text-gray-500">No upcoming sessions for {client.name}</div>
                      )
                    ))}
                  </div>
                ) : (
                  <p>No client data available.</p>
                )}
              </div>

              {/* Missed Sessions */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Missed Sessions</h3>
                {clientData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {clientData.map((client) => (
                      client.missedSessions && client.missedSessions.length > 0 ? (
                        client.missedSessions.map((session, sessionIndex) => (
                          <div key={sessionIndex} className="bg-red-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-red-500 flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-red-700">{session.clientName}</h4>
                              <p className="text-gray-600">Date: <span className="font-semibold">{session.date}</span></p>
                              <p className="text-gray-600">Time: <span className="font-semibold">{session.time}</span></p>
                            </div>
                            {/* Reschedule Button */}
                            <button 
                              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200"
                            >
                              Reschedule
                            </button>
                          </div>
                        ))
                      ) : (
                        <div key={client.id} className="text-gray-500">No missed sessions for {client.name}</div>
                      )
                    ))}
                  </div>
                ) : (
                  <p>No client data available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Sessions;
