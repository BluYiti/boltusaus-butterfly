'use client';

import { useState } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";

const ClientsPayment = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");

  const clients = [
    { name: "Bella Swan", email: "xxx@xxx.com", status: "Paid" },
    { name: "Michael Bieber", email: "xxx@xxx.com", status: "Pending" },
    { name: "Nicki Minaj", email: "xxx@xxx.com", status: "Paid" },
    { name: "Ana Smith", email: "xxx@xxx.com", status: "Pending" },
    { name: "Chris Grey", email: "xxx@xxx.com", status: "Paid" },
    { name: "Lana Dress", email: "xxx@xxx.com", status: "Pending" },
    { name: "Sza Padilla", email: "xxx@xxx.com", status: "Paid" },
    { name: "Case Oh", email: "xxx@xxx.com", status: "Pending" },
    { name: "Jennie Kim", email: "xxx@xxx.com", status: "Paid" },
    { name: "Denzel White", email: "xxx@xxx.com", status: "Pending" },
    { name: "Angel Wong", email: "xxx@xxx.com", status: "Paid" },
    { name: "Jennifer Lawrence", email: "xxx@xxx.com", status: "Pending" },
  ];

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
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
            <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition">
              View Payment
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
              {["Pending", "Paid"].map((tab) => (
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
    </Layout>
  );
};

export default ClientsPayment;
