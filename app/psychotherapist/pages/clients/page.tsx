'use client'
import { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import { databases } from "@/appwrite";
import ClientProfileModal from "@/psychotherapist/components/ClientProfileModal";
import ReferredClientProfileModal from "@/psychotherapist/components/ReferredClientProfileModal"; // Import your new modal

interface ClientType {
  id: string;
  clientid: string;
  userid: string;
  firstname: string;
  lastname: string;
  phonenum: string;
  birthdate: string;
  age: number;
  address: string;
  type: string;
  state: string;
  emergencyContact: string;
  status: string;
}

interface AccountType {
  id: string;
  username: string;
  email: string;
}

const Clients = () => {
  const [activeTab, setActiveTab] = useState("Current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [clients, setClients] = useState<(ClientType & AccountType)[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReferredProfileModalOpen, setIsReferredProfileModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientsAndAccounts = async () => {
      setLoading(true);
      try {
        const clientResponse = await databases.listDocuments('Butterfly-Database', 'Client');

        const combinedClients = clientResponse.documents.map((clientDoc) => {
          const email = clientDoc.userid.email;
          const username = clientDoc.userid.username;

          return {
            id: clientDoc.$id,
            clientid: clientDoc.clientid,
            userid: clientDoc.userid.$id,
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
            email: email || "No email available",
            username: username || "",
          };
        });

        setClients(combinedClients);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientsAndAccounts();
  }, [databases]);

  const filteredClients = () => {
    let searchFiltered = clients.filter(client =>
      client.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTab === "For Referral") {
      searchFiltered = searchFiltered.filter(client => {
        const status = client.status?.toLowerCase();
        if (filterStatus === "Attached Certificate") {
          return status === "attached" && client.state === "referred";
        } else if (filterStatus === "Pending") {
          return status === "pending" && client.state === "referred";
        }
        return true; // For "All"
      });
    }

    return searchFiltered;
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

  const renderClientList = () => {
    if (loading) {
      return <div className="text-center">Loading clients...</div>;
    }

    return (
      <div className="mt-4 space-y-3">
        {renderClients().map((client, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h4 className="font-semibold flex items-center">
                  {client.firstname} {client.lastname}
                  {client.state === "referred" && client.status === "attached" && (
                    <span className="ml-2 text-green-700 flex items-center" aria-label="Attached Certificate">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-1">Attached Certificate</span>
                    </span>
                  )}
                  {client.status === "pending" && (
                    <span className="ml-2 text-yellow-600 flex items-center" aria-label="Pending">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8l4 4" />
                      </svg>
                      <span className="ml-1">Pending...</span>
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            {activeTab === "Current" && (
              <button
                onClick={() => {
                  setSelectedClientId(client.id);
                  setIsProfileModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
              >
                View Profile
              </button>
            )}
            {activeTab === "For Referral" && (
              <button
                onClick={() => {
                  setSelectedClientId(client.id);
                  setIsReferredProfileModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
              >
                View Profile
              </button>
            )}
            {activeTab === "To Be Evaluated" && (
              <button
                onClick={() => {
                  // Handle viewing pre-assessment logic here
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
              >
                View Pre-Assessment
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen overflow-auto">
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
                      ? "border-b-4 border-blue-400 text-blue-500"
                      : "text-gray-500 hover:text-blue-400"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex space-x-4">
              <div className="relative w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {renderClientList()}
        </div>
      </div>

      <ClientProfileModal
        clientId={selectedClientId}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedClientId(null);
        }}
      />
      <ReferredClientProfileModal
        clientId={selectedClientId}
        isOpen={isReferredProfileModalOpen}
        onClose={() => {
          setIsReferredProfileModalOpen(false);
          setSelectedClientId(null);
        }}
      />
    </Layout>
  );
};

export default Clients;
