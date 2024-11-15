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
  $id: string;
  $createdAt: string;
  referenceNo: string;
  mode: string;
  channel: string;
  amount: number;
  status: string;
  client: {
    userid: string;
    firstname: string;
    lastname: string;
  };
  psychotherapist: {
    firstName: string;
    lastName: string;
  };
  booking: {
    mode: string;
    date: string;
  };
  id: string;
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
  const [, setShowModal] = useState(false); // State for modal visibility
  const [selectedClient, setSelectedClient] = useState(null); // State for selected client's payment details

  // Fetch payment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const psychoId = await fetchPsychoId(user.$id);
  
        const response = await databases.listDocuments('Butterfly-Database', 'Payment', [
          Query.equal('psychotherapist', psychoId),
        ]);
  
        // Map fetched data to match Payment type
        const fetchedPayments: Payment[] = response.documents.map((doc) => {
          // Ensure fields match the expected type and structure
          const client = doc.client || {}; // Fallback to an empty object if doc.client is null or undefined
          const psychotherapist = doc.psychotherapist || {}; // Similarly, handle psychotherapist
        
          return {
            referenceNo: doc.referenceNo,
            mode: doc.booking.mode,  // Accessing `mode` from `booking`
            channel: doc.channel,
            amount: doc.amount,
            status: doc.status,
            client: doc.client,
            psychotherapist: doc.psychotherapist,
            booking: doc.booking,
            id: doc.$id,
            clientFirstName: client.firstname || "",  // Fallback to empty string if firstname is missing
            clientLastName: client.lastname || "",    // Fallback to empty string if lastname is missing
            psychoFirstName: psychotherapist.firstName || "",  // Fallback to empty string if missing
            psychoLastName: psychotherapist.lastName || "",    // Fallback to empty string if missing
            email: client.userid?.email || "",  // Safely access the email with optional chaining
            createdAt: new Date(doc.$createdAt),
            declineReason: doc.declineReason,
            receipt: doc.receipt,
            $id: doc.$id,  // Ensure the ID is included
            $createdAt: doc.$createdAt, // Include createdAt field
          };
        });
        

        setPayments(fetchedPayments);

        // Set the active tab from URL query params if available
        const url = new URL(window.location.href);
        const tab = url.searchParams.get("tab");
        if (tab) {
          setActiveTab(tab);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
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

  const renderClientsByStatus = (status: string) => (
    <div className="mt-4 space-y-3">
      {payments.filter((client) => client.status === status)
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
          <h2 className="text-2xl font-bold text-blue-400">Client&apos;s Payment</h2>
        </div>

        <div className="mt-24 px-5">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 border-b">
              {["Pending", "Paid", "Rescheduled", "Refunded"].map((tab) => (
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
              {activeTab === "Pending" && renderClientsByStatus("pending")}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Paid"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Paid" && renderClientsByStatus("paid")}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Rescheduled"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Rescheduled" && renderClientsByStatus("rescheduled")}
            </div>

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Refunded"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Refunded" && renderClientsByStatus("refunded")}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Payment Details */}
      <PaymentModal 
        onClose={closeModal} 
        client={selectedClient} 
      />
    </Layout>
  );
};

export default ClientsPayment;
