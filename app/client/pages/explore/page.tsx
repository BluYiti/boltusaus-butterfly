"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import { Client, Databases, Account, Storage, Query } from "appwrite";

// Define the item and category types
interface Item {
  id: number;
  duration: string;
  description: string;
  file: string; // This will be the file URL to navigate to
  createdAt: string;
  category: string;
  title: string;
  image: string; // This is the cover image URL
}

interface Category {
  title: string;
  items: Item[];
}

const App = () => {
  const [categories, setCategories] = useState<Category[]>([]); // State to hold fetched resources
  const [userName, setUserName] = useState("User"); // State to hold the user's name
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State to hold the user's profile picture URL

  // Initialize Appwrite Client
  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

  const databases = new Databases(client);
  const account = new Account(client); // Appwrite Account service for user authentication
  const storage = new Storage(client);

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
        const resources = response.documents;

        // Transform the fetched resources to fit the current design structure
        const transformedCategories = resources.reduce((acc: Category[], resource: any) => {
          const category = acc.find(cat => cat.title === resource.category);

          // Dynamically generate file and image URLs from their IDs in the Resources bucket
          const fileUrl = storage.getFileView(RESOURCE_BUCKET_ID, resource.file); // Get the file view URL from Appwrite
          const imageUrl = storage.getFileView(RESOURCE_BUCKET_ID, resource.image); // Get the image view URL from Appwrite

          if (category) {
            category.items.push({
              id: resource.id,
              duration: resource.duration,
              description: resource.description,
              file: fileUrl, // Use generated file URL
              createdAt: resource.createdAt,
              category: resource.category,
              title: resource.title,
              image: imageUrl, // Use generated image URL
            });
          } else {
            acc.push({
              title: resource.category,
              items: [
                {
                  id: resource.id,
                  duration: resource.duration,
                  description: resource.description,
                  file: fileUrl, // Use generated file URL
                  createdAt: resource.createdAt,
                  category: resource.category,
                  title: resource.title,
                  image: imageUrl, // Use generated image URL
                },
              ],
            });
          }

          return acc;
        }, []);

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
  }, []);

  // Function to handle card click and redirect to file URL
  const handleCardClick = (fileUrl: string) => {
    window.open(fileUrl, "_blank"); // Open the file in a new tab
  };

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
                <img
                  src={profilePicture}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
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
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-t-lg"
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
