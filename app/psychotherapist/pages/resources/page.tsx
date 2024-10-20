"use client";
import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import React, { useRef } from 'react';

const ResourcesPage: React.FC = () => {
  // Sample resources data
  const resources = [
    {
      id: 1,
      category: "Wellness",
      title: "Yoga",
      duration: "10 mins",
      description: "Find balance, strength, and serenity on the mat.",
      image: "/path/to/yoga.jpg", // Update with actual path
    },
    {
      id: 2,
      category: "Wellness",
      title: "Journaling",
      duration: "10 mins",
      description: "Journal your journey.",
      image: "/path/to/journaling.jpg", // Update with actual path
    },
    {
      id: 3,
      category: "Wellness",
      title: "Workout",
      duration: "10 mins",
      description: "Stay fit and healthy.",
      image: "/path/to/workout.jpg", // Update with actual path
    },
    {
      id: 4,
      category: "Worklife",
      title: "Reading",
      duration: "5 mins",
      description: "Mental health at work: How to improve it?",
      image: "/path/to/reading.jpg", // Update with actual path
    },
    {
      id: 5,
      category: "Worklife",
      title: "Drawing",
      duration: "3 mins",
      description: "Express yourself with art.",
      image: "/path/to/drawing.jpg", // Update with actual path
    },
    {
      id: 6,
      category: "Wellness",
      title: "Take time off",
      duration: "5 mins",
      description: "It is okay to rest.",
      image: "/path/to/rest.jpg", // Update with actual path
    },
    {
      id: 7,
      category: "Psychology",
      title: "Contemplate",
      duration: "3 mins",
      description: "It is okay to rest.",
      image: "/path/to/contemplate.jpg", // Update with actual path
    }
  ];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-gray-50">
        {/* Main Content */}
        <div className="flex-grow flex flex-col bg-white px-10 py-8 overflow-y-auto">
          {/* Top Section with Title */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6">
            <h1 className="text-xl font-bold text-gray-800">Resources</h1>
          </div>

          {/* Resource Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-0 right-0 p-2">
                    <button onClick={handleUploadClick} className="text-gray-500 hover:text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {resource.title}
                  </h2>
                  <p className="text-sm text-gray-500">{resource.duration}</p>
                  <p className="mt-2 text-gray-600">{resource.description}</p>
                </div>
                <div className="flex justify-between items-center p-4 border-t">
                  <p className="text-sm text-gray-500">{resource.category}</p>
                  <button className="text-red-500 hover:text-red-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Upload Resource Card */}
            <div className="bg-gray-200 rounded-lg shadow-lg flex flex-col justify-center items-center h-64">
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <p className="mt-4 text-gray-500">Upload Resource</p>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  // Handle the file upload (you can implement your logic here)
                  console.log(files[0]); // Example: Log the first selected file
                }
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;