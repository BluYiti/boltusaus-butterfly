'use client';

import { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import PaymentModal from "@/psychotherapist/components/PaymentModal"; // Import the new modal component
import LoadingScreen from "@/components/LoadingScreen";
import useAuthCheck from "@/auth/page";
import { account, databases, Query } from "@/appwrite";
import { fetchProfileImageUrl, fetchPsychoId } from "@/hooks/userService"; // Your existing function
import Image from 'next/image';

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
    profilepic: string | null;
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
  clientProfilePic: string;
  psychoFirstName: string;
  psychoLastName: string;
  email: string;
  createdAt: Date;
  declineReason: string;
  receipt: string;
}

const ClientsPayment = () => {
  const authLoading = useAuthCheck(['psychotherapist']);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [, setShowModal] = useState(false); // State for modal visibility
  const [selectedClient, setSelectedClient] = useState<Payment | null>(null); // State for selected client's payment details
  const [profileImageUrls, setProfileImageUrls] = useState<{ [key: string]: string }>({});

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
          const client = doc.client || {};  // Fallback to an empty object if doc.client is null or undefined
          const psychotherapist = doc.psychotherapist || {}; // Similarly, handle psychotherapist

          return {
            referenceNo: doc.referenceNo,
            mode: doc.booking?.mode || "",  // Accessing `mode` from `booking` with null check
            channel: doc.channel,
            amount: doc.amount,
            status: doc.status,
            client: doc.client,
            psychotherapist: doc.psychotherapist,
            booking: doc.booking,
            id: doc.$id,
            clientFirstName: client.firstname || "",  // Fallback to empty string if firstname is missing
            clientLastName: client.lastname || "",    // Fallback to empty string if lastname is missing
            clientProfilePic: client.profilepic || "",
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

        const profileImages: { [key: string]: string } = {};
        for (const doc of response.documents) {
          const clientProfilePic = doc.client?.profilepic;
          if (clientProfilePic) {
            const url = await fetchProfileImageUrl(clientProfilePic);
            if (url) profileImages[doc.$id] = url;
          }
        }

        setProfileImageUrls(profileImages);  // Update state with all profile images

        // Extract the query parameter from the URL
        const url = new URL(window.location.href);
        const tab = url.searchParams.get('tab');
  
        if (tab) {
          setActiveTab(tab); // Set active tab based on the query parameter
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (client: Payment) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  const renderClientsByStatus = (status: string) => {
    return (
      <div className="mt-4">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-black">
              <th className="py-3 px-6 text-left">Client Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Payment Mode</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments
              .filter((client) => client.status === status.toLowerCase())
              .map((client, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <Image
                        src={profileImageUrls[client.id] || "/images/default-profile.png"}
                        alt={`${client.clientFirstName} ${client.clientLastName}`}
                        width={32}
                        height={32}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                    <span>{`${client.clientFirstName} ${client.clientLastName}`}</span>
                  </td>
                  <td className="py-3 px-6">{client.email}</td>
                  <td className="py-3 px-6">{`₱${client.amount.toFixed(2)}`}</td>
                  <td className="py-3 px-6">{client.mode}</td>
                  <td className="py-3 px-6">{client.status}</td>
                  <td className="py-3 px-6">{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="px-4 py-2 text-sm font-semibold text-white bg-blue-400 rounded-full hover:bg-blue-600 transition"
                      onClick={() => openModal(client)}
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  // Mock data for daily profit
  const dailyProfit: Record<string, string> = {
    '2024-10-10': '₱16,000',
    '2024-10-11': '₱22,500',
    '2024-10-12': '₱20,000',
    '2024-10-13': '₱25,000',
    '2024-10-14': '₱17,500',
    '2024-10-15': '₱30,000',
  };

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

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen overflow-auto">
        <div className="bg-white width rounded-b-lg fixed p-5 top-0 w-full z-10">
          <h2 className="text-2xl font-bold text-blue-400">Client&apos;s Payment</h2>
        </div>

        <div className="mt-24 px-5 mb-5 ">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 border-b">
              {["Pending", "Paid", "Rescheduled", "Refunded", "Report"].map((tab) => (
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
          </div>

          <div className="mt-6">
            {["Pending", "Paid", "Rescheduled", "Refunded"].map((tab) => (
              <div
                key={tab}
                className={`transition-all duration-500 ease-in-out ${
                  activeTab === tab ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {activeTab === tab && renderClientsByStatus(tab.toLowerCase())}
              </div>
            ))}

            <div
              className={`transition-all duration-500 ease-in-out ${
                activeTab === "Report"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {activeTab === "Report" && renderReports()}
            </div>
          </div>
        </div>
      </div>

      <PaymentModal onClose={closeModal} client={selectedClient} />
    </Layout>
  );
};

export default ClientsPayment;
