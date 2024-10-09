'use client';

import React, { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import items from '@/associate/data/Links';
import Layout from '@/components/Sidebar/Layout';
import { CSSTransition, SwitchTransition } from 'react-transition-group'; // For slide transitions

const PaymentsHistory: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  
  // Mock data for clients
  const mockClients = [
    { id: 1, name: 'Bella Swan', status: 'current', therapist: 'Mrs. Angelica Peralta' },
    { id: 2, name: 'Edward Cullen', status: 'referred', therapist: 'Mr. Jacob Black' },
    { id: 3, name: 'Alice Cullen', status: 'current', therapist: 'Mrs. Rosalie Hale' },
  ];

  // Mock payment history data
  const mockPaymentHistory = [
    {
      clientId: 1,
      history: [
        { date: '10/03/24', time: '9:30 - 10:30 AM', amount: 'PHP 1,000.00', modeOfPayment: 'GCash', status: 'pending' },
        { date: '09/10/24', time: '9:30 - 10:30 AM', amount: 'PHP 1,000.00', modeOfPayment: 'GCash', status: 'refunded' },
        { date: '08/02/24', time: '3:00 - 4:05 PM', amount: 'PHP 1,000.00', modeOfPayment: 'GCash', status: 'successful' },
        { date: '08/21/24', time: '9:00 - 4:00 PM', amount: 'PHP 1,000.00', modeOfPayment: 'GCash', status: 'successful' },
      ],
    },
    {
      clientId: 2,
      history: [
        { date: '09/25/24', time: '10:00 - 11:00 AM', amount: 'PHP 500.00', modeOfPayment: 'PayPal', status: 'successful' },
        { date: '09/12/24', time: '2:00 - 3:00 PM', amount: 'PHP 500.00', modeOfPayment: 'PayPal', status: 'pending' },
      ],
    },
  ];

  // Initialize Appwrite client and databases (mocked in this case)
  const client = new Client();
  const databases = new Databases(client);

  useEffect(() => {
    // In real case, fetch clients and set the data.
    setClients(mockClients);
  }, []);

  // Open payment history modal and fetch payment history for selected client
  const openHistoryModal = (clientId: number) => {
    setSelectedClient(clientId.toString());
    setLoading(true);

    // Mock the payment fetching based on selected client ID
    const clientPayment = mockPaymentHistory.find(p => p.clientId === clientId);
    if (clientPayment) {
      setPaymentHistory(clientPayment.history);
    }

    setLoading(false);
  };

  // Close payment history modal
  const closeModal = () => {
    setSelectedClient(null);
    setPaymentHistory([]);
  };

  // Filter clients based on active tab
  const filteredClients = () => {
    if (activeTab === 'Current Clients') {
      return clients.filter(client => client.status === 'current');
    } else if (activeTab === 'Referred Clients') {
      return clients.filter(client => client.status === 'referred');
    }
    return clients;
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      {/* Main Content */}
      <div className="flex-grow p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Payment History</h2>

        {/* Tabs with underline effect */}
        <div className="flex space-x-6 mb-8 relative">
          {['All', 'Current Clients', 'Referred Clients'].map(tab => (
            <button
              key={tab}
              className={`relative px-4 py-2 text-lg font-semibold transition-colors duration-300 ease-in-out ${
                activeTab === tab ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <span
                  className="absolute left-0 bottom-0 h-1 w-full bg-indigo-500 transition-all duration-300 ease-in-out"
                  style={{ transform: 'translateY(4px)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Placeholder Container for Fetched Data */}
        <div className="min-h-[300px] bg-gray-50 rounded-lg p-6 shadow-md">
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={activeTab}
              addEndListener={(node: { addEventListener: (arg0: string, arg1: any, arg2: boolean) => any; }, done: any) => node.addEventListener("transitionend", done, false)}
              classNames="fade-slide"
            >
              <div>
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-lg text-gray-600">Loading data...</span>
                  </div>
                ) : (
                  <div>
                    {filteredClients().length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {filteredClients().map((client, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-900">{client.name}</span>
                            <button
                              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                              onClick={() => openHistoryModal(client.id)}
                            >
                              View History
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <span className="text-lg text-gray-600">No clients available in this category.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>

        {/* Modal for Payment History */}
        {selectedClient && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {mockClients.find(client => client.id.toString() === selectedClient)?.name}
              </h3>
              <p className="text-gray-600 mb-6">
                Under {mockClients.find(client => client.id.toString() === selectedClient)?.therapist || 'Unknown Therapist'}
              </p>

              {/* Payment History Table */}
              <table className="w-full text-left text-gray-700">
                <thead className="bg-gray-100">
                  <tr className="text-gray-600">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Mode of Payment</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((history, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 px-4">{history.date}</td>
                      <td className="py-2 px-4">{history.time}</td>
                      <td className="py-2 px-4">{history.amount}</td>
                      <td className="py-2 px-4">{history.modeOfPayment}</td>
                      <td
                        className={`py-2 px-4 ${
                          history.status === 'successful'
                            ? 'text-green-600'
                            : history.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
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
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS for sliding and fading transitions */}
      <style jsx>{`
        .fade-slide-enter {
          opacity: 0;
          transform: translateX(-50%);
        }
        .fade-slide-enter-active {
          opacity: 1;
          transform: translateX(0%);
          transition: opacity 300ms, transform 300ms;
        }
        .fade-slide-exit {
          opacity: 1;
          transform: translateX(0%);
        }
        .fade-slide-exit-active {
          opacity: 0;
          transform: translateX(50%);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>
    </Layout>
  );
};

export default PaymentsHistory;
