'use client';

import { useEffect, useState } from "react";
import AddAccountModal from "@/admin/components/AddAccountModal";
import Layout from "@/components/Sidebar/Layout";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid"; // Heroicons for pencil and trash icons
import { databases } from "@/appwrite"; // Import the databases instance from appwrite.tsx
import items from "@/admin/data/Links";

interface User {
  id: string; // Assuming user ID is a string, adjust as needed
  name: string;
  email: string;
  phone: string;
  role: string;
}

const Account = () => {
  const [selectedTab, setSelectedTab] = useState("Client"); // Default to Client tab
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10); // Users displayed per page

  // Fetch users from Appwrite database on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await databases.listDocuments(
          "YOUR_DATABASE_ID", // Replace with your actual database ID
          "YOUR_COLLECTION_ID" // Replace with your actual collection ID
        );
        setUsers(response.documents);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handler to switch between tabs
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
    setCurrentPage(1); // Reset to the first page
  };

  // Open modal to add account
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Edit handler
  const handleEdit = (userId: string) => {
    console.log("Edit user with ID:", userId);
  };

  // Delete handler
  const handleDelete = (userId: string) => {
    console.log("Delete user with ID:", userId);
  };

  // This function will filter users based on the search query and selected tab
  const filteredUsers = () => {
    return users.filter(
      (user) =>
        user.role === selectedTab &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers().slice(indexOfFirstUser, indexOfLastUser);
  const totalEntries = filteredUsers().length;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Layout sidebarTitle="Admin" sidebarItems={items}>
      {/* Flex container for Tabs, Search Input, and Add Account Button */}
      <div className="flex justify-between items-center mb-6 space-x-4">
        {/* Tabs for Client, Associate, Psychotherapist */}
        <div className="flex space-x-4">
          {["Client", "Associate", "Psychotherapist"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded ${
                selectedTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Search ${selectedTab.toLowerCase()}s by name`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Add Account Button */}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={openModal}
        >
          Add Account
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-4">{selectedTab} List</h2>
        {currentUsers.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">UserID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Actions</th> {/* Actions column */}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    {/* Pencil Icon for Edit */}
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    {/* Trash Icon for Delete */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No {selectedTab.toLowerCase()}s found.</p>
        )}
      </div>

      {/* Pagination and Entries Display */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, totalEntries)} out of {totalEntries} entries
        </span>
        <div>
          {Array.from({ length: Math.ceil(totalEntries / usersPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'text-blue-500'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* AddAccountModal */}
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedTab={selectedTab}
      />
    </Layout>
  );
};

export default Account;
