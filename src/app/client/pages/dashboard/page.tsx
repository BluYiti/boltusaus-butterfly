"use client";  // Ensure this is a Client Component

import React from "react";
import { useRouter } from "next/navigation";  // Correct import for Next.js 13 App Router

const SecurityPage: React.FC = () => {
  const router = useRouter();

  // Function to handle going back to the previous page
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-black flex justify-start p-6 bg-white min-h-screen relative">
      {/* Back button */}
      <button
        className="absolute top-4 left-4 bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center"
        onClick={handleBack}
      >
        {/* Icon for back button (chevron left or arrow left) */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="w-full max-w-2xl mr-auto mt-20">
        <h1 className="text-4xl font-bold mb-10 text-left">Security</h1>

        <div className="space-y-6 text-left">
          {/* Private Account */}
          <div>
            <p className="text-2xl font-semibold">Private account</p>
            <p className="text-lg text-gray-500">You only have access to your account.</p>
          </div>

          {/* Assessments Privacy */}
          <div>
            <p className="text-2xl font-semibold">All assessments are private</p>
            <p className="text-lg text-gray-500">Only the Psychotherapist can view your pre-assessment and assessment scores.</p>
          </div>

          {/* Payment Accounts */}
          <div>
            <p className="text-2xl font-semibold">Payment Accounts</p>
            <p className="text-lg text-gray-500">Payment accounts can’t be accessed by Psychotherapists and Associates.</p>
          </div>

          {/* End-to-End Encryption */}
          <div>
            <p className="text-2xl font-semibold">End-to-End Encryption</p>
            <p className="text-lg text-gray-500">All communication between you and your Psychotherapist is encrypted to ensure your privacy and security.</p>
          </div>

          {/* Multi-Factor Authentication */}
          <div>
            <p className="text-2xl font-semibold">Multi-Factor Authentication (MFA)</p>
            <p className="text-lg text-gray-500">Enhance your account security by enabling multi-factor authentication for an extra layer of protection.</p>
          </div>

          {/* Data Retention */}
          <div>
            <p className="text-2xl font-semibold">Data Retention</p>
            <p className="text-lg text-gray-500">We retain your data only as long as necessary. You can request data deletion or correction at any time through your account settings.</p>
          </div>

          {/* Data Protection Compliance */}
          <div>
            <p className="text-2xl font-semibold">Data Protection Compliance</p>
            <p className="text-lg text-gray-500">We are compliant with industry-standard data protection regulations, including GDPR and HIPAA, ensuring that your privacy is respected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
