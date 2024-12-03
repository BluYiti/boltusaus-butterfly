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

type Client = {
  $id: string;
  firstname: string;
  lastname: string;
  state: string;
};

type Booking = {
  $id: string;
  clientId: string;
  status: string;
  client?: {
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
  const authLoading = useAuthCheck(['psychotherapist']);
  const [userName, setUserName] = useState<string | null>(null);
  const [evaluationData, setEvaluationData] = useState<Client[]>([]);
  const [missedData, setMissedData] = useState<Booking[]>([]);
  const [sessionData, setSessionData] = useState<Booking[]>([]);
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [psychoId, setPsychoId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);  // General loading state
  const [loadingUpcomingSessions, setLoadingUpcomingSessions] = useState<boolean>(true); // Track loading state for upcoming sessions
  const [loadingMissedSessions, setLoadingMissedSessions] = useState<boolean>(true);  // Track loading state for missed sessions
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true); // Track loading state for payments
  
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
    try {
      const evaluationResponse = await databases.listDocuments(
        'Butterfly-Database', 
        'Client', 
        [Query.equal('state', 'evaluate')] 
      );
      
      const clients: Client[] = evaluationResponse.documents.map((doc) => ({
        $id: doc.$id,
        firstname: doc.firstname,
        lastname: doc.lastname,
        state: doc.state,
      }));
    
      setEvaluationData(clients); 
    } catch (error) {
      setError('Failed to fetch evaluation data');
    }
  };

  const fetchUpcomingSessions = async () => {
    setLoadingUpcomingSessions(true); // Set loading state for upcoming sessions
    try {
      const sessionResponse = await databases.listDocuments(
        'Butterfly-Database', 
        'Bookings', 
        [Query.equal('status', 'paid')] 
      );
      
      const clientIds = sessionResponse.documents.map((booking) => booking.client.$id).filter((id) => id);
    
      const clientPromises = clientIds.map((clientId) => {
        if (!clientId) return Promise.resolve(null);
        return databases.getDocument('Butterfly-Database', 'Client', clientId);
      });
    
      const clientData = await Promise.all(clientPromises);
      const validClientData = clientData.filter((client) => client !== null);
    
      const sessionsWithClientNames: Booking[] = sessionResponse.documents.map((booking) => {
        const client = validClientData.find((client) => client.$id === booking.client.$id);
        return {
          $id: booking.$id,
          clientId: booking.clientId,
          status: booking.status,
          client: {
            firstname: client?.firstname || 'Unknown',
            lastname: client?.lastname || 'Unknown',
          },
        };
      });
    
      setSessionData(sessionsWithClientNames);
    } catch (error) {
      setError('Failed to fetch upcoming sessions');
    } finally {
      setLoadingUpcomingSessions(false); // Set loading state to false after data is fetched
    }
  };

  const fetchMissedSessions = async () => {
    setLoadingMissedSessions(true); // Set loading state for missed sessions
    try {
      const missedResponse = await databases.listDocuments(
        'Butterfly-Database',
        'Bookings',
        [Query.equal('status', 'missed')]
      );
    
      const missedClientIds = missedResponse.documents
        .map((booking) => booking.clientId)
        .filter((id) => id);
    
      const missedClientPromises = missedClientIds.map((clientId) => {
        if (!clientId) return Promise.resolve(null);
        return databases.getDocument('Butterfly-Database', 'Client', clientId);
      });
    
      const missedClientData = await Promise.all(missedClientPromises);
      const validMissedClientData = missedClientData.filter((client) => client !== null);
    
      const missedSessionsWithClientNames: Booking[] = missedResponse.documents.map((booking) => {
        const client = validMissedClientData.find((client) => client.$id === booking.clientId);
        return {
          $id: booking.$id,
          clientId: booking.clientId,
          status: booking.status,
          client: {
            firstname: client.firstname || 'Unknown',
            lastname: client.lastname || 'Unknown',
          },
        };
      });
    
      setMissedData(missedSessionsWithClientNames);
    } catch (error) {
      setError('Failed to fetch missed sessions');
    } finally {
      setLoadingMissedSessions(false); // Set loading state to false after data is fetched
    }
  };

  const fetchPayments = async () => {
    setLoadingPayments(true); // Set loading state for payments
    try {
      const user = await account.get();
      const psychoId = await fetchPsychoId(user.$id);
      
      // Step 1: Get documents by psychotherapist
      const psychotherapistResponse = await databases.listDocuments('Butterfly-Database', 'Payment', [
        Query.equal('psychotherapist', psychoId)
      ]);
      
      // Step 2: Filter the documents by status
      const pendingPayments = psychotherapistResponse.documents.filter(document => document.status === 'pending');
      
      const payments: Payment[] = pendingPayments.map((doc) => ({
        $id: doc.$id,
        client: {
          firstname: doc.client.firstname,
          lastname: doc.client.lastname,
        },
        psychotherapist: doc.psychotherapist,
        status: doc.status,
      }));
      
      setPaymentsData(payments);
    } catch (error) {
      setError('Failed to fetch payments');
    } finally {
      setLoadingPayments(false); // Set loading state to false after data is fetched
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        setUserName(user.name); 
        const psychoId = await fetchPsychoId(user.$id);
        setPsychoId(psychoId);
        
        setAppointmentData((prevData) => ({
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

  if (authLoading || loading || loadingUpcomingSessions || loadingMissedSessions || loadingPayments) {
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
              selectedTherapistId={psychoId}
              isTherapistSelected={true} 
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