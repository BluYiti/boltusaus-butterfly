"use client";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import React, { useState } from 'react';

const PaymentsPage: React.FC = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null); // Store selected transaction
  const [showModal, setShowModal] = useState<boolean>(false); // Control modal visibility

  // Function to handle View Receipt click
  const viewReceipt = (date: string) => {
    setSelectedReceipt(date); // Set the selected transaction date
    setShowModal(true); // Show the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedReceipt(null);
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gray-50">
        {/* Main Content */}
        <div className="flex-grow flex flex-col bg-blue-100 px-10 py-8 overflow-y-auto">
          {/* Top Section with Title */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6">
            <h1 className="text-xl font-bold text-gray-800">Ana Smith <span className="text-gray-500">(under Mrs. Angelica Peralta)</span></h1>
          </div>

          {/* Payments Table Section */}
          <div className="bg-white shadow-md p-6 rounded-lg flex flex-col space-y-6">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="px-4 py-2">DATE</th>
                  <th className="px-4 py-2">TIME</th>
                  <th className="px-4 py-2">AMOUNT</th>
                  <th className="px-4 py-2">MODE OF PAYMENT</th>
                  <th className="px-4 py-2">STATUS</th>
                  <th className="px-4 py-2">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {/* Transaction Rows */}
                <tr className="border-b">
                  <td className="px-4 py-2">10/03/24</td>
                  <td className="px-4 py-2">9:30 - 10:30 AM</td>
                  <td className="px-4 py-2">PHP 1,000.00</td>
                  <td className="px-4 py-2">GCash</td>
                  <td className="px-4 py-2">Pending</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => viewReceipt('10/03/24')}
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
                {/* Additional rows can be added here */}
              </tbody>
            </table>
          </div>

          {/* Modal Section */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="bg-white rounded-lg shadow-lg p-6 relative w-96 z-50">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Receipt for {selectedReceipt}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                {/* Modal Content */}
                <div>
                  <p className="text-gray-700">Here is the detailed information for the transaction on {selectedReceipt}.</p>
                  {/* Add additional details, such as PDF link, receipt image, or transaction data here */}
                  <p className="text-sm text-gray-600 mt-4">Amount: PHP 1,000.00</p>
                  <p className="text-sm text-gray-600">Mode of Payment: GCash</p>
                  <p className="text-sm text-gray-600">Status: Pending</p>
                </div>
                {/* Modal Footer */}
                <div className="flex justify-end mt-6">
                  <a
                    href={`/path-to-receipts/receipt-${selectedReceipt}.pdf`} // Example receipt path
                    download={`Receipt-${selectedReceipt}.pdf`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Download Receipt
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
//test code
export default PaymentsPage;