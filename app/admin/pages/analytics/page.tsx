'use client'

// admin/pages/analytics/page.tsx
import Layout from "@/components/Sidebar/Layout";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { client, databases } from "@/appwrite"; // Adjust the import based on your appwrite.ts location
import items from "@/admin/data/Links";

const userEngagementData = [
  { month: 'Jan', activeUsers: 1200, sessions: 2400 },
  { month: 'Feb', activeUsers: 1300, sessions: 2600 },
  { month: 'Mar', activeUsers: 1500, sessions: 2800 },
  { month: 'Apr', activeUsers: 1400, sessions: 2700 },
  { month: 'May', activeUsers: 1600, sessions: 3000 },
];

const revenueData = [
  { month: 'Jan', revenue: 40000 },
  { month: 'Feb', revenue: 42000 },
  { month: 'Mar', revenue: 45000 },
  { month: 'Apr', revenue: 47000 },
  { month: 'May', revenue: 50000 },
];

const Analytics = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<number | null>(null);

  // Fetch total and online users
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        // Fetch total users from the database (replace 'YOUR_DATABASE_ID' and 'YOUR_COLLECTION_ID' with actual values)
        const response = await databases.listDocuments('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID');
        setTotalUsers(response.total); // Set total users count based on the response
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    // Mock logic for fetching online users (replace with real logic)
    const fetchOnlineUsers = async () => {
      try {
        // Implement your logic to fetch online users
        // This could involve checking active sessions or a custom logic based on your application
        // Example:
        const activeUsers = await databases.listDocuments('YOUR_DATABASE_ID', 'YOUR_ACTIVE_USERS_COLLECTION_ID');
        setOnlineUsers(activeUsers.total); // Assuming total gives the number of online users
      } catch (error) {
        console.error('Error fetching online users:', error);
      }
    };

    fetchTotalUsers();
    fetchOnlineUsers();
  }, []);
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10"> {/* Fixed position with full width */}
        <h2 className="text-2xl font-bold">About Me</h2>
      </div>
      {/* User Engagement Section */}
      <section className="bg-gray-100">
        <h2 className="text-2xl font-bold text-black px-10 pt-5">Analytics</h2>
        <div className="px-10 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Users & Sessions Card */}
          <div className="p-5 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-3">Active Users & Sessions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#8884d8" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#82ca9d" 
                  strokeWidth={3} 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bounce Rate Card */}
          <div className="p-5 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-3 ">Bounce Rate</h3>
            <div className="text-5xl font-bold text-black mb-2">45%</div>
            <p className="text-sm text-gray-500">-5% from last month</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ rate: 45 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis />
                <Bar dataKey="rate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Total Users Card */}
          <div className="bg-white shadow-lg rounded-lg p-4 h-32 flex flex-col justify-center items-center transition-transform transform hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
            <p className="text-4xl font-bold">
              {totalUsers !== null ? totalUsers : 'Loading...'}
            </p>
          </div>

          {/* Online Users Card */}
          <div className="bg-white shadow-lg rounded-lg p-4 h-32 flex flex-col justify-center items-center transition-transform transform hover:scale-105">
            <h2 className="text-lg font-semibold text-gray-800">Online Users</h2>
            <p className="text-4xl font-bold">
              {onlineUsers !== null ? onlineUsers : 'Loading...'}
            </p>
          </div>
        </div>
      </section>

      {/* Revenue Data Section */}
      <section className="mb-8 px-10 bg-gray-100">
        <h2 className="text-2xl font-bold text-black pt-10 pb-5">Revenue Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-medium">Total Revenue</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-medium">Average Revenue Per User (ARPU)</h3>
            <div className="text-3xl font-bold">$25</div>
            <p className="text-sm text-gray-600">+10% from last month</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg mb-5">
            <h3 className="text-lg font-medium">Customer Lifetime Value (CLTV)</h3>
            <div className="text-3xl font-bold">$200</div>
            <p className="text-sm text-gray-600">+5% from last month</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Analytics;
