'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import { databases } from '@/appwrite';
import { Query } from 'appwrite';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import items from './data/Links';
import { format } from 'date-fns'; // Import format

const AssociateDashboard: React.FC = () => {
  const { loading: authLoading } = useAuthCheck(['associate']);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true); // Separate loading state for payments
  const [selectedClient, setSelectedClient] = useState<any | null>(null); // State for selected client to reschedule
  const [newSchedule, setNewSchedule] = useState<any | null>(null); // State for new schedule details
  const [showFinalConfirm, setShowFinalConfirm] = useState(false); // State for showing the final confirmation modal

  // Get current date formatted as 'Month Day, Year'
  const todayDate = format(new Date(), 'MMMM d, yyyy');

  // Mock Data for Clients List (Client for Reschedule)
  const clientsMock = [
    { name: 'Ana Smith', status: 'for reschedule' },
    { name: 'Hev Abigail', status: 'for reschedule' },
    { name: 'Snoop Dog', status: 'for reschedule' },
    { name: 'Chris Grey', status: 'for reschedule' },
    { name: 'Ariana Grande', status: 'for reschedule' },
  ];

  const appointmentsMock = [
    { name: 'Leon Kennedy', date: 'October 10, 2024', time: '1:30 PM' },
    { name: 'Sza Padilla', date: 'October 12, 2024', time: '9:00 AM' },
  ];

  const paymentsMock = [
    { name: 'Leon Kennedy', date: 'October 4, 2024', amount: '$150', status: 'PAID' },
    { name: 'Sza Padilla', date: 'October 1, 2024', amount: '$200', status: 'PENDING' },
  ];

  // Fetch clients, upcoming sessions, appointments, and payments from Appwrite
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        setClients(clientsMock); // Using mock data for now
        setPayments(paymentsMock);
        // Fetch other data if needed from the database here...
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  // Fetch payments
useEffect(() => {
  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await databases.listDocuments(
        'Butterfly-Database', // Replace with actual database ID
        'Payment',             // Collection ID for payments
      );
      const paymentsData = response.documents.map((doc) => ({
        clientName: doc.client?.name || 'N/A', // Access client.name with a fallback if undefined
        firstname: doc.client.firstname,
        channel: doc.channel,
        status: doc.status,
      }));
      setPayments(paymentsData);
    } catch (err) {
      console.error('Failed to fetch payment data:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  fetchPayments();
}, []);

  // Function to handle client selection for reschedule
  const handleViewClient = (client: any) => {
    setSelectedClient(client); // Set selected client for rescheduling
    // Mock new schedule for demonstration purposes (This should come from user input)
    setNewSchedule({
      date: 'October 10, 2024', // Mock date
      time: '1:30 PM' // Mock time
    });
  };

  // Function to show final confirmation modal
  const handleConfirmSchedule = () => {
    setShowFinalConfirm(true); // Show the Yes/No confirmation modal
  };

  // Function to handle the final confirmation (yes)
  const handleFinalYes = async () => {
    if (newSchedule && selectedClient) {
      try {
        // Simulate database update
        await databases.updateDocument(
          'DATABASE_ID', // Replace with your actual database ID
          'APPOINTMENTS_COLLECTION_ID', // Replace with your collection ID
          selectedClient.id, // Use the actual client or appointment document ID
          {
            date: newSchedule.date,
            time: newSchedule.time,
          }
        );

        console.log(`New schedule confirmed for ${selectedClient.name} on ${newSchedule.date} at ${newSchedule.time}`);
        // Optionally, refresh the data after the update or show a success message
      } catch (error) {
        console.error('Error updating schedule: ', error);
      } finally {
        setSelectedClient(null); // Close the modal after confirmation
        setShowFinalConfirm(false); // Close the final confirmation modal
      }
    }
  };

  // Function to handle the final confirmation (no)
  const handleFinalNo = () => {
    setShowFinalConfirm(false); // Close the final confirmation modal
  };

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await databases.listDocuments(
          'Butterfly-Database', // Replace with actual database ID
          'Bookings',         // Replace with your actual collection ID
          [Query.equal('status', 'paid')] // Ensure 'status' field exists and 'paid' is correct
        );
        setSessionData(response.documents); // Store fetched sessions
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`); // Detailed error message
        console.error(err); // Log error for debugging
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchSessionData();
  }, []);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen mb-10">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Hello, Associate!</h2>
        </div>

        <div className="pt-[6.5rem]">
        <div className="grid grid-cols-2 gap-4 mx-10">

            {/* Client List for Reschedule */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-blue-500">
              <h3 className="text-xl font-semibold mb-4">Client List for Reschedule</h3>
              {loading ? (
                <div className="flex justify-center items-center">
                  <span className="text-gray-500">Loading clients...</span>
                </div>
              ) : (
                <ul className="space-y-3">
                  {clients.length > 0 ? (
                    clients.map((client, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{client.name}</span>
                      </li>
                    ))
                  ) : (
                    <div className="text-gray-500">No clients available.</div>
                  )}
                </ul>
              )}
            </div>

           {/* Upcoming Sessions Section */}
              <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold mb-4 text-blue-500">
                    Upcoming Sessions
                    <span className="text-sm text-gray-500 ml-2">
                      {format(new Date(), 'MMMM d, yyyy')}
                    </span>
                  </h3>
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

              {/* Appointment List */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-blue-500">
                <h3 className="text-xl font-semibold mb-4">Appointment List</h3>
                {loading ? (
                  <div className="flex justify-center items-center">
                    <span className="text-gray-500">Loading appointments...</span>
                  </div>
                ) : (
                  <ul className="space-y-3 text-black">
                    {sessionData.length > 0 ? (
                      sessionData.map((doc) => (
                        <li key={doc.$id}>
                          <p>{doc.client.firstname} {doc.client.lastname}</p>
                        </li>
                      ))
                    ) : (
                      <div className="text-gray-500">No appointments available.</div>
                    )}
                  </ul>
                )}
              </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-blue-500">
            <h3 className="text-xl font-semibold mb-4">
              Payment Status
              <span className="text-sm text-gray-500 ml-2">{format(new Date(), 'MMMM d, yyyy')}</span>
            </h3>
            {loadingPayments ? (
              <div className="flex justify-center items-center">
                <span className="text-gray-500">Loading payments...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                      <span className="flex-1 text-center">{payment.firstname}</span>
                      <span className="flex-1 text-center">{payment.channel}</span>
                      <span
                        className={`flex-none min-w-[90px] px-4 py-1 rounded-full text-white text-center ${
                          payment.status && payment.status.toUpperCase() === 'PAID' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </li>
                  ))
                ) : (
                  <div className="text-gray-500">No payment data available.</div>
                )}
              </ul>
            )}
          </div>
        </div>

          {/* Final Confirmation Modal (Yes/No) */}
          {showFinalConfirm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Are you sure you want to confirm this reschedule?</h3>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={handleFinalYes}
                  >
                    Yes
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
                    onClick={handleFinalNo}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AssociateDashboard;