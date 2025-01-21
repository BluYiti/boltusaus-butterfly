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

        const fetchedPayments: Payment[] = response.documents.map((doc) => ({
          referenceNo: doc.referenceNo,
          mode: doc.booking.mode,
          channel: doc.channel,
          amount: doc.amount,
          status: doc.status,
          client: doc.client,
          psychotherapist: doc.psychotherapist,
          booking: doc.booking,
          id: doc.$id,
          clientFirstName: doc.client?.firstname || "",
          clientLastName: doc.client?.lastname || "",
          clientProfilePic: doc.client?.profilepic || "",
          psychoFirstName: doc.psychotherapist?.firstName || "",
          psychoLastName: doc.psychotherapist?.lastName || "",
          email: doc.client?.userid?.email || "",
          createdAt: new Date(doc.$createdAt),
          declineReason: doc.declineReason,
          receipt: doc.receipt,
          $id: doc.$id,
          $createdAt: doc.$createdAt,
        }));

        setPayments(fetchedPayments);

        const profileImages: { [key: string]: string } = {};
        for (const doc of response.documents) {
          const clientProfilePic = doc.client?.profilepic;
          if (clientProfilePic) {
            const url = await fetchProfileImageUrl(clientProfilePic);
            if (url) profileImages[doc.$id] = url;
          }
        }

        setProfileImageUrls(profileImages);
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
            <tr className="bg-blue-100 text-blue-600">
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
          </div>
        </div>
      </div>

      <PaymentModal onClose={closeModal} client={selectedClient} />
    </Layout>
  );
};

export default ClientsPayment;
