'use client';

import { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { databases } from "@/appwrite";

interface ClientType {
  id: string; // Document ID
  clientid: string;
  userid: string;
  firstname: string;
  lastname: string;
  phonenum: string;
  birthdate: string;
  age: number;
  address: string;
  type: string;
  state: string; // This will be used to filter clients by their state
  emergencyContact: string;
  status: string;
}

interface AccountType {
  id: string; // Document ID
  username: string;
  email: string;
}


const Clients = () => {
  const [activeTab, setActiveTab] = useState("Current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");  const [clients, setClients] = useState<(ClientType & AccountType)[]>([]);

  useEffect(() => {
    const fetchClientsAndAccounts = async () => {
      try {
        const clientResponse = await databases.listDocuments('Butterfly-Database', 'Client');
    
        const combinedClients = clientResponse.documents.map((clientDoc) => {
          // Accessing email and username directly from the userid object
          const email = clientDoc.userid.email; // Get email from the userid object
          const username = clientDoc.userid.username; // Get username if needed
    
          return {
            id: clientDoc.$id,
            clientid: clientDoc.clientid,
            userid: clientDoc.userid.$id, // Keep the userid if needed
            firstname: clientDoc.firstname,
            lastname: clientDoc.lastname,
            phonenum: clientDoc.phonenum,
            birthdate: clientDoc.birthdate,
            age: clientDoc.age,
            address: clientDoc.address,
            type: clientDoc.type,
            state: clientDoc.state,
            emergencyContact: clientDoc.emergencyContact,
            status: clientDoc.status,
            email: email || "No email available", // Use email from the nested userid object
            username: username || "", // Optionally get username as well
          };
        });
    
        setClients(combinedClients);
      } catch (error) {
        console.error(error);
      }
    };    

    fetchClientsAndAccounts();
  }, [databases]);
  

  const filteredClients = () => {
    const searchFiltered = clients.filter(client =>
      client.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return searchFiltered.filter(client => {
      const matchesFilter = filterStatus === "All" || client.status === filterStatus;
      return matchesFilter;
    });
  };
  

  const renderClients = () => {
    const stateFilteredClients = filteredClients();
    switch (activeTab) {
      case "Current":
        return stateFilteredClients.filter(client => client.state === "current");
      case "To Be Evaluated":
        return stateFilteredClients.filter(client => client.state === "evaluate");
      case "For Referral":
        return stateFilteredClients.filter(client => client.state === "referred");
      default:
        return stateFilteredClients;
    }
  };

  const renderClientList = () => (
    <div className="mt-4 space-y-3">
      {renderClients().map((client, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <h4 className="font-semibold">{client.firstname} {client.lastname}</h4>
              <p className="text-sm text-gray-500">{client.email}</p> {/* Displaying the email */}
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

          {renderClientList()}
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
