'use client';

import Layout from '@/components/Sidebar/Layout';
import React, { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import { format } from 'date-fns';
import items from '@/associate/data/Links';

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any | null>(null); // State for selected client to reschedule
  const [newSchedule, setNewSchedule] = useState<any | null>(null); // State for new schedule details
  const [showFinalConfirm, setShowFinalConfirm] = useState(false); // State for showing the final confirmation modal

  // Initialize Appwrite client and databases
  const client = new Client();
  const databases = new Databases(client);

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

  // Mock data for upcoming sessions, appointments, and payments
  const upcomingSessionsMock = [
    { name: 'Leon Kennedy', time: '1:30 PM', therapist: 'Mrs. Angelica Peralta' },
    { name: 'Sza Padilla', time: '9:00 AM', therapist: 'Mrs. Angelica Peralta' },
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
        setUpcomingSessions(upcomingSessionsMock);
        setAppointments(appointmentsMock);
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

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="flex-grow p-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-3xl font-bold text-blue-500">Hello, Associate!</h2>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client List for Reschedule */}
          <div className="bg-white rounded-lg shadow-lg p-6">
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
                      <button
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => handleViewClient(client)}
                      >
                        view
                      </button>
                    </li>
                  ))
                ) : (
                  <div className="text-gray-500">No clients available.</div>
                )}
              </ul>
            )}
          </div>

          {/* Upcoming Sessions with Dynamic Date */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Sessions ({todayDate})</h3>
            {loading ? (
              <div className="flex justify-center items-center">
                <span className="text-gray-500">Loading sessions...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                      <span>{session.name}</span>
                      <span>{session.time}</span>
                    </li>
                  ))
                ) : (
                  <div className="text-gray-500">No upcoming sessions.</div>
                )}
              </ul>
            )}
          </div>

          {/* Appointment List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Appointment List</h3>
            {loading ? (
              <div className="flex justify-center items-center">
                <span className="text-gray-500">Loading appointments...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                      <span className="flex-1 text-left">{appointment.name}</span>
                      <span className="flex-1 text-center">{appointment.date}</span>
                      <span className="flex-1 text-center">{appointment.time}</span>
                    </li>
                  ))
                ) : (
                  <div className="text-gray-500">No appointments available.</div>
                )}
              </ul>
            )}
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Payment Status</h3>
            {loading ? (
              <div className="flex justify-center items-center">
                <span className="text-gray-500">Loading payments...</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {payments.length > 0 ? (
                  payments.map((payment, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                      <span className="flex-1 text-center">{payment.name}</span>
                      <span className="flex-1 text-center">{payment.date}</span>
                      <span className="flex-1 text-center">{payment.amount}</span>
                      <span
                        className={`flex-none px-4 py-1 rounded-full text-white text-center ${
                          payment.status === 'PAID' ? 'bg-green-500' : 'bg-yellow-500'
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

        {/* Modal for Confirming Reschedule */}
        {selectedClient && newSchedule && !showFinalConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Confirm Reschedule for {selectedClient.name}</h3>
              <p><strong>Therapist:</strong> Mrs. Angelica Peralta</p>
              <p><strong>New Date:</strong> {newSchedule.date}</p>
              <p><strong>New Time:</strong> {newSchedule.time}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={handleConfirmSchedule}
                >
                  Confirm
                </button>
                <button
                  className="text-gray-500 ml-4"
                  onClick={() => setSelectedClient(null)} // Close the modal
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
    </Layout>
  );
};

export default Dashboard;
