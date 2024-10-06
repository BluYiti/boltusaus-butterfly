import { useState } from "react";
import { ID } from "appwrite";
import { databases, client } from "@/appwrite"; // Ensure you're using the correct imports
import { FiX } from "react-icons/fi";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string; // To know which tab is currently active
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, selectedTab }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Example collectionId and databaseId. Replace with your actual IDs
      const databaseId = "your-database-id";
      const collectionId = "your-collection-id";

      // Payload for creating a new user account
      const payload = {
        name,
        email,
        phone,
        password,
        tab: selectedTab // To distinguish between client, associate, and psychotherapist
      };

      // Example creating document in a specific collection
      await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(), // Unique ID for each user
        payload
      );

      setLoading(false);
      onClose(); // Close the modal after successful submission
      // Optionally reset the form fields
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      console.error("Error creating account:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Account</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {loading ? "Adding..." : "Add Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
