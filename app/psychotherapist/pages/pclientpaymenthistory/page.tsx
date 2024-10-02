'use client';

import React from "react";
import { useRouter } from 'next/navigation'; // for handling navigation

// Define the type for payment history props
interface PaymentHistoryProps {
  clientName: string;
  history: {
    week: string;
    fee: string;
    date: string;
    status: "Pending" | "Paid";
  }[];
}

// PaymentHistory Component
const PaymentHistory: React.FC<PaymentHistoryProps> = ({ clientName, history }) => {
  const router = useRouter(); // for navigation

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-md shadow-lg">
      {/* Back button */}
      <div className="flex items-center mb-4">
        <button onClick={() => router.back()} className="text-2xl mr-4 text-black">
          <span>&larr;</span>
        </button>
        <h2 className="text-2xl font-bold">{clientName}</h2>
      </div>
      <p className="text-gray-500 mb-6">Client Payment History</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-600">
              <th className="py-2 px-4">Appointments</th>
              <th className="py-2 px-4">Fee</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                <td className="py-3 px-4">{item.week}</td>
                <td className="py-3 px-4">{item.fee}</td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">
                  {item.status === "Pending" ? (
                    <span className="text-blue-600">● Pending</span>
                  ) : (
                    <span className="text-green-600">● Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// App Component (Root component)
const App: React.FC = () => {
  const paymentHistoryData = [
    { week: "Week 1", fee: "Php 1000", date: "23/04/2024", status: "Pending" },
    { week: "Week 1", fee: "Php 1000", date: "23/04/2024", status: "Paid" },
    { week: "Week 2", fee: "Php 950", date: "28/04/2024", status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <PaymentHistory clientName="Denzel White" history={paymentHistoryData} />
    </div>
  );
};

export default App;
