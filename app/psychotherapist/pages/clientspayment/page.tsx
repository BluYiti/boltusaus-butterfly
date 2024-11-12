'use client';

import { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import PaymentModal from "@/psychotherapist/components/PaymentModal"; // Import the new modal component
import LoadingScreen from "@/components/LoadingScreen";
import useAuthCheck from "@/auth/page";
import { account, databases, Query } from "@/appwrite";
import { fetchPsychoId } from "@/hooks/userService";

interface Payment {
  referenceNo: string;
  mode: string;
  channel: string;
  amount: number;
  status: string;
  client: { firstname: string; lastname: string }; // Client's first and last name
  psychotherapist: { firstName: string; lastName: string }; // Psychotherapist's first and last name
  booking: any;
  id: string; // Add a unique identifier for each payment to use as a key
  clientFirstName: string;
  clientLastName: string;
  psychoFirstName: string;
  psychoLastName: string;
  email: string;
  createdAt: Date;
  declineReason: string;
  receipt: string;
}

const ClientsPayment = () => {
  const { loading: authLoading } = useAuthCheck(['psychotherapist']);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [selectedClient, setSelectedClient] = useState(null); // State for selected client's payment details

  // Mock data for clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const psychoId = await fetchPsychoId(user.$id);

        const response = await databases.listDocuments('Butterfly-Database', 'Payment', [
          Query.equal('psychotherapist', psychoId), // Adjust based on your schema
        ]);
        console.log(response);

        // Assuming each payment document has a 'client' and 'psychotherapist' object with 'firstname' and 'lastname'
        const fetchedPayments = response.documents.map((doc: any) => ({
          referenceNo: doc.referenceNo,
          mode: doc.booking.mode,
          channel: doc.channel,
          amount: doc.amount,
          status: doc.status,
          client: doc.client, // Assuming the client data is already in this format
          psychotherapist: doc.psychotherapist, // Same assumption
          booking: doc.booking,
          id: doc.$id, 
          clientFirstName: doc.client.firstname,
          clientLastName: doc.client.lastname,
          psychoFirstName: doc.psychotherapist.firstName,
          psychoLastName: doc.psychotherapist.lastName,
          email: doc.client.userid.email,
          createdAt: doc.$createdAt,
          declineReason: doc.declineReason,
          receipt: doc.receipt
        }));        

        setPayments(fetchedPayments); // Store the payments in the state

        // Extract the query parameter from the URL
        const url = new URL(window.location.href);
        const tab = url.searchParams.get("tab");
        
        if (tab) {
          setActiveTab(tab); // Set active tab based on the query parameter
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // End the loading state once data is fetched
      }
    };

    fetchData();
  }, []);

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
      {payments.filter((client) => client.status === "pending")
        .map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h4 className="font-semibold">{client.clientFirstName}</h4>
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
      {payments.filter((client) => client.status === "paid")
        .map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h4 className="font-semibold">{client.clientFirstName}</h4>
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

  const renderDeclinedClients = () => (
    <div className="mt-4 space-y-3">
      {payments.filter((client) => client.status === "declined")
        .map((client, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <h4 className="font-semibold">{client.clientFirstName}</h4>
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

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen overflow-auto">
      <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Client's Payment</h2>
        </div>

        <div className="mt-24 px-5">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 border-b">
              {["Pending", "Paid", "Declined"].map((tab) => (
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

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Declined"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Declined" && renderDeclinedClients()}
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