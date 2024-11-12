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
  booking: any;
  id: string; // Add a unique identifier for each payment to use as a key
  clientFirstName: string;
  clientLastName: string;
  psychoFirstName: string;
  psychoLastName: string;
}

const PaymentsPage: React.FC = () => {
  const { loading: authLoading } = useAuthCheck(['client']);
  const [payments, setPayments] = useState<Payment[]>([]); // State to store all payments
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null); // Selected payment for modal
  const [showModal, setShowModal] = useState<boolean>(false); // Modal visibility control
  const [loading, setLoading] = useState(true);

  // Fetch payment data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const clientId = await fetchClientId(user.$id);

        const response = await databases.listDocuments('Butterfly-Database', 'Payment', [
          Query.equal('client', clientId), // Adjust based on your schema
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
        }));        

        setPayments(fetchedPayments); // Store the payments in the state
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // End the loading state once data is fetched
      }
    };

    fetchData();
  }, []);

  // Function to handle View Receipt click
  const viewReceipt = (payment: Payment) => {
    console.log(payment);  // Log the payment object to see if it's correct
    setSelectedReceipt(payment);
    setShowModal(true);
  };
  
  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedReceipt(null); // Clear selected payment
  };

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gray-50">
        {/* Main Content */}
        <div className="flex-grow flex flex-col bg-blue-100 px-10 py-8 overflow-y-auto">
          {/* Top Section with Title */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6">
            {/* Add key prop here for the h1 tags */}
            {payments.map((payment) => (
              <h1 key={payment.id} className="text-xl font-bold text-gray-800">
                {payment.clientFirstName} {payment.clientLastName} 
                <span className="text-gray-500">
                  (under {payment.psychoFirstName} {payment.psychoLastName})
                </span>
              </h1>
            ))}
          </div>

          {/* Payments Table Section */}
          <div className="bg-white shadow-md p-6 rounded-lg flex flex-col space-y-6">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="px-4 py-2">REFERENCE NO.</th>
                  <th className="px-4 py-2">MODE</th>
                  <th className="px-4 py-2">CHANNEL</th>
                  <th className="px-4 py-2">AMOUNT</th>
                  <th className="px-4 py-2">STATUS</th>
                  <th className="px-4 py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {/* Render each payment dynamically */}
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="px-4 py-2">{payment.referenceNo}</td>
                    <td className="px-4 py-2">{payment.mode}</td>
                    <td className="px-4 py-2">{payment.channel}</td>
                    <td className="px-4 py-2">{payment.amount}</td>
                    <td className="px-4 py-2">{payment.status}</td>
                    <td className="px-4 py-2">
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

          {/* Modal Section */}
          {showModal && selectedReceipt && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="bg-white rounded-lg shadow-lg p-6 relative w-96 z-50">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Payment Details for {selectedReceipt.referenceNo}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                {/* Modal Content */}
                <div>
                  <p className="text-gray-700">Here is the detailed information for the transaction:</p>
                  <p className="text-sm text-gray-600 mt-4">Reference No: {selectedReceipt.referenceNo}</p>
                  <p className="text-sm text-gray-600">Amount: PHP {selectedReceipt.amount}</p>
                  <p className="text-sm text-gray-600">Mode of Payment: {selectedReceipt.channel}</p>
                  <p className="text-sm text-gray-600">Status: {selectedReceipt.status}</p>
                  {/* You can add more fields as necessary */}
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
