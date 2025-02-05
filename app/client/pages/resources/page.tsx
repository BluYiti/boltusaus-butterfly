'use client'

import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import React, { useState, useEffect } from 'react';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import Image from 'next/image';
import { databases, storage } from '@/appwrite';

interface Resource {
  $id: string;          // Unique identifier for the resource document
  title: string;        // The title of the resource
  image?: string;       // Optional image field (ID of the image file)
  file: string;         // File ID for the actual resource
  duration: string;     // Duration or other time-related information
  description: string;  // Description of the resource
}


const ResourcesPage: React.FC = () => {
  const authLoading = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [resources, setResources] = useState<Resource[]>([]);

  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Butterfly-Database';
  const COLLECTION_ID = 'Resources'; 
  const BUCKET_ID = 'Resources'; 

  // Fetch resources from Appwrite database
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        setResources(response.documents as unknown as Resource[]); // Cast the response to Resource[]
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchResources();
  }, [DATABASE_ID, COLLECTION_ID]);

  // Dynamically generate file or image URL based on the stored ID
  const getFileUrl = (fileId: string) => {
    return storage.getFileView(BUCKET_ID, fileId); // Generate URL using file ID
  };

  if (authLoading) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div>
        <div className="flex-grow flex flex-col px-10 py-8 overflow-y-auto">
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6">
            <h1 className="text-xl font-bold text-gray-800">Resources</h1>
          </div>

          {/* List of Resources */}
          {resources.length === 0 ? (
            <p>No resources available.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div 
                  key={resource.$id} 
                  className="bg-white rounded-lg shadow-lg relative p-4 cursor-pointer" 
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(getFileUrl(resource.file), "_blank");
                    }
                  }}
                >
                  {resource.image ? (
                    <Image
                      src={getFileUrl(resource.image)} // The image URL
                      alt={resource.title}              // Image alt text
                      width={600}                        // Set a fixed width
                      height={160}                       // Set a fixed height
                      className="rounded-t-lg"          // Any additional styling you need
                      objectFit="cover"                 // Ensures the image is cropped to fill the container (like 'object-cover')
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.duration}</p>
                    <p className="text-gray-600 mt-2">{resource.description}</p>
                    <div className="mt-4">
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
