"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Image from 'next/image';
import { Query } from "appwrite";
import { account, databases, storage } from "@/appwrite";
import LoadingScreen from "@/components/LoadingScreen";
import useAuthCheck from "@/auth/page";

// Define the item and category types
interface Item {
  id: string;
  duration: string;
  description: string;
  file: string; // This will be the file URL to navigate to
  createdAt: string;
  category: string;
  title: string;
  image: string; // This is the cover image URL
}

interface Resource {
  id: string;
  duration: string;
  description: string;
  file: string; // The file ID from the Appwrite storage
  createdAt: string;
  category: string;
  title: string;
  image: string; // The image ID from Appwrite storage
}

interface Category {
  title: string;
  items: Item[];
}

const App = () => {
  const authLoading = useAuthCheck(['client']);
  const [categories, setCategories] = useState<Category[]>([]); // State to hold fetched resources
  const [userName, setUserName] = useState("User"); // State to hold the user's name
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State to hold the user's profile picture URL

  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "Butterfly-Database";
  const COLLECTION_ID = "Resources"; 
  const CLIENT_COLLECTION_ID = "Client"; // Your Client collection
  const IMAGE_BUCKET_ID = "Images"; // Bucket ID for profile images
  const RESOURCE_BUCKET_ID = "Resources"; // Bucket ID for resources (files, images)

  // Fetch resources from Appwrite
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        const resources = response.documents as unknown as Resource[]; // Cast documents to Resource[]

        // Transform resources safely in reduce
        const transformedCategories = resources.reduce((acc: Category[], resource) => {
          const category = acc.find(cat => cat.title === resource.category);
          const fileUrl = storage.getFileView(RESOURCE_BUCKET_ID, resource.file);
          const imageUrl = storage.getFileView(RESOURCE_BUCKET_ID, resource.image);
        
          if (category) {
            category.items.push({
              ...resource, // Spread properties from resource
              file: fileUrl,
              image: imageUrl,
            });
          } else {
            acc.push({
              title: resource.category,
              items: [{
                ...resource,
                file: fileUrl,
                image: imageUrl,
              }],
            });
          }
        
          return acc;
        }, [] as Category[]);
        
        
        

        setCategories(transformedCategories);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };

    // Fetch user's name and profile picture from Appwrite
    const fetchUserProfile = async () => {
      try {
        const user = await account.get(); // Get the authenticated user
        setUserName(user.name); // Set the user's name

        // Query the Client collection by userId (relationship attribute)
        const clientResponse = await databases.listDocuments(DATABASE_ID, CLIENT_COLLECTION_ID, [
          Query.equal('userid', user.$id) // Assuming 'userId' is the relationship to the user
        ]);

        if (clientResponse.documents.length > 0) {
          const profileFileId = clientResponse.documents[0].idFile; // Fetch the profile picture file ID
          
          // If there is a profile picture, fetch its URL from the Images bucket
          if (profileFileId) {
            const profileUrl = storage.getFileView(IMAGE_BUCKET_ID, profileFileId); // Get profile picture URL
            setProfilePicture(profileUrl);
          }
        } else {
          console.error("No profile found for user");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchResources();
    fetchUserProfile(); // Fetch user name and profile picture
  }, [DATABASE_ID]);

  // Function to handle card click and redirect to file URL
  const handleCardClick = (fileUrl: string) => {
    if (!fileUrl) {
      console.error("Invalid file URL");
      return;
    }
    if (typeof window !== "undefined") {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };  

  if (authLoading) return <LoadingScreen />;

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-between bg-gray-100">
          {/* Top Section with User Info and Header */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Display profile picture if available, otherwise fall back to icon */}
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                  width={32}  // Adjust width for the profile image
                  height={32} // Adjust height accordingly
                  priority  // Optional: Helps with fast loading of important images
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <FaUser size={24} />
                </div>
              )}
              <h1 className="text-xl font-semibold">
                <span className="font-bold">{userName}</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4"></div>
          </div>
          <div className="text-black min-h-screen bg-white">
            {/* Content */}
            <div className="border-t border-blue-500 mt-4 pt-2">
              <h2 className="text-xl font-semibold mb-4">Explore</h2>
            </div>
            <main className="grid grid-cols-1 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <section key={category.title}>
                  <div className="p-2">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border-2 border-blue-500 rounded-lg shadow-2xl relative p-4 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl duration-300"
                        onClick={() => handleCardClick(item.file)} // Open file in new tab
                      >
                        {/* Display image or fallback */}
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-t-lg"
                            width={500}  // You can adjust the width as needed
                            height={160} // Adjust the height accordingly
                            priority  // Optional: Add this if it's important for LCP (helps with above-the-fold images)
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <p className="text-gray-500">No image</p>
                          </div>
                        )}
                        {/* Card details */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.duration}</p>
                          <p className="text-gray-600 mt-2">{item.description}</p>
                          <div className="border-t border-blue-500 mt-4 pt-2">
                            <p className="text-sm text-gray-500">{item.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
