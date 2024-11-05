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

// Define types for the availability response
interface Availability {
  date: string;
  slotsAvailable: number;
}

const Dashboard: React.FC = () => {
  const { loading: authLoading } = useAuthCheck(['psychotherapist']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(true); // State to track if data is still loading
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [evaluationData, setEvaluationData] = useState<any[]>([]);
  const [missedData, setMissedData] = useState<any[]>([]);
  const [sessionData, setSessionData] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [slotsInfo, setSlotsInfo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [year, setYear] = useState(date.getFullYear());
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
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getAvailabilityForDate = (date: Date) => {
    const formattedDate = formatDate(date);
    const availabilityForDate = availability.find((item) => item.date === formattedDate);
    return availabilityForDate ? availabilityForDate.slotsAvailable : null;
  };

  const handleDateClick = (value: Date) => {
    const slotsAvailable = getAvailabilityForDate(value);
    setSlotsInfo(slotsAvailable !== null ? slotsAvailable : null);
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
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Hello, Psychotherapist!</h2>
        </div>

        <div className="pt-10">
          <div className="grid grid-cols-3 gap-4 mx-10">
            {/* To Be Evaluated Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-4 text-blue-500">To be Evaluated</h3>
                <button
                  onClick={handleViewListClick}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition -mt-2"
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
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition -mt-2"
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
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition -mt-2"
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

          {/* Availability Calendar */}
          <div className="grid grid-cols-3 gap-4 mt-8 mx-10">
            <div className="col-span-2 bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-500">Availability Calendar</h3>

              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                  className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
                  aria-label="Previous Month"
                >
                  <FaChevronLeft />
                </button>
                <h4 className="font-semibold">
                  {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </h4>
                <button
                  onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                  className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
                  aria-label="Next Month"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2 text-gray-500 font-semibold">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={index} className="text-center font-semibold">{day}</div>
                ))}
              </div>

              {/* Calendar Weeks */}
              <div className="grid grid-cols-7 gap-2">
                {currentMonthWeeks.map((weekDate, index) => {
                  const isOutsideMonth = weekDate.getMonth() !== date.getMonth();
                  const slotsAvailable = getAvailabilityForDate(weekDate);

                  return (
                    <button
                      key={index}
                      className={`p-2 text-center rounded transition
                        ${isOutsideMonth ? 'text-gray-400' : ''}
                        ${slotsAvailable === null ? 'bg-gray-200 cursor-not-allowed' : ''}
                        ${slotsAvailable === 0 ? 'bg-red-200' : ''}
                        ${slotsAvailable > 0 ? 'bg-blue-200 hover:bg-blue-300' : ''}
                      `}
                      disabled={slotsAvailable === null}
                      onClick={() => {
                        if (slotsAvailable !== null) {
                          handleDateClick(weekDate);
                        }
                      }}
                      aria-label={`Date ${weekDate.getDate()} ${slotsAvailable ? `(${slotsAvailable} slots available)` : 'No slots available'}`}
                    >
                      {weekDate.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Slots Information */}
              {loading ? (
                <p className="mt-4 animate-pulse text-blue-600">Loading availability...</p>
              ) : slotsInfo !== null && (
                <p className="mt-4 text-blue-400">
                  {slotsInfo === 0
                    ? 'No slots available for the selected date.'
                    : `${slotsInfo} slots available for the selected date.`}
                </p>
              )}
            </div>

            {/* Payments Status Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-green-500">Payments Status</h3>
              <p>Placeholder for payments status data fetched from Appwrite.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
