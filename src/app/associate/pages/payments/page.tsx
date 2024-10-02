import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white text-gray-800 p-6 shadow-md">
      <h1 className="text-2xl font-semibold mb-8 text-blue-600">Butterfly</h1>
      <ul>
        <li className="mb-4">
          <a href="#" className="text-gray-800 hover:text-blue-600">Home</a>
        </li>
        <li className="mb-4">
          <a href="#" className="text-gray-800 hover:text-blue-600">Profile</a>
        </li>
        <li className="mb-4">
          <a href="#" className="text-gray-800 hover:text-blue-600">Appointments</a>
        </li>
        <li className="mb-4">
          <a href="#" className="text-gray-800 hover:text-blue-600">Client List</a>
        </li>
        <li className="mb-4">
          <a href="#" className="text-blue-800 hover:text-gray-600">Payments</a>
        </li>
        <li>
          <a href="#" className="text-gray-800 hover:text-blue-600">Logout</a>
        </li>
      </ul>
    </div>
  );
};

const PaymentHistory = () => {
  const payments = [
    { name: 'John Doe', date: 'Oct 3, 2024', amount: '$100', status: 'Completed' },
    { name: 'Jane Smith', date: 'Oct 10, 2024', amount: '$200', status: 'Pending' },
    { name: 'Alex Johnson', date: 'Oct 15, 2024', amount: '$150', status: 'Completed' },
    { name: 'Chris Brown', date: 'Sep 25, 2024', amount: '$250', status: 'Completed' },
    { name: 'Emily Davis', date: 'Sep 18, 2024', amount: '$300', status: 'Pending' },
    { name: 'Michael Scott', date: 'Oct 5, 2024', amount: '$400', status: 'Completed' },
    { name: 'Pam Beesly', date: 'Oct 7, 2024', amount: '$180', status: 'Pending' },
    { name: 'Dwight Schrute', date: 'Oct 12, 2024', amount: '$220', status: 'Completed' },
    { name: 'Hev Abigail', date: 'Oct 25, 2024', amount: '$100', status: 'Failed' },
    { name: 'Rain Lorenzo', date: 'Oct 27, 2024', amount: '$200', status: 'Failed' },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-600">Client Name</th>
            <th className="py-2 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="py-2 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-600">Amount Paid</th>
            <th className="py-2 px-4 bg-gray-100 text-left text-sm font-semibold text-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4 text-gray-700">{payment.name}</td>
              <td className="py-2 px-4 text-gray-700">{payment.date}</td>
              <td className="py-2 px-4 text-gray-700">{payment.amount}</td>
              <td className={`py-2 px-4 text-sm font-medium ${payment.status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}>
                {payment.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Greeting */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Good Morning, Associate!</h1>

        {/* Payment History Section */}
        <PaymentHistory />
      </div>
    </div>
  );
};

export default Dashboard;
