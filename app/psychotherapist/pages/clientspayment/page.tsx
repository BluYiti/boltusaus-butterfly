'use client';

import { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import PaymentModal from "@/psychotherapist/components/PaymentModal"; // Import the new modal component

const ClientsPayment = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedClient, setSelectedClient] = useState(null); // State for selected client's payment details

  // Mock data for clients
  useEffect(() => {
    // Simulating fetching data from Appwrite with a delay
    const mockClients = [
      { name: "Bella Swan", email: "bella@twilight.com", status: "Paid" },
      { name: "Michael Bieber", email: "michael@bieber.com", status: "Pending" },
      { name: "Nicki Minaj", email: "nicki@minaj.com", status: "Paid" },
      { name: "Ana Smith", email: "ana@smith.com", status: "Pending" },
      { name: "Chris Grey", email: "chris@grey.com", status: "Paid" },
      { name: "Lana Dress", email: "lana@dress.com", status: "Pending" },
      { name: "Sza Padilla", email: "sza@padilla.com", status: "Paid" },
      { name: "Case Oh", email: "case@oh.com", status: "Pending" },
      { name: "Jennie Kim", email: "jennie@kim.com", status: "Paid" },
      { name: "Denzel White", email: "denzel@white.com", status: "Pending" },
      { name: "Angel Wong", email: "angel@wong.com", status: "Paid" },
      { name: "Jennifer Lawrence", email: "jennifer@lawrence.com", status: "Pending" },
    ];

    setTimeout(() => {
      setClients(mockClients);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (client) => {
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
        .filter((client) => client.status === "Pending")
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
        .filter((client) => client.status === "Paid")
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
              {["Pending", "Paid"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-lg font-medium transition ${
                    activeTab === tab
                      ? "border-b-4 border-blue-400 text-blue-500"
                      : "text-gray-500 hover:text-blue-400"
                  }`}
                  onClick={() => setActiveTab(tab)}
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
            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Pending"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Pending" && renderPendingClients()}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Paid"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Paid" && renderPaidClients()}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Payment Details */}
      <PaymentModal 
        isOpen={showModal} 
        onClose={closeModal} 
        client={selectedClient} 
      />
    </Layout>
  );
};

export default ClientsPayment;
