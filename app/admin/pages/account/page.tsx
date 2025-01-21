'use client'

import { SetStateAction, useEffect, useMemo, useState } from "react";
import items from "@/admin/data/Links";
import Layout from "@/components/Sidebar/Layout";
import { databases } from "@/appwrite"; // Import the databases instance from appwrite.tsx
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid"; // Heroicons for pencil and trash icons
import AddAccountModal from "@/admin/components/AddAccountModal";
import EditAccountModal from "@/admin/components/EditAccountModal";
import DeleteAccountModal from "@/admin/components/DeleteAccountModal";

const ROLES = ["Client", "Associate", "Psychotherapist"];

const Account = () => {
  const authLoading = useAuthCheck(['admin']);
  const [selectedTab, setSelectedTab] = useState(ROLES[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch users from Appwrite database on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await databases.listDocuments("Butterfly-Database", "Accounts");
        setUsers(response.documents);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [setUsers]);

  const handleTabChange = (tab: SetStateAction<string>) => {
    setSelectedTab(tab);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const filteredUsers = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    return users.filter((user) => {
      const roleMatch = user.role?.toLowerCase() === selectedTab.toLowerCase();
      const nameMatch = user.username?.toLowerCase().includes(lowerSearchQuery);
      return roleMatch && nameMatch;
    });
  }, [users, selectedTab, searchQuery]);

  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfLastUser - usersPerPage, indexOfLastUser);
  const totalEntries = filteredUsers.length;

  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  if (authLoading) return <LoadingScreen />;

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-white rounded-b-lg shadow-md p-5">
        <h2 className="text-2xl font-bold">Accounts</h2>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 space-x-4">
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
            className="flex-1 w-full px-4 py-2 border rounded"
          />
          <button 
            className={`px-4 py-2 rounded hover:bg-blue-600 ${selectedTab === "Client" ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`}
            onClick={openAddModal}
            disabled={selectedTab === "Client"}
          >
            Add Account
          </button>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">{selectedTab} List</h2>
          {currentUsers.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">UserID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.$id} className="border-t">
                    <td className="px-4 py-2">{user.$id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedClient(user.$id); // Set the selected client ID
                          openEditModal(); // Open the Edit Modal
                        }} 
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedClient(user.$id); // Set the selected client ID
                          openDeleteModal(); // Open the Edit Modal
                        }} 
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

        <div className="flex justify-between items-center mt-4">
          <span>
            Showing {indexOfLastUser - usersPerPage + 1} to {Math.min(indexOfLastUser, totalEntries)} out of {totalEntries} entries
          </span>
          <div className="space-x-2">
            {Array.from({ length: Math.ceil(totalEntries / usersPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AddAccountModal 
        isOpen={isAddModalOpen} 
        onClose={closeAddModal} 
        selectedTab={selectedTab} 
      />
      <EditAccountModal 
        isOpen={isEditModalOpen} 
        onClose={closeEditModal} 
        selectedTab={selectedTab} 
        clientId={selectedClient}
      />
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal} 
        selectedTab={selectedTab} 
        clientId={selectedClient}
      />
    </Layout>
  );
};

export default Account;
