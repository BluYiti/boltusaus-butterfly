'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import items from '@/psychotherapist/data/Links';
import PaymentModal from '@/psychotherapist/components/PaymentModal';

interface Client {
  name: string;
  email: string;
  status: 'Pending' | 'Paid';
}

const ClientsPayment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Paid' | 'Reports'>('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Mock data for clients
  useEffect(() => {
    const mockClients: Client[] = [
      { name: 'Bella Swan', email: 'bella@twilight.com', status: 'Paid' },
      { name: 'Michael Bieber', email: 'michael@bieber.com', status: 'Pending' },
      { name: 'Nicki Minaj', email: 'nicki@minaj.com', status: 'Paid' },
      { name: 'Ana Smith', email: 'ana@smith.com', status: 'Pending' },
      { name: 'Chris Grey', email: 'chris@grey.com', status: 'Paid' },
    ];

    setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 1000);
  }, []);

  // Mock data for daily profit
  const dailyProfit: Record<string, string> = {
    '2024-10-10': '₱16,000',
    '2024-10-11': '₱22,500',
    '2024-10-12': '₱20,000',
    '2024-10-13': '₱25,000',
    '2024-10-14': '₱17,500',
    '2024-10-15': '₱30,000',
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  const renderPendingClients = () => (
    <div className="mt-4 space-y-3">
      {filteredClients
        .filter((client) => client.status === 'Pending')
        .map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h4 className="font-semibold">{client.name}</h4>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
              onClick={() => openModal(client)}
            >
              View Payment
            </button>
          </div>
        ))}
    </div>
  );

  const renderPaidClients = () => (
    <div className="mt-4 space-y-3">
      {filteredClients
        .filter((client) => client.status === 'Paid')
        .map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h4 className="font-semibold">{client.name}</h4>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-green-600 transition">
              View Payment
            </button>
          </div>
        ))}
    </div>
  );

  const renderReports = () => (
    <div className="mt-4 space-y-3">
      <h3 className="text-lg font-bold mb-4">Daily Profit</h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(dailyProfit).map(([date, profit]) => (
          <div
            key={date}
            className="p-4 bg-white shadow rounded-lg text-center"
          >
            <h4 className="font-semibold text-blue-500">{date}</h4>
            <p className="text-gray-700 text-lg">{profit}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout sidebarTitle="Butterfly" sidebarItems={items}>
        <div className="bg-blue-50 min-h-screen overflow-auto flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen overflow-auto">
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10 sticky">
          <h2 className="text-2xl font-bold">Client's Payment</h2>
        </div>

        <div className="mt-6 px-5">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 border-b">
              {['Pending', 'Paid', 'Reports'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-lg font-medium transition ${
                    activeTab === tab
                      ? 'border-b-4 border-blue-400 text-blue-500'
                      : 'text-gray-500 hover:text-blue-400'
                  }`}
                  onClick={() => setActiveTab(tab as 'Pending' | 'Paid' | 'Reports')}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search clients..."
                className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-2.5 right-3 h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'Pending' && renderPendingClients()}
            {activeTab === 'Paid' && renderPaidClients()}
            {activeTab === 'Reports' && renderReports()}
          </div>
        </div>
      </div>

      <PaymentModal isOpen={showModal} onClose={closeModal} client={selectedClient} />
    </Layout>
  );
};

export default ClientsPayment;
