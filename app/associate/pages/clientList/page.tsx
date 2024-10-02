'use client'
import { useState } from "react";

type Client = {
  initials: string;
  name: string;
  color: string;
  paymentHistory?: Payment[];
};

type Payment = {
  week: string;
  fee: string;
  date: string;
  status: string;
};

const clientsData: Client[] = [
  {
    initials: "DW",
    name: "Denzel White",
    color: "bg-blue-300",
    paymentHistory: [
      { week: "Week 1", fee: "Php 1000", date: "23/04/2024", status: "Paid" },
      { week: "Week 2", fee: "Php 1000", date: "30/04/2024", status: "Paid"},
      { week: "Week 3", fee: "Php 950", date: "23/04/2024", status: "Paid" },
    ],
  },
  { initials: "GS", name: "Gwen Stacey", color: "bg-red-300" },
  { initials: "RJ", name: "Robert Junior", color: "bg-indigo-300" },
  { initials: "HA", name: "Hev Abigail", color: "bg-orange-300" },
  { initials: "TE", name: "Thomas Edison", color: "bg-teal-300" },
];

export default function ClientListPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clientsData.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle back button (to return to the client list view)
  const handleBackClick = () => {
    setSelectedClient(null);
  };

  // Render payment history
  const renderPaymentHistory = (client: Client) => (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={handleBackClick} className="mr-4 text-3xl">
            ⬅️
          </button>
          <h1 className="text-2xl">{client.name}</h1>
        </div>
        <nav className="space-x-4">
          <a href="#" className="hover:text-blue-200">Dashboard</a>
          <a href="#" className="hover:text-blue-200">Appointments</a>
          <a href="#" className="hover:text-blue-200">Client List</a>
        </nav>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Client Payment History</h2>
          <table className="min-w-full bg-gray-50 rounded-lg">
            <thead>
              <tr className="text-left bg-gray-200">
                <th className="p-4">Appointments</th>
                <th className="p-4">Fee</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {client.paymentHistory?.map((payment, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{payment.week}</td>
                  <td className="p-4">{payment.fee}</td>
                  <td className="p-4">{payment.date}</td>
                  <td className="p-4 flex items-center">
                    <span className="mr-2">
                      {payment.status === "Paid" ? (
                        <span className="text-green-500">● Paid</span>
                      ) : (
                        <span className="text-red-500">● Not Paid</span>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );

  // Render the client list view
  return selectedClient ? (
    renderPaymentHistory(selectedClient)
  ) : (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="rounded-full bg-white p-2 text-blue-600">👤</span>
          <h1 className="ml-4 text-2xl">Client List</h1>
        </div>
        <nav className="space-x-4">
          <a href="#" className="hover:text-blue-200">Dashboard</a>
          <a href="#" className="hover:text-blue-200">Appointments</a>
          <a href="#" className="hover:text-blue-200">Client List</a>
        </nav>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Search Client"
            />
          </div>

          <ul id="client-list">
            {filteredClients.map((client) => (
              <li
                key={client.name}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md mb-2"
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${client.color} text-white font-bold`}
                  >
                    {client.initials}
                  </div>
                  <span className="ml-4 font-semibold">{client.name}</span>
                </div>
                <button
                  onClick={() => setSelectedClient(client)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  View Payment History
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
