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

      <div className="w-full max-w-2xl mr-auto mt-20">  {/* Added mt-20 for more space at the top */}
        <h1 className="text-4xl font-bold mb-10 text-left">Security</h1>  {/* Added mb-10 to separate title from content */}

        <div className="space-y-6 text-left">
          {/* Private Account */}
          <div>
            <p className="text-2xl font-semibold">Private account</p>
            <p className="text-lg text-gray-500">You only have access to your account</p>
          </div>

          {/* Assessments Privacy */}
          <div>
            <p className="text-2xl font-semibold">All assessments are private</p>
            <p className="text-lg text-gray-500">Only the Psychotherapist can view your pre-assessment and assessment scores</p>
          </div>

          {/* Recorded Sessions */}
          <div>
            <p className="text-2xl font-semibold">Recorded sessions are only accessed by the Psychotherapist</p>
          </div>

          {/* Payment Accounts */}
          <div>
            <p className="text-2xl font-semibold">Payment Accounts</p>
            <p className="text-lg text-gray-500">Can’t be accessed by Psychotherapists and Associates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
