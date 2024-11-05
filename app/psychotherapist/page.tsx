'use client'
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { databases } from '@/appwrite';
import { Query } from 'appwrite';
import items from './data/Links';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import Calendar from '@/components/Calendar/Calendar';

const Dashboard: React.FC = () => {
  const { loading: authLoading } = useAuthCheck(['psychotherapist']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(true); // State to track if data is still loading
  const [date, setDate] = useState(new Date());
  const [evaluationData, setEvaluationData] = useState<any[]>([]);
  const [missedData, setMissedData] = useState<any[]>([]);
  const [sessionData, setSessionData] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [slotsInfo, setSlotsInfo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [year, setYear] = useState(date.getFullYear());

  const today = new Date();
  const currentYear = today.getFullYear();
  const selectedMonth = today.toLocaleString('default', { month: 'long' });
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1)).toLocaleString('default', { month: 'long' });
  const [appointmentData, setAppointmentData] = useState({
    selectedMonth,
    selectedDay: null,
    selectedTime: null,
    selectedTherapist: null,
    selectedMode: null,
    appointmentBooked: false,
    isFirstBooking: false, // Track if this is the first booking
    allowTherapistChange: true, // Control therapist selection ability
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch evaluation data
        const evaluationResponse = await databases.listDocuments(
          'Butterfly-Database', // Replace with your database ID
          'Client', // Replace with your Client collection ID
          [Query.equal('state', 'evaluate')]
        );
        setEvaluationData(evaluationResponse.documents); // Save the fetched data
    
        // Fetch paid session data
        const sessionResponse = await databases.listDocuments(
          'Butterfly-Database', // Replace with your database ID
          'Bookings', // Replace with your Bookings collection ID
          [Query.equal('status', 'paid')]
        );
        setSessionData(sessionResponse.documents);
    
        // Log session response for debugging
        console.log("Session Response:", sessionResponse.documents);
    
        // Extract client IDs from paid sessions
        const clientIds = sessionResponse.documents.map(booking => booking.clientId).filter(id => id);
        console.log("Client IDs from paid sessions:", clientIds);
    
        // Fetch client data based on the client IDs from paid sessions
        const clientPromises = clientIds.map(clientId => {
          if (!clientId) {
            console.warn("Empty clientId found, skipping fetch."); // Warn about missing clientId
            return Promise.resolve(null); // Return a resolved promise for missing IDs
          }
          return databases.getDocument('Butterfly-Database', 'Client', clientId); // Ensure 'Client' is correct
        });
    
        // Resolve all promises and extract client names for paid sessions
        const clientData = await Promise.all(clientPromises);
    
        // Filter out any null results
        const validClientData = clientData.filter(client => client !== null);
    
        // Merge client names into the paid session data
        const sessionsWithClientNames = sessionResponse.documents.map(booking => {
          const client = validClientData.find(client => client.$id === booking.clientId);
          return {
            ...booking,
            firstname: client?.firstname || 'Unknown', // Fallback in case client not found
            lastname: client?.lastname || 'Unknown',
          };
        });
    
        setSessionData(sessionsWithClientNames); // Update session data with client names
  
        // Fetch missed bookings
        const missedResponse = await databases.listDocuments(
          'Butterfly-Database', // Replace with your database ID
          'Bookings', // Replace with your Bookings collection ID
          [Query.equal('status', 'missed')]
        );
        setMissedData(missedResponse.documents); // Save the missed booking data
  
        // Extract client IDs from missed sessions
        const missedClientIds = missedResponse.documents.map(booking => booking.clientId).filter(id => id);
        console.log("Client IDs from missed sessions:", missedClientIds);
  
        // Fetch client data based on the client IDs from missed sessions
        const missedClientPromises = missedClientIds.map(clientId => {
          if (!clientId) {
            console.warn("Empty clientId found in missed bookings, skipping fetch."); // Warn about missing clientId
            return Promise.resolve(null); // Return a resolved promise for missing IDs
          }
          return databases.getDocument('Butterfly-Database', 'Client', clientId); // Ensure 'Client' is correct
        });
    
        // Resolve all promises and extract client names for missed sessions
        const missedClientData = await Promise.all(missedClientPromises);
    
        // Filter out any null results
        const validMissedClientData = missedClientData.filter(client => client !== null);
    
        // Merge client names into the missed session data
        const missedSessionsWithClientNames = missedResponse.documents.map(booking => {
          const client = validMissedClientData.find(client => client.$id === booking.clientId);
          return {
            ...booking,
            firstname: client?.firstname || 'Unknown', // Fallback in case client not found
            lastname: client?.lastname || 'Unknown',
          };
        });
  
        setMissedData(missedSessionsWithClientNames); // Update missed data with client names
      } catch (err) {
        setError('Failed to fetch evaluation data.'); // Set an error message
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };
  
    fetchData();
  }, []);

  const handleViewListClick = () => {
    router.push(`/psychotherapist/pages/clients?tab=To%20Be%20Evaluated`);
  };

  const handleViewUpcomingListClick = () => {
    router.push(`/psychotherapist/pages/appointments`);
  };

  const handleViewPaymentClick = () => {
    router.push(`/psychotherapist/pages/clientspayment`);
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getCurrentMonthWeeks = (currentDate: Date) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const weekStart = new Date(startOfMonth);
    weekStart.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    const weeks = [];
    let dateIterator = weekStart;

    while (dateIterator <= endOfMonth || dateIterator.getDay() !== 0) {
      weeks.push(new Date(dateIterator));
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    return weeks;
  };

  const currentMonthWeeks = getCurrentMonthWeeks(date);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Hello, Psychotherapist!</h2>
        </div>

        <div className="pt-24">
          <div className="grid grid-cols-3 gap-4 mx-10">
            {/* To Be Evaluated Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4 text-blue-500">To be Evaluated</h3>
                <button
                  onClick={handleViewListClick}
                  className="bg-blue-400 rounded-full text-white px-2 py-1 hover:bg-blue-600 transition -mt-2"
                >
                  View List
                </button>
              </div>
              {loading ? (
                <p className="text-blue-600">Loading evaluation data...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ul>
                  {evaluationData.map((doc) => (
                    <li key={doc.$id}>
                      <p>{doc.firstname} {doc.lastname}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Upcoming Sessions Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4 text-blue-500">Upcoming Sessions</h3>
                <button
                  onClick={handleViewUpcomingListClick}
                  className="bg-blue-400 rounded-full text-white px-2 py-1 hover:bg-blue-600 transition -mt-2"
                >
                  View List
                </button>
              </div>
              {loading ? (
                <p className="text-blue-600">Loading upcoming session data...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ul>
                  {sessionData.map((doc) => (
                    <li key={doc.$id}>
                      <p>{doc.client.firstname} {doc.client.lastname}</p> {/* Access client names directly */}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Missed Appointments Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4 text-blue-500">Missed Appointments</h3>
                <button
                  onClick={handleViewUpcomingListClick}
                  className="bg-blue-400 rounded-full text-white px-2 py-1 hover:bg-blue-600 transition -mt-2"
                >
                  View List
                </button>
              </div>
              {loading ? (
                <p className="text-blue-600">Loading missed session data...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <ul>
                  {missedData.map((doc) => (
                    <li key={doc.$id}>
                      <p>{doc.client.firstname} {doc.client.lastname}</p> {/* Access client names directly */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8 mx-10">
            {/* Availability Calendar */}
            <div className='col-span-2 bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg'>
              <Calendar
                currentMonth={selectedMonth}
                nextMonth={nextMonth}
                currentDate={today.getDate()}
                currentYear={currentYear}
                selectedDay={appointmentData.selectedDay}
                setSelectedDay={(day) => setAppointmentData((prev) => ({ ...prev, selectedDay: day }))}
                selectedMonth={appointmentData.selectedMonth}
                setSelectedMonth={(month) => setAppointmentData((prev) => ({ ...prev, selectedMonth: month, selectedDay: null }))}
                selectedTime={appointmentData.selectedTime}
                setSelectedTime={(time) => setAppointmentData((prev) => ({ ...prev, selectedTime: time }))}
                isTherapistSelected={!!appointmentData.selectedTherapist}>
              </Calendar>
            </div>

            {/* Payments Status Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4 text-green-500">Payments Status</h3>
                <button
                    onClick={handleViewPaymentClick}
                    className="bg-blue-400 rounded-full text-white px-2 py-1 hover:bg-blue-600 transition -mt-2"
                  >
                    View List
                  </button>
              </div>
              <p>Placeholder for payments status data fetched from Appwrite.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
