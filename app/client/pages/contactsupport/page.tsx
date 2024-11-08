"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div
      className="text-gray-700 flex flex-col justify-start items-center min-h-screen bg-cover bg-center p-8 space-y-6 mt-0"
      style={{ backgroundImage: "url('/images/contact.jpeg')" }}
    >
      <button
        onClick={() => router.push('/client/pages/settings')}
        className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition duration-200 self-start mb-4"
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold text-center">Contact Us</h1>
      <p className="text-center text-lg max-w-md">
        Use this form to reach out to our Customer Support regarding any questions, concerns, or feedback.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white bg-opacity-80 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 transition duration-200 h-32 resize-none"
        />
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
