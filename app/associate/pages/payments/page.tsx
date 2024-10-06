"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Client, Databases } from 'appwrite';
import items from '@/associate/data/links';
import Layout from '@/components/Sidebar/Layout'; 

const PaymentsHistory: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize Appwrite client and databases
  const client = new Client();
  const databases = new Databases(client);

  // Fetch clients from Appwrite
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsResponse = await databases.listDocuments('DATABASE_ID', 'CLIENTS_COLLECTION_ID');
        setClients(clientsResponse.documents);
      } catch (error) {
        console.error("Error fetching clients: ", error);
      }
    };

    fetchClients();
  }, []);

  // Open payment history modal and fetch payment history for selected client
  const openHistoryModal = async (clientName: string) => {
    setSelectedClient(clientName);
    setLoading(true);
    try {
      const paymentHistoryResponse = await databases.listDocuments('DATABASE_ID', 'PAYMENTS_COLLECTION_ID', [
        // Add filter if necessary for the client
      ]);
      setPaymentHistory(paymentHistoryResponse.documents);
    } catch (error) {
      console.error("Error fetching payment history: ", error);
    }
    setLoading(false);
  };

  // Close payment history modal
  const closeModal = () => {
    setSelectedClient(null);
    setPaymentHistory([]);
  };

  return (
    <Layout sidebarTitle="Associate" sidebarItems={items}> 

  
      {/* Main Content */}
      <div className="flex-grow p-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Payment History</h2>

        <div className="grid grid-cols-1 gap-6">
          {clients.map((client, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">{client.name}</span>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
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
            <div className="bg-white p-8 rounded-lg shadow-lg w-[600px]">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedClient}</h3>
              <p className="text-gray-600 mb-6">
                Under {clients.find(client => client.name === selectedClient)?.therapist || 'Unknown Therapist'}
              </p>

              {/* Placeholder for loading */}
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <span className="text-gray-600 text-lg">Loading payment history...</span>
                </div>
              ) : (
                /* Payment History Table */
                <table className="w-full text-left text-gray-700">
                  <thead className="bg-gray-100">
                    <tr className="text-gray-600">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((history, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{history.date}</td>
                        <td className="py-2 px-4">{history.time}</td>
                        <td className="py-2 px-4">{history.amount}</td>
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
              )}

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
  
    </Layout>
  );
};

export default PaymentsHistory;
