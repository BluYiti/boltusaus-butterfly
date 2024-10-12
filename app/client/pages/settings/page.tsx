"use client";  // Ensure this is a Client Component

import React, { useState } from "react";
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // State variables for profile fields and password fields
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation check for the password
  const isPasswordValid = newPassword.match(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/
  ) && newPassword === confirmPassword;

  const isProfileValid = contactNumber.trim() !== "" && address.trim() !== "";

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleEditProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleChangePasswordClick = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleModalClose = () => {
    setIsProfileModalOpen(false);
    setIsChangePasswordModalOpen(false);
  };

  // Handler for saving profile changes
  const handleSaveProfile = () => {
    // Placeholder function for saving to the database
    console.log("Profile saved:", { contactNumber, address, profilePhoto });
    handleModalClose();
  };

  // Handler for saving password changes
  const handleUpdatePassword = () => {
    // Placeholder function for saving the new password to the database
    console.log("Password updated:", newPassword);
    handleModalClose();
  };

  // Handler for profile photo change
  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="flex-grow p-8 bg-gray-100">
        {/* Settings Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 text-left">
          <h2 className="text-3xl font-bold text-blue-800">Settings</h2>
          <p className="text-gray-600 mt-2">Manage your account, privacy, and application settings below.</p>
        </div>

        {/* Account Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3
            className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("account")}
          >
            Account
            <button className="text-sm text-blue-400 underline">Edit</button>
          </h3>
          {activeSection === "account" && (
            <div className="mt-4 text-gray-600 space-y-4">
              <div className="flex justify-between items-center">
                <p>Update your profile information:</p>
                <button 
                  className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
                  onClick={handleEditProfileClick} // Open the profile editing modal
                >
                  Edit Profile
                </button>
              </div>
              <div className="flex justify-between items-center">
                <p>Change your password:</p>
                <button 
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleChangePasswordClick} // Open the change password modal
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Privacy and Security Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3
            className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("privacy")}
          >
            Privacy and Security
            <button className="text-sm text-blue-400 underline">Manage</button>
          </h3>
          {activeSection === "privacy" && (
            <div className="mt-4 text-gray-600">
              <div className="flex justify-between items-center">
                <p>Manage your data-sharing preferences:</p>
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Manage Privacy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help and Support Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3
            className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("help")}
          >
            Help and Support
            <button className="text-sm text-blue-400 underline">Get Help</button>
          </h3>
          {activeSection === "help" && (
            <div className="mt-4 text-gray-600 space-y-4">
              <div className="flex justify-between items-center">
                <p>Contact our support team:</p>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Contact Support
                </button>
              </div>
              <div className="flex justify-between items-center">
                <p>Browse FAQs and guides:</p>
                <button className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">
                  View FAQs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3
            className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("about")}
          >
            About
            <button className="text-sm text-blue-400 underline">Learn More</button>
          </h3>
          {activeSection === "about" && (
            <div className="mt-4 text-gray-600">
              <p>Learn more about the app and its features:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Version: 1.0.0</li>
                <li>Developed by: Boltusaurs</li>
                <li>Website: <a href="#" className="text-blue-400 hover:underline">www.amperalta.com</a></li>
              </ul>
            </div>
          )}
        </div>


         {/* Modal for Editing Profile */}
         <Modal isOpen={isProfileModalOpen} onClose={handleModalClose} title="Edit Profile">
          <div className="mb-4">
            <label className="block text-gray-700">Profile Photo:</label>
            <input
              type="file"
              className="w-full px-3 py-2 border rounded"
              accept="image/*"
              onChange={handleProfilePhotoChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Contact Number:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Enter your contact number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            className={`px-4 py-2 text-white rounded ${isProfileValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!isProfileValid}
          >
            Save Changes
          </button>
        </Modal>

        {/* Modal for Changing Password */}
        <Modal isOpen={isChangePasswordModalOpen} onClose={handleModalClose} title="Change Password">
          <div className="mb-4">
            <label className="block text-gray-700">Current Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
            <p className="text-xs text-red-500 mt-1">Password must be 8-12 characters, contain a capital letter, a number, and a symbol.</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm New Password:</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            className={`px-4 py-2 text-white rounded ${isPasswordValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!isPasswordValid}
          >
            Update Password
          </button>
        </Modal>
      </div>
    </Layout>
  );
};

export default SettingsPage;