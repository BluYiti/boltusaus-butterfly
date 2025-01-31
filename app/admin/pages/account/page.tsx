"use client";

import { useEffect, useState } from "react";
import items from "@/admin/data/Links";
import Layout from "@/components/Sidebar/Layout";
import { databases, Query } from "@/appwrite";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import AddAccountModal from "@/admin/components/AddAccountModal";
import EditAccountModal from "@/admin/components/EditAccountModal";
import DeleteAccountModal from "@/admin/components/DeleteAccountModal";

const ROLES = ["Client", "Associate", "Psychotherapist"];

const Account = () => {
  const authLoading = useAuthCheck(["admin"]);
  const [selectedTab, setSelectedTab] = useState(ROLES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Record<string, any[]>>({}); // Cache users per role
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      if (users[selectedTab]) return; // Skip fetching if cached
      setIsLoading(true);
      try {
        const response = await databases.listDocuments("Butterfly-Database", "Accounts", [
          Query.equal("role", selectedTab),
        ]);
        setUsers((prevUsers) => ({ ...prevUsers, [selectedTab]: response.documents }));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [selectedTab]);

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const filteredUsers = (users[selectedTab] || []).filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLastUser - usersPerPage, indexOfLastUser);
  const totalEntries = filteredUsers.length;

  if (authLoading) return <LoadingScreen />;

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-white rounded-b-lg shadow-md p-5">
        <h2 className="text-2xl font-bold">Accounts</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex space-x-4">
            {ROLES.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 rounded ${selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder={`Search ${selectedTab.toLowerCase()}s by name`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 w-full md:w-auto px-4 py-2 border rounded"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        ) : (
          <div className="bg-white rounded shadow p-4 overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">{selectedTab} List</h2>
            {currentUsers.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">UserID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.$id} className="border-t">
                      <td className="px-4 py-2">{user.$id}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No {selectedTab.toLowerCase()}s found.</p>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
          <span>
            Showing {indexOfLastUser - usersPerPage + 1} to {Math.min(indexOfLastUser, totalEntries)} out of {totalEntries} entries
          </span>
          <div className="space-x-2">
            {Array.from({ length: Math.ceil(totalEntries / usersPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
