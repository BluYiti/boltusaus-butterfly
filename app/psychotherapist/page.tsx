'use client'
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import { account, databases } from '@/appwrite';
import { Query } from 'appwrite';
import items from './data/Links';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import Calendar from '@/components/Calendar/Calendar';
import { fetchPsychoId } from '@/hooks/userService';
import { HappeningAppointment } from './components/HappeningAppointment';

// Define types for each type of data
type Client = {
  $id: string;
  firstname: string;
  lastname: string;
  state: string;
};

type Booking = {
  $id: string;
  clientId: string; // The ID of the client
  status: string; // The status of the booking (e.g., "paid", "missed")
  client?: { // Optional field for client details
    firstname: string;
    lastname: string;
  };
};


type Payment = {
  $id: string;
  client: {
    firstname: string;
    lastname: string;
  };
  psychotherapist: string;
  status: string;
};

const Dashboard: React.FC = () => {
  HappeningAppointment();
  const { loading: authLoading } = useAuthCheck(['psychotherapist']); 
  const [userName, setUserName] = useState<string | null>(null); 
  const [evaluationData, setEvaluationData] = useState<Client[]>([]); // Use Client type
  const [missedData, setMissedData] = useState<Booking[]>([]); // Use Booking type
  const [sessionData, setSessionData] = useState<Booking[]>([]); // Use Booking type
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]); // Use Payment type
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    isFirstBooking: false, 
    allowTherapistChange: true,
  });

  const router = useRouter();

  const fetchEvaluation = async () => {
    const evaluationResponse = await databases.listDocuments(
      'Butterfly-Database', // Database ID
      'Client', // Collection ID
      [Query.equal('state', 'evaluate')] // Query to filter records
    );
    
    // Map the response to the Client type
    const clients: Client[] = evaluationResponse.documents.map((doc) => ({
      $id: doc.$id,
      firstname: doc.firstname,
      lastname: doc.lastname,
      state: doc.state,
    }));
  
    setEvaluationData(clients); // Store mapped clients in state
  };
  

  const fetchUpcomingSessions = async () => {
    const sessionResponse = await databases.listDocuments(
      'Butterfly-Database', // Your database ID
      'Bookings', // Your collection ID
      [Query.equal('status', 'paid')] // Filter for paid sessions
    );
    
    // Extract client IDs from the session data
    const clientIds = sessionResponse.documents.map((booking) => booking.client.$id).filter((id) => id);
  
    // Fetch client data based on the client IDs
    const clientPromises = clientIds.map((clientId) => {
      if (!clientId) return Promise.resolve(null); // Skip missing clientIds
      return databases.getDocument('Butterfly-Database', 'Client', clientId); // Fetch the client data
    });
  
    const clientData = await Promise.all(clientPromises);
    const validClientData = clientData.filter((client) => client !== null);
  
    // Now, map the session data and merge the client information
    const sessionsWithClientNames: Booking[] = sessionResponse.documents.map((booking) => {
      const client = validClientData.find((client) => client.$id === booking.client.$id);
  
      // Map the session to the Booking type
      return {
        $id: booking.$id,
        clientId: booking.clientId, // Ensure clientId is included
        status: booking.status, // Ensure status is included
        client: {
          firstname: client?.firstname || 'Unknown', // Fallback in case client is not found
          lastname: client?.lastname || 'Unknown',  // Fallback in case client is not found
        },
      };
    });
  
    setSessionData(sessionsWithClientNames); // Update state with the correctly mapped session data
  };

  const fetchMissedSessions = async () => {
    const missedResponse = await databases.listDocuments(
      'Butterfly-Database',
      'Bookings',
      [Query.equal('status', 'missed')]  // Fetch missed sessions
    );
  
    // Extract client IDs from the missed sessions
    const missedClientIds = missedResponse.documents
      .map((booking) => booking.clientId)
      .filter((id) => id); // Filter out any null or undefined clientIds
  
    // Fetch client data based on the client IDs
    const missedClientPromises = missedClientIds.map((clientId) => {
      if (!clientId) return Promise.resolve(null); // Skip invalid client IDs
      return databases.getDocument('Butterfly-Database', 'Client', clientId); // Fetch client data
    });
  
    const missedClientData = await Promise.all(missedClientPromises);
    const validMissedClientData = missedClientData.filter((client) => client !== null);
  
    // Map missed sessions to the correct type
    const missedSessionsWithClientNames: Booking[] = missedResponse.documents.map((booking) => {
      const client = validMissedClientData.find((client) => client.$id === booking.clientId);
  
      // Ensure the clientId and status are included in the mapped data
      return {
        $id: booking.$id,  // Map all necessary fields from the original booking
        clientId: booking.clientId,  // Ensure clientId is included
        status: booking.status,  // Ensure status is included
        client: {
          firstname: client.firstname || 'Unknown',  // Fallback if client not found
          lastname: client.lastname || 'Unknown',    // Fallback if client not found
        },
      };
    });
  
    // Update state with the correctly mapped missed session data
    setMissedData(missedSessionsWithClientNames);
  };
  
  const fetchPayments = async () => {
    const user = await account.get();
    const psychoId = await fetchPsychoId(user.$id);
  
    const response = await databases.listDocuments('Butterfly-Database', 'Payment', [
      Query.equal('psychotherapist', psychoId),
      Query.equal('status', "Pending")
    ]);
  
    // Map the payment data to the Payment type
    const payments: Payment[] = response.documents.map((doc) => ({
      $id: doc.$id,
      client: {
        firstname: doc.client.firstname,
        lastname: doc.client.lastname,
      },
      psychotherapist: doc.psychotherapist,
      status: doc.status,
    }));
  
    setPaymentsData(payments); // Store mapped payments in state
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        setUserName(user.name); 
        const psychoId = await fetchPsychoId(user.$id);
        
        setAppointmentData(prevData => ({
          ...prevData,
          selectedTherapist: psychoId,
        }));

        fetchEvaluation();
        fetchUpcomingSessions();
        fetchMissedSessions();
        fetchPayments();

      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
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

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen mb-10">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-3xl font-bold text-blue-400">
            Welcome, {userName ? userName : "Client"}!
          </h2>
        </div>

        <div className="pt-[6.5rem]">
          <div className="grid grid-cols-3 gap-4 mx-10">
            {/* To Be Evaluated Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg max-h-96 overflow-y-auto">
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
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg max-h-96 overflow-y-auto">
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
                      <p>{doc.client.firstname} {doc.client.lastname}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Missed Appointments Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg max-h-96 overflow-y-auto">
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
                      <p>{doc.client.firstname} {doc.client.lastname}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
              isTherapistSelected={true} 
              selectedTherapistId={appointmentData.selectedTherapist}
              >
            </Calendar>
          </div>

          {/* Payments Status Section */}
          <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold mb-4 text-yellow-500">Pending Payments</h3>
              <button
                  onClick={handleViewPaymentClick}
                  className="bg-blue-400 rounded-full text-white px-2 py-1 hover:bg-blue-600 transition -mt-2"
                >
                  View List
                </button>
            </div>
              <ul>
                {paymentsData.map((doc) => (
                  <li key={doc.$id}>
                    <p>{doc.client.firstname} {doc.client.lastname}</p>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
