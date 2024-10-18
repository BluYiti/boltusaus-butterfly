'use client'

import { useState } from "react";
import { ID, Query } from "appwrite";
import { databases, account } from "@/appwrite"; // Ensure you're using the correct imports
import { FiX } from "react-icons/fi";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTab: string; // To know which tab is currently active
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, selectedTab }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation error states
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const validateInputs = () => {
    const newErrors: any = {};
    // Validate first name
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    else if (firstName.length < 2) newErrors.firstName = "First name must be at least 2 characters.";

    // Validate last name
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    else if (lastName.length < 2) newErrors.lastName = "Last name must be at least 2 characters.";

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!emailPattern.test(email)) newErrors.email = "Invalid email format.";

    // Validate phone (Philippine numbers only, assuming 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!phonePattern.test(phone)) newErrors.phone = "Phone number must be 10 digits.";

    // Validate password
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";

    setErrors(newErrors);

    // If there are no errors, return true; otherwise, return false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return; // Stop if validation fails

    setLoading(true);
  
    try {
      const name = `${firstName} ${lastName}`;

      console.log("User Data:", { email, password, name });
  
      // Check if email already exists in the "Accounts" collection
      const existingUser = await databases.listDocuments('Butterfly-Database', 'Accounts', [
        Query.equal('email', email)
      ]);
  
      if (existingUser.documents.length > 0) {
        throw new Error('A user with this email already exists');
      }
  
      // Proceed to create the Appwrite account
      try {
        const userResponse = await account.create(ID.unique(), email, password, name);
        const accountId = userResponse.$id;
  
        // Create the user in the "Accounts" collection
        await databases.createDocument('Butterfly-Database', 'Accounts', accountId, {
          username: name,
          email: email,
          role: selectedTab.toLowerCase(),
        });
  
        console.log('Accounts Collection document added');
  
        // Create the user in the selected tab collection
        await databases.createDocument('Butterfly-Database', selectedTab, ID.unique(), {
          userId: accountId,
          firstName: firstName,
          lastName: lastName,
          phonenum: phone
        });
  
        console.log(selectedTab, ' Collection document added');

        onClose(); // Close the modal
      } catch (error: any) {
        // Handle the conflict error when email/phone already exists in Appwrite's account system
        if (error.code === 409) {
          alert('An account with this email or phone number already exists.');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Error creating account:", error);
      alert(error.message || "An error occurred while creating the account.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New {selectedTab} Account</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-[#38b6ff] mb-1">First Name</label>
            <input
                id="firstName"
                type="text"
                required
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div className="mb-4">
              <label htmlFor="lastName" className="block text-[#38b6ff] mb-1">Last Name</label>
              <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
              />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#38b6ff] mb-1">Email</label>
            <input
                id="email"
                type="email"
                required
                placeholder="Example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="flex">
              <input
                type="text"
                value="+63"
                className="mt-1 p-2 w-16 border rounded-l bg-gray-200 text-gray-700"
                readOnly
              />
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-1 p-2 w-full border rounded-r ${errors.phone ? 'border-red-500' : ''}`}
                required
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[#38b6ff] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#38b6ff] rounded-xl pl-3 pr-10 py-2 w-full text-gray-500"
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
