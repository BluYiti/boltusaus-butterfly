'use client';

import Layout from '@/components/Sidebar/Layout'; 
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Client, Databases } from 'appwrite';
import { format } from 'date-fns';
import items from '@/associate/data/links';

const Dashboard: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [clients, setClients] = useState<string[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Initialize Appwrite client and databases
  const client = new Client();
  const databases = new Databases(client);

  // Get current date formatted as 'Month Day, Year'
  const todayDate = format(new Date(), "MMMM d, yyyy");

  // Fetch clients, upcoming sessions, appointments, and payments from Appwrite
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await databases.listDocuments('DATABASE_ID', 'CLIENTS_COLLECTION_ID');
        setClients(clientsResponse.documents.map(doc => doc.name));

        const sessionsResponse = await databases.listDocuments('DATABASE_ID', 'SESSIONS_COLLECTION_ID');
        setUpcomingSessions(sessionsResponse.documents);

        const appointmentsResponse = await databases.listDocuments('DATABASE_ID', 'APPOINTMENTS_COLLECTION_ID');
        setAppointments(appointmentsResponse.documents);

        const paymentsResponse = await databases.listDocuments('DATABASE_ID', 'PAYMENTS_COLLECTION_ID');
        setPayments(paymentsResponse.documents);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle opening the modal
  const openModal = (client: string, session: any) => {
    setSelectedClient(client);
    setSelectedSession(session);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setSelectedClient(null);
    setSelectedSession(null);
  };

  // Function to handle rescheduling in the backend
  const handleReschedule = async () => {
    if (selectedSession) {
      try {
        await databases.updateDocument('DATABASE_ID', 'SESSIONS_COLLECTION_ID', selectedSession.$id, {
          // Update the session time or date as needed
          time: '4:00 PM', // Example new time
          date: todayDate, // Example new date
        });

        // Refresh session data after update
        const sessionsResponse = await databases.listDocuments('DATABASE_ID', 'SESSIONS_COLLECTION_ID');
        setUpcomingSessions(sessionsResponse.documents);

        closeModal();
      } catch (error) {
        console.error("Error updating session: ", error);
      }
    }
  };

  return (
    <Layout sidebarTitle="Associate" sidebarItems={items}>
    

      {/* Main Content */}
      <div className="flex-grow p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Hello, Associate!</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client List for Reschedule */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Client List for Reschedule</h3>
            <ul className="space-y-3">
              {clients.map((client, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{client}</span>
                  <button className="text-blue-500 hover:text-blue-600" onClick={() => openModal(client, upcomingSessions[index])}>
                    edit
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Sessions with Dynamic Date */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Upcoming Sessions ({todayDate})</h3>
            <ul className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                  <span>{session.name}</span>
                  <span>{session.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Appointment List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Appointment List</h3>
            <ul className="space-y-3">
              {appointments.map((appointment, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-2">
                  <span className="flex-1 text-left">{appointment.name}</span>
                  <span className="flex-1 text-center">{appointment.date}</span>
                  <span className="flex-1 text-center">{appointment.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Payment Status</h3>
            <ul className="space-y-3">
              {payments.map((payment, index) => (
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
              ))}
            </ul>
          </div>
        </div>

        {/* Modal */}
        {selectedClient && selectedSession && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              {/* Client and Therapist Information */}
              <h3 className="text-xl font-semibold mb-4">{selectedClient}</h3>
              <p>Therapist: {selectedSession.therapist || 'Unknown'}</p>

              {/* Display Selected Date */}
              <div className="my-4">
                <h4 className="font-semibold">Selected Date:</h4>
                <p>{selectedSession.date || todayDate}</p>
              </div>

              {/* Display Selected Time */}
              <div className="my-4">
                <h4 className="font-semibold">Selected Time:</h4>
                <p>{selectedSession.time || '3:00 PM'}</p>
              </div>

              {/* Cancel and Reschedule Buttons */}
              <div className="flex justify-between mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200" onClick={closeModal}>
                  Cancel
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200" onClick={handleReschedule}>
                  Reschedule
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
