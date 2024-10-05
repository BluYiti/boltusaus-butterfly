'use client'; 

import React, { useState } from 'react';
import Link from 'next/link';

const PaymentsHistory: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  // List of clients with their therapists
  const clients = [
    { name: 'Bella Swan', therapist: 'Mrs. Angelica Peralta' },
    { name: 'Michael Bieber', therapist: 'Mrs. Angelica Peralta' },
    { name: 'Nicki Minaj', therapist: 'Mr. Dwayne Carter' },
    // Add more clients here as needed
  ];

  // Example payment history data for the selected client
  const samplePaymentHistory = [
    { date: '10/03/24', time: '9:30 - 10:30 AM', amount: 'PHP 1,000.00', mode: 'GCash', status: 'pending' },
    { date: '09/10/24', time: '9:30 - 10:30 AM', amount: 'PHP 1,000.00', mode: 'GCash', status: 'refunded' },
    { date: '09/02/24', time: '3:00 - 4:05 PM', amount: 'PHP 1,000.00', mode: 'GCash', status: 'successful' },
    { date: '08/21/24', time: '9:00 - 4:00 PM', amount: 'PHP 1,000.00', mode: 'GCash', status: 'successful' },
  ];

  // Open payment history modal
  const openHistoryModal = (clientName: string) => {
    setSelectedClient(clientName);
    setPaymentHistory(samplePaymentHistory); // Replace with real data when available
  };

  // Close payment history modal
  const closeModal = () => {
    setSelectedClient(null);
    setPaymentHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation Bar */}
      <aside className="bg-white w-60 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-blue-400 mb-8">Butterfly</h1>
        <nav className="space-y-4">
        <Link href="/associate/pages/dashboard">
            <button className="block text-gray-600 hover:text-blue-400">Home</button>
          </Link>
          <Link href="/associate/pages/payments">
            <button className="block text-blue-400">Payments</button>
          </Link>
          <button className="block text-gray-600 hover:text-blue-400">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>

        <div className="grid grid-cols-1 gap-4">
          {clients.map((client, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 flex justify-between items-center">
              <span>{client.name}</span>
              <button
                className="bg-blue-400 text-white px-4 py-2 rounded"
                onClick={() => openHistoryModal(client.name)}
              >
                View History
              </button>
            </div>
          ))}
        </div>

        {/* Modal for Payment History */}
        {selectedClient && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">  {/* Increased width */}
                <h3 className="text-xl font-semibold mb-4">{selectedClient}</h3>
                <p className="text-gray-700 mb-6">
                  Under {clients.find(client => client.name === selectedClient)?.therapist}
                </p>

                {/* Payment History Table */}
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-600">
                      <th className="py-3">Date</th>
                      <th className="py-3">Time</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((history, index) => (
                      <tr key={index}>
                        <td className="py-2">{history.date}</td>
                        <td className="py-2">{history.time}</td>
                        <td className="py-2">{history.amount}</td>
                        <td
                          className={`py-2 ${
                            history.status === 'successful'
                              ? 'text-green-500'
                              : history.status === 'pending'
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                        >
                          {history.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Close Button */}
                <div className="flex justify-end mt-6">
                  <button className="bg-red-500 text-white px-6 py-2 rounded" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          
      </div>
    </div>
  );
};

export default PaymentsHistory;
