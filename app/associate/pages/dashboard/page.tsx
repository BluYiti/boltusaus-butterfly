"use client"; 

import React, { useState } from 'react';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Function to handle opening the modal
  const openModal = (client: string) => {
    setSelectedClient(client);
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setSelectedClient(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation Bar */}
      <aside className="bg-white w-60 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Butterfly</h1>
        <nav className="space-y-4">
        <Link href="/associate/pages/dashboard">
            <button className="block text-blue-400">Home</button>
          </Link>
          <Link href="/associate/pages/payments">
            <button className="block text-gray-600 hover:text-blue-400">Payments</button>
          </Link>
          <button className="block text-gray-600 hover:text-blue-400">Logout</button>
        </nav>
      </aside>

      
      {/* Main Content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-semibold mb-6">Hello, Associate!</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Client for Reschedule */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Client List for Reschedule</h3>
            <ul className="space-y-4">
              {['Ana Smith', 'Hev Abigail', 'Snoop Dog', 'Chris Grey', 'Ariana Grande'].map((client, index) => (
                <li key={index} className="flex justify-between">
                  <span>{client}</span>
                  <button className="text-blue-400" onClick={() => openModal(client)}>
                    edit
                  </button>
                </li>
              ))}
            </ul>
          </div>

           {/* Upcoming Sessions */}
           <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Upcoming Sessions (October 4, 2024)</h3>
            <ul className="space-y-4">
              <li className="flex justify-between bg-gray-100 rounded-full px-4 py-2">
                <span>Nicki Minaj</span>
                <span>9:30 AM</span>
              </li>
              <li className="flex justify-between bg-gray-100 rounded-full px-4 py-2">
                <span>Leon Kennedy</span>
                <span>11:30 AM</span>
              </li>
            </ul>
          </div>

                  {/* Appointment List */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold mb-4">Appointment List</h3>
            <div className="space-y-2">
              <ul className="space-y-4">
                {[
                  { name: 'Leon Kennedy', date: 'October 10, 2024', time: '1:30 PM' },
                  { name: 'Sza Padilla', date: 'October 12, 2024', time: '9:00 AM' },
                  { name: 'Case Oh', date: 'October 14, 2024', time: '11:30 AM' },
                  { name: 'Ashley Graham', date: 'October 15, 2024', time: '3:00 PM' },
                  { name: 'Nicki Minaj', date: 'October 16, 2024', time: '9:00 AM' },
                  { name: 'Cardi B', date: 'October 16, 2024', time: '11:30 AM' },
                  { name: 'Jennie Kim', date: 'October 16, 2024', time: '1:30 PM' },
                  { name: 'Denzel White', date: 'October 17, 2024', time: '9:00 AM' },
                  { name: 'Angel Wong', date: 'October 17, 2024', time: '11:30 AM' },
                ].map((appointment, index) => (
                  <li 
                    key={index} 
                    className="flex justify-between items-center bg-gray-100 rounded-full px-4 py-2"
                  >
                    <span className="flex-1 text-left">{appointment.name}</span>
                    <span className="flex-1 text-center">{appointment.date}</span>
                    <span className="flex-1 text-center">{appointment.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* Payment Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Payment Status</h3>
            <div className="space-y-2">
              <ul className="space-y-4">
                {[
                  { name: 'Ana Smith', date: '10/05/2024', amount: 'PHP 1,500', status: 'PAID' },
                  { name: 'Hev Abigail', date: '10/04/2024', amount: 'PHP 1,000', status: 'PAID' },
                  { name: 'Snoop Dog', date: '10/04/2024', amount: 'PHP 1,500', status: 'PENDING' },
                  { name: 'Snoop Dog', date: '10/04/2024', amount: 'PHP 1,000', status: 'PENDING' },
                ].map((payment, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 rounded-full px-4 py-2">
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
        </div>

        {/* Modal */}
            {selectedClient && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  {/* Client and Therapist Information */}
                  <h3 className="text-xl font-semibold mb-4">{selectedClient}</h3>
                  <p>Therapist: Mrs. Angelica Peralta</p>

                  {/* Display Selected Date */}
                  <div className="my-4">
                    <h4 className="font-semibold">Selected Date:</h4>
                    <p>October 4, 2024</p>  {/* Replace this with the actual selected date variable */}
                  </div>

                  {/* Display Selected Time */}
                  <div className="my-4">
                    <h4 className="font-semibold">Selected Time:</h4>
                    <p>3:00 PM</p>  {/* Replace this with the actual selected time variable */}
                  </div>

                  {/* Cancel and Reschedule Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button className="bg-blue-400 text-white px-4 py-2 rounded">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            )}



      </div>
    </div>
  );
};

export default Dashboard;