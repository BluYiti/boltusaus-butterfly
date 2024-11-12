"use client";

import React from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";

// Sample data for resources
const resourcesData = [
  {
    category: "Wellness",
    items: [
      { title: "Yoga", duration: "10 mins", description: "Find balance, strength, and serenity on the mat." },
      { title: "Goals", duration: "10 mins", description: "Track your goals." },
      { title: "Workout", duration: "10 mins", description: "Stay fit and healthy." },
      { title: "Swimming", duration: "10 mins", description: "Flow with the water." }
    ]
  },
  {
    category: "Worklife",
    items: [
      { title: "Reading", duration: "5 mins", description: "Mental Health at work: How to improve it?" },
      { title: "Drawing", duration: "3 mins", description: "Express yourself with art." }
    ]
  }
];

const Resources = () => {
  const { loading: authLoading } = useAuthCheck(["client"]);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full">
            <h2 className="text-4xl font-bold text-blue-500 font-roboto">Resources</h2>
            <p className="text-gray-600 text-lg font-lora">
            Explore and read mental health resources and take the first step toward a healthier, more balanced you.
            </p>
      </div>

        {/* Display each resource section */}
        {resourcesData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="m-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{section.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="relative bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-lg shadow-md p-5 text-white"
                >
                  <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                  <p className="text-sm">{item.duration}</p>
                  <p className="text-sm">{item.description}</p>
                  <button className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </Layout>
  );
};

export default Resources;
