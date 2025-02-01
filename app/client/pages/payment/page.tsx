"use client";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import React, { useState, useEffect } from 'react';
import { account, databases, Query } from "@/appwrite";
import { fetchClientId } from "@/hooks/userService";
import LoadingScreen from "@/components/LoadingScreen";
import useAuthCheck from "@/auth/page";

interface Payment {
  referenceNo: string;
  mode: string;
  channel: string;
  amount: number;
  status: string;
  client: { firstname: string; lastname: string }; // Client's first and last name
  psychotherapist: { firstName: string; lastName: string }; // Psychotherapist's first and last name
  booking: string;
  id: string; // Add a unique identifier for each payment to use as a key
  clientFirstName: string;
  clientLastName: string;
  psychoFirstName: string;
  psychoLastName: string;
}

const PaymentsPage: React.FC = () => {
  const authLoading = useAuthCheck(['client']);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const clientId = await fetchClientId(user.$id);

        const response = await databases.listDocuments('Butterfly-Database', 'Payment', [
          Query.equal('client', clientId),
        ]);
        console.log(response);

        const fetchedPayments = response.documents.map((doc) => ({
          referenceNo: doc.referenceNo,
          mode: doc.booking.mode,
          channel: doc.channel,
          amount: doc.amount,
          status: doc.status,
          client: doc.client,
          psychotherapist: doc.psychotherapist,
          booking: doc.booking,
          id: doc.$id,
          clientFirstName: doc.client.firstname,
          clientLastName: doc.client.lastname,
          psychoFirstName: doc.psychotherapist.firstName,
          psychoLastName: doc.psychotherapist.lastName,
        }));

        setPayments(fetchedPayments);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewReceipt = (payment: Payment) => {
    console.log(payment);
    setSelectedReceipt(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReceipt(null);
  };

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gray-50">
        <div className="flex-grow flex flex-col bg-blue-100 px-4 py-4 sm:px-10 sm:py-8 overflow-y-auto">
          <div className="bg-white shadow-lg py-4 px-4 sm:px-6 flex justify-between items-center rounded-md mb-6">
            {payments.map((payment) => (
              <h1 key={payment.id} className="text-lg sm:text-xl font-bold text-gray-800">
                {payment.clientFirstName} {payment.clientLastName}
                <span className="text-gray-500">
                  (under {payment.psychoFirstName} {payment.psychoLastName})
                </span>
              </h1>
            ))}
          </div>

          <div className="bg-white shadow-md p-4 sm:p-6 rounded-lg flex flex-col space-y-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr className="border-b text-gray-700">
                    <th className="px-2 sm:px-4 py-2">REFERENCE NO.</th>
                    <th className="px-2 sm:px-4 py-2">MODE</th>
                    <th className="px-2 sm:px-4 py-2">CHANNEL</th>
                    <th className="px-2 sm:px-4 py-2">AMOUNT</th>
                    <th className="px-2 sm:px-4 py-2">STATUS</th>
                    <th className="px-2 sm:px-4 py-2">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      {payment.id === "pending" ? (
                        <td className="px-2 sm:px-4 py-2">Wait for Pyschotherapist</td>
                      ) : 
                      (<td className="px-2 sm:px-4 py-2">{payment.referenceNo}</td>)}
                      <td className="px-2 sm:px-4 py-2">{payment.mode}</td>
                      <td className="px-2 sm:px-4 py-2">{payment.channel}</td>
                      <td className="px-2 sm:px-4 py-2">{payment.amount}</td>
                      <td className="px-2 sm:px-4 py-2">{payment.status}</td>
                      <td className="px-2 sm:px-4 py-2">
                        <button
                          onClick={() => viewReceipt(payment)}
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          View Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && selectedReceipt && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative w-11/12 sm:w-96 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Payment Details for {selectedReceipt.referenceNo}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                <div>
                  <p className="text-gray-700">Here is the detailed information for the transaction:</p>
                  <p className="text-sm text-gray-600 mt-4">Reference No: {selectedReceipt.referenceNo}</p>
                  <p className="text-sm text-gray-600">Amount: PHP {selectedReceipt.amount}</p>
                  <p className="text-sm text-gray-600">Mode of Payment: {selectedReceipt.channel}</p>
                  <p className="text-sm text-gray-600">Status: {selectedReceipt.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentsPage;
