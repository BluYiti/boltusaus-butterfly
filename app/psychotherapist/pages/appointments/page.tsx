'use client';
<<<<<<< HEAD

import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { useEffect, useState } from "react";
import { databases } from "@/appwrite"; 
import TakeNotesModal from '@/psychotherapist/components/TakeNotesModal'; 
import CallModal from '@/psychotherapist/components/CallModal'; 
import CountdownModal from '@/psychotherapist/components/CountdownModal';
import RescheduleModal from '@/psychotherapist/components/RescheduleModal';
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import { HappeningAppointment } from "@/psychotherapist/components/HappeningAppointment";

// Define the structure of a booking document
interface Booking {
  id: string;
  clientName: string;
  date: string;
  time: string;
  status: 'happening' | 'paid' | 'missed';
  mode: 'f2f' | 'online';
}
=======
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { useEffect, useState } from "react";
import { client, databases } from "@/appwrite";
import TakeNotesModal from '@/psychotherapist/components/TakeNotesModal';
import CallModal from '@/psychotherapist/components/CallModal';
import CountdownModal from '@/psychotherapist/components/CountdownModal';
import RescheduleModal from '@/psychotherapist/components/RescheduleModal';
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c

const Appointments = () => {
  HappeningAppointment();
  const authLoading = useAuthCheck(['psychotherapist']); // Call the useAuthCheck hook
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);
=======
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("currentlyHappening");
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c
  const [isTakeNotesModalOpen, setIsTakeNotesModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
<<<<<<< HEAD
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // State for filtered bookings
  const [happeningBookings, setHappeningBookings] = useState<Booking[]>([]);
  const [paidBookings, setPaidBookings] = useState<Booking[]>([]);
  const [missedBookings, setMissedBookings] = useState<Booking[]>([]);
=======
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c

  useEffect(() => {
    const fetchData = async () => {
      try { 
        const response = await databases.listDocuments('Butterfly-Database', 'Bookings');
        const formattedData: Booking[] = response.documents.map((doc) => ({
          id: doc.$id,
          clientName: `${doc.client.firstname} ${doc.client.lastname}`,
          date: `${doc.month} ${doc.day}`,
          time: doc.slots,
          status: doc.status,
          mode: doc.mode,
        }));
<<<<<<< HEAD

        // Update state based on booking status
        setHappeningBookings(formattedData.filter((booking) => booking.status === "happening"));
        setPaidBookings(formattedData.filter((booking) => booking.status === "paid"));
        setMissedBookings(formattedData.filter((booking) => booking.status === "missed"));
        
=======
        setClientData(formattedData);
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modal handlers
  const handleTakeNotesOpen = (clientName: string) => {
    setSelectedClient(clientName);
    setIsTakeNotesModalOpen(true);
  };

  const handleCallOpen = (clientName: string) => {
    setSelectedClient(clientName);
    setIsCountdownModalOpen(true);
  };

  const handleCountdownComplete = () => {
    setIsCountdownModalOpen(false);
    setIsCallModalOpen(true);
  };

<<<<<<< HEAD
  const handleRescheduleOpen = (booking: Booking) => {
=======
  const handleRescheduleOpen = (booking) => {
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c
    setSelectedBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
<<<<<<< HEAD
    console.log('Rescheduling:', selectedBooking); // For now, just log it
=======
    console.log('Rescheduling:', selectedBooking);
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c
    setIsRescheduleModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "currentlyHappening":
        return (
          clientData.filter((booking) => booking.status === "happening").length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {clientData.filter((booking) => booking.status === "happening").map((booking, bookingIndex) => (
                <div key={bookingIndex} className="bg-green-100 rounded-lg shadow-md p-4 border-l-4 border-green-500 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-green-700">{booking.clientName}</h4>
                    <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                    <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                    <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                  </div>
                  {booking.mode === "f2f" ? (
                    <button 
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      onClick={() => handleTakeNotesOpen(booking.clientName)}
                    >
                      Take Notes
                    </button>
                  ) : (
                    <button 
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                      onClick={() => handleCallOpen(booking.clientName)}
                    >
                      Call
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No sessions are currently happening.</p>
          )
        );
      case "upcoming":
        return (
          clientData.filter((booking) => booking.status === "paid").length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {clientData.filter((booking) => booking.status === "paid").map((booking, bookingIndex) => (
                <div key={bookingIndex} className="bg-blue-50 rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700">{booking.clientName}</h4>
                  <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                  <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                  <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming bookings found.</p>
          )
        );
      case "missed":
        return (
          clientData.filter((booking) => booking.status === "missed").length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {clientData.filter((booking) => booking.status === "missed").map((booking, bookingIndex) => (
                <div key={bookingIndex} className="bg-red-50 rounded-lg shadow-md p-4 border-l-4 border-red-500 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-red-700">{booking.clientName}</h4>
                    <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                    <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                    <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                  </div>
                  <button 
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    onClick={() => handleRescheduleOpen(booking)}
                  >
                    Reschedule
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No missed bookings found.</p>
          )
        );
      case "completed":
        return (
          clientData.filter((booking) => booking.status === "completed").length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {clientData.filter((booking) => booking.status === "completed").map((booking, bookingIndex) => (
                <div key={bookingIndex} className="bg-gray-100 rounded-lg shadow-md p-4 border-l-4 border-gray-500">
                  <h4 className="font-semibold text-gray-700">{booking.clientName}</h4>
                  <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                  <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                  <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No completed sessions found.</p>
          )
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 h-screen overflow-auto">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Appointments</h2>
        </div>
        <div className="p-5 mt-20">
          {loading ? (
            <div className="text-center mt-10">
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center mt-10">{error}</div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
<<<<<<< HEAD
              {/* Currently Happening */}
              <div>
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Currently Happening</h3>
                {happeningBookings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {happeningBookings.map((booking, index) => (
                      <div key={index} className="bg-green-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-green-700">{booking.clientName}</h4>
                          <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                          <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                          <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                        </div>
                        {booking.mode === 'f2f' ? (
                          <button 
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200"
                            onClick={() => handleTakeNotesOpen(booking.clientName)}
                          >
                            Take notes
                          </button>
                        ) : (
                          <button 
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200"
                            onClick={() => handleCallOpen(booking.clientName)}
                          >
                            Call
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No ongoing appointments.</p>
                )}
              </div>

              {/* Upcoming bookings */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Upcoming bookings</h3>
                {paidBookings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {paidBookings.map((booking, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-700">{booking.clientName}</h4>
                        <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                        <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                        <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming appointments.</p>
                )}
              </div>

              {/* Missed bookings */}
              <div className="mt-6">
                <h3 className="font-semibold text-lg border-b-2 border-gray-300 pb-2">Missed bookings</h3>
                {missedBookings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 mt-4">
                    {missedBookings.map((booking, index) => (
                      <div key={index} className="bg-red-50 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-l-4 border-red-500 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-red-700">{booking.clientName}</h4>
                          <p className="text-gray-600">Date: <span className="font-semibold">{booking.date}</span></p>
                          <p className="text-gray-600">Time: <span className="font-semibold">{booking.time}</span></p>
                          <p className="text-gray-600">Mode: <span className="font-semibold">{booking.mode}</span></p>
                        </div>
                        <button 
                          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors duration-200"
                          onClick={() => handleRescheduleOpen(booking)}
                        >
                          Reschedule
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No missed appointments.</p>
                )}
=======
              {/* Tab Navigation */}
              <div className="flex border-b-2 border-gray-300 mb-5">
                <button
                  className={`px-4 py-2 ${
                    activeTab === "currentlyHappening"
                      ? "border-b-4 border-blue-500 font-semibold text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveTab("currentlyHappening")}
                >
                  Currently Happening
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "upcoming"
                      ? "border-b-4 border-blue-500 font-semibold text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming Bookings
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "missed"
                      ? "border-b-4 border-blue-500 font-semibold text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveTab("missed")}
                >
                  Missed Bookings
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "completed"
                      ? "border-b-4 border-blue-500 font-semibold text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  History of Completed Sessions
                </button>
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c
              </div>
              {/* Tab Content */}
              {renderContent()}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
<<<<<<< HEAD
      <TakeNotesModal isOpen={isTakeNotesModalOpen} onClose={() => setIsTakeNotesModalOpen(false)} />
      <CountdownModal
        isOpen={isCountdownModalOpen}
        onClose={() => setIsCountdownModalOpen(false)}
        onComplete={handleCountdownComplete} // A function to handle completion logic
        seconds={60} // Countdown duration in seconds
=======
      <TakeNotesModal
        isOpen={isTakeNotesModalOpen}
        onClose={() => setIsTakeNotesModalOpen(false)}
        clientName={selectedClient}
      />
      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        clientName={selectedClient}
      />
      <CountdownModal
        isOpen={isCountdownModalOpen}
        onClose={() => setIsCountdownModalOpen(false)}
        onComplete={handleCountdownComplete}
        seconds={5}
      />
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        onConfirm={handleConfirmReschedule}
>>>>>>> c4a971a3b4a0afadc6ebcb3967d4b612c3fd720c
      />
      <CallModal isOpen={isCallModalOpen} clientName={selectedClient} onClose={() => setIsCallModalOpen(false)} />
      <RescheduleModal isOpen={isRescheduleModalOpen} booking={selectedBooking} onConfirm={handleConfirmReschedule} onClose={() => setIsRescheduleModalOpen(false)} />
    </Layout>
  );
};

export default Appointments;
