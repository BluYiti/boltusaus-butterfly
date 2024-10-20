'use client';

import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { useEffect, useState } from "react";
import { client, databases } from "@/appwrite"; // Adjust the path accordingly
import TakeNotesModal from '@/psychotherapist/components/TakeNotesModal'; // Import TakeNotesModal

const Appointments = () => {
  const [clientData, setClientData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTakeNotesModalOpen, setTakeNotesModalOpen] = useState(false); // State for the modal

  // Fetch data from Appwrite
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments('Butterfly-Database', 'Bookings');
        const formattedData = response.documents.map((doc: any) => ({
          id: doc.$id,
          clientName: `${doc.client.firstname} ${doc.client.lastname}`, // Adjusted to access the first and last name
          date: doc.date,
          time: doc.slots,
          status: doc.status,
          mode: doc.mode,
        }));

        setClientData(formattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-gray-100 h-screen overflow-auto">
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10">
          <h2 className="text-2xl font-bold">Appointments</h2>
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
              {/* Currently Happening */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Currently Happening</h3>
                {clientData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {clientData.filter(bookings => bookings.status === "happening").map((booking, bookingIndex) => (
                      <div key={bookingIndex} className="bg-green-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-green-700">{booking.clientName}</h4>
                          <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                          <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                          <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                        </div>
                        <button 
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200"
                          onClick={() => booking.mode === 'f2f' && setTakeNotesModalOpen(true)} // Open modal for f2f mode
                        >
                          {booking.mode === 'f2f' ? 'Take notes' : 'Call'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No missed bookings found.</p>
                )}
              </div>
              
              {/* Upcoming bookings */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Upcoming bookings</h3>
                {clientData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {clientData.filter(bookings => bookings.status === "pending").map((booking, bookingIndex) => (
                      <div key={bookingIndex} className="bg-blue-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-700">{booking.clientName}</h4>
                        <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                        <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                        <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                      </div>
                    ))}  
                  </div>
                ) : (
                  <p>No upcoming bookings found.</p>
                )}
              </div>

              {/* Missed bookings */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Missed bookings</h3>
                {clientData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {clientData.filter(bookings => bookings.status === "rescheduled").map((booking, bookingIndex) => (
                      <div key={bookingIndex} className="bg-red-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-red-500 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-red-700">{booking.clientName}</h4>
                          <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                          <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                          <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                        </div>
                        <button 
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                          Reschedule
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No missed bookings found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TakeNotesModal */}
      <TakeNotesModal isOpen={isTakeNotesModalOpen} onClose={() => setTakeNotesModalOpen(false)} />
    </Layout>
  );
};

export default Appointments;
