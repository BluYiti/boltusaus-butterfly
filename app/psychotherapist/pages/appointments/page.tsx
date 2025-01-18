'use client';

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

const Appointments = () => {
  HappeningAppointment();
  const authLoading = useAuthCheck(['psychotherapist']); // Call the useAuthCheck hook
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTakeNotesModalOpen, setIsTakeNotesModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isCountdownModalOpen, setIsCountdownModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // State for filtered bookings
  const [happeningBookings, setHappeningBookings] = useState<Booking[]>([]);
  const [paidBookings, setPaidBookings] = useState<Booking[]>([]);
  const [missedBookings, setMissedBookings] = useState<Booking[]>([]);

  // Fetch data from Appwrite
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

        // Update state based on booking status
        setHappeningBookings(formattedData.filter((booking) => booking.status === "happening"));
        setPaidBookings(formattedData.filter((booking) => booking.status === "paid"));
        setMissedBookings(formattedData.filter((booking) => booking.status === "missed"));
        
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

  const handleRescheduleOpen = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    console.log('Rescheduling:', selectedBooking); // For now, just log it
    setIsRescheduleModalOpen(false);
    // Optionally, refresh the data or update the state
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TakeNotesModal isOpen={isTakeNotesModalOpen} onClose={() => setIsTakeNotesModalOpen(false)} />
      <CountdownModal
        isOpen={isCountdownModalOpen}
        onClose={() => setIsCountdownModalOpen(false)}
        onComplete={handleCountdownComplete} // A function to handle completion logic
        seconds={60} // Countdown duration in seconds
      />
      <CallModal isOpen={isCallModalOpen} clientName={selectedClient} onClose={() => setIsCallModalOpen(false)} />
      <RescheduleModal isOpen={isRescheduleModalOpen} booking={selectedBooking} onConfirm={handleConfirmReschedule} onClose={() => setIsRescheduleModalOpen(false)} />
    </Layout>
  );
};

export default Appointments;
