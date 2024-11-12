"use client";

import React, { useState } from "react";
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import useAuthCheck from "@/auth/page";

const SettingsPage = () => {
  const { loading: authLoading } = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // State variables for profile fields and password fields
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyPerson, setEmergencyPerson] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Validation check for the password
  const isPasswordValid = newPassword.match(
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/) && newPassword === confirmPassword;

  const isProfileValid = contactNumber.trim() !== "" && address.trim() !== "";

  const ToggleSwitch = ({ label, isChecked, onToggle }) => (
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-700">{label}</span>
      <div
        className={`relative w-12 h-6 flex items-center cursor-pointer ${isChecked ? 'bg-green-500' : 'bg-gray-300'} rounded-full p-1`}
        onClick={onToggle}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}
        ></div>
      </div>
    </div>
  );

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

  const handleSaveProfile = () => {
    console.log("Profile saved:", { contactNumber, address, profilePhoto });
    handleModalClose();
  };

  const handleUpdatePassword = () => {
    console.log("Password updated:", newPassword);
    handleModalClose();
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };


  if (authLoading ) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }
  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="min-h-screen flex-grow p-8 bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 text-left">
          <h2 className="text-3xl font-bold text-blue-800">Settings</h2>
          <p className="text-gray-600 mt-2">Manage your account, privacy, and application settings.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("account")}>
            Account
            <button className="text-sm text-blue-400 underline">Edit</button>
          </h3>
          {activeSection === "account" && (
            <div className="mt-4 text-gray-600 space-y-4">
              <div className="flex justify-between items-center">
                <p>Update your profile information:</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                  onClick={handleEditProfileClick}>Edit Profile</button>
              </div>
              <div className="flex justify-between items-center">
                <p>Change your password:</p>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleChangePasswordClick}>Change Password</button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-700 cursor-pointer flex justify-between items-center"
            onClick={() => toggleSection("about")}>
            About
            <button className="text-sm text-blue-400 underline">Learn More</button>
          </h3>
          {activeSection === "about" && (
            <div className="mt-4 text-gray-600">
              <p>Learn more about the app and its features:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Version: 1.0.0</li>
                <li>Developed by: Boltusaurs</li>
                <li>Website: <a href="#" className="text-blue-400 hover:underline">amperalta.com</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
    
        {/* Modal for Editing Profile */}
        <Modal isOpen={isProfileModalOpen} onClose={handleModalClose} title="Edit Profile">
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700">Contact Number</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Emergency Contact Person</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={emergencyPerson}
                onChange={(e) => setEmergencyPerson(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Emergency Contact Number</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Photo</label>
              <input type="file" className="w-full" onChange={handleProfilePhotoChange} />
            </div>
            <button
              className={`w-full py-2 text-white rounded ${isProfileValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handleSaveProfile}
              disabled={!isProfileValid}
            >
              Save Profile
            </button>
          </div>
        </Modal>

        {/* Modal for Changing Password */}
        <Modal isOpen={isChangePasswordModalOpen} onClose={handleModalClose} title="Change Password">
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-700">Current Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-red-500 mt-1">Password must be 8-12 characters, contain a capital letter, a number, and a symbol.</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              className={`w-full py-2 text-white rounded ${isPasswordValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handleUpdatePassword}
              disabled={!isPasswordValid}
            >
              Update Password
            </button>
          </div>
        </Modal>s
    </Layout>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default SettingsPage;