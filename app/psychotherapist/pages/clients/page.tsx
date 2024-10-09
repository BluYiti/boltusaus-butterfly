'use client'

import { useState } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import ClientProfileModal from "@/psychotherapist/components/ClientProfileModal"; // Adjust import path

const Clients = () => {
  const [activeTab, setActiveTab] = useState("Current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const clients = [
    { id: "bella-swan", name: "Bella Swan", email: "xxx@xxx.com", status: "Attached Certificate" },
    { id: "michael-bieber", name: "Michael Bieber", email: "xxx@xxx.com", status: "Pending . . . " },
    { id: "nicki-minaj", name: "Nicki Minaj", email: "xxx@xxx.com", status: "Attached Certificate" },
    { id: "ana-smith", name: "Ana Smith", email: "xxx@xxx.com", status: "Pending . . . " },
    { id: "chris-grey", name: "Chris Grey", email: "xxx@xxx.com", status: "Attached Certificate" },
    // Add more clients as needed
  ];

  const filteredClients = clients.filter((client) => {
    const matchesSearchTerm = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || client.status === filterStatus;
    return matchesSearchTerm && matchesFilter;
  });

  const openModal = (clientId) => {
    setSelectedClientId(clientId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClientId(null);
    setModalOpen(false);
  };

  // Render clients for the "Current" tab
  const renderCurrentClients = () => (
    <div className="mt-4 space-y-3">
      {filteredClients.map((client, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <h4 className="font-semibold">{client.name}</h4>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <button
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            onClick={() => openModal(client.id)}
          >
            View Profile
          </button>
        </div>
      ))}
    </div>
  );

  // Render clients for the "To Be Evaluated" tab
  const renderEvaluatedClients = () => (
    <div className="mt-4 space-y-3">
      {filteredClients.map((client, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <h4 className="font-semibold">{client.name}</h4>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition">
            View Assessment
          </button>
        </div>
      ))}
    </div>
  );

  // Render clients for the "For Referral" tab
  const renderReferralClients = () => (
    <div className="mt-4 space-y-3">
      {filteredClients.map((client, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <h4 className="font-semibold">{client.name}</h4>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {client.status === "Attached Certificate" ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m1-7h6a2 2 0 012 2v12a2 2 0 01-2 2h-6m-3 0H5a2 2 0 01-2-2V5a2 2 0 012-2h6" />
                  </svg>
                  <span className="text-sm text-green-500">{client.status}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" strokeDasharray="10 10" strokeDashoffset="5" />
                  </svg>
                  <span className="text-sm text-yellow-600">{client.status}</span>
                </>
              )}
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
            View Profile
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-gray-100 min-h-screen overflow-auto">
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10 sticky">
          <h2 className="text-2xl font-bold">Clients</h2>
        </div>

        <div className="mt-6 px-5">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 border-b">
              {["Current", "To Be Evaluated", "For Referral"].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-lg font-medium transition ${
                    activeTab === tab
                      ? "border-b-4 border-blue-500 text-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <div className="relative w-80">
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {activeTab === "For Referral" && (
                <div className="relative w-48">
                  <select
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Attached Certificate">Attached Certificate</option>
                    <option value="Pending . . . ">Pending</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Render clients based on the active tab */}
          {activeTab === "Current" && renderCurrentClients()}
          {activeTab === "To Be Evaluated" && renderEvaluatedClients()}
          {activeTab === "For Referral" && renderReferralClients()}
        </div>
      </div>

      {/* Client Profile Modal */}
      {isModalOpen && selectedClientId && (
        <ClientProfileModal
          clientId={selectedClientId}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </Layout>
  );
};

export default Clients;
