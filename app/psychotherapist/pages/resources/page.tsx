'use client'

import Layout from "@/components/Sidebar/Layout";
import items from "@/psychotherapist/data/Links";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import Image from 'next/image';
import { databases, storage } from '@/appwrite';
import { FaEdit } from "react-icons/fa";

interface Resource {
  $id: string;
  id: number;          // Unique identifier for the resource
  description: string; // Description of the resource
  file: string;        // File associated with the resource (could be a path or URL)
  createdAt: Date;     // Timestamp of when the resource was created
  category: string;    // Category of the resource (e.g., 'video', 'document', etc.)
  title: string;       // Title of the resource
  image: string;       // Image associated with the resource (could be a URL or file path)
}

interface Payload {
  image: string;
  file: string;
  category: string;    // Category of the resource (e.g., 'video', 'document', etc.)
  title: string;       // Title of the resource
  description: string; // Description of the resource
}

const ResourcesPage: React.FC = () => {
  const authLoading = useAuthCheck(['psychotherapist']); // Call the useAuthCheck hook
  const [resources, setResources] = useState<Resource[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [, setNewResourceId] = useState<string | null>(null); 
  const [, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(''); 
  const [imageUrl, setImageUrl] = useState(''); 
  const [modalFileUrl, setModalFileUrl] = useState(''); 
  const [modalImageUrl, setModalImageUrl] = useState(''); 
  const [modalCategory, setModalCategory] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null); 
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, ] = useState(false);  // State for Create operation
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingResourceId, setDeletingResourceId] = useState<string | null>(null);

  const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Butterfly-Database';
  const COLLECTION_ID = 'Resources'; 
  const BUCKET_ID = 'Resources'; 

// Memoize fetchResources to avoid re-creating it on every render
const fetchResources = useCallback(async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    const resources: Resource[] = response.documents.map((document) => ({
      $id: document.$id,
      id: document.id || Date.now(), // Use Date.now() as a fallback for `id` if it's missing
      category: document.category || '', // Set default empty string if `category` is missing
      title: document.title || '', // Set default empty string if `title` is missing
      description: document.description || '', // Set default empty string if `description` is missing
      file: document.file || '', // Default to empty string if `file` is missing
      createdAt: document.createdAt ? new Date(document.createdAt) : new Date(), // Use current date if `createdAt` is missing
      image: document.image || '', // Default to empty string if `image` is missing
    }));

    setResources(resources); // Set the resources state with the mapped data
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
}, [DATABASE_ID]); // Empty dependency array means it will only be created once

// Now use the memoized fetchResources function inside the useEffect hook
useEffect(() => {
  fetchResources();
}, [fetchResources]); // This ensures the effect runs only when fetchResources changes

  // Upload function for both image and file
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const uploadedFile = await storage.createFile(BUCKET_ID, 'unique()', file);
      return uploadedFile.$id; // Return the file ID instead of the URL
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Store the selected file
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Store the selected image
  
  // Handle image change when selecting
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]); // Store the selected image file in state
      const previewImageUrl = URL.createObjectURL(files[0]); // Generate preview URL for the image
      setImageUrl(previewImageUrl); // Show image preview
    }
  };
  
  // Handle file change when selecting
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]); // Store the selected file in state
      setFileUrl(files[0].name); // Just display the file name or preview URL
      setFile(e.target.files[0]);
    }
  };

  // Dynamically generate file or image URL based on the stored ID
  const getFileUrl = (fileId: string) => {
    return storage.getFileView(BUCKET_ID, fileId); // Generate URL using file ID
  };
  
  const handleUpdateResource = async () => {
    if (!selectedResourceId) return;

    try {
      setIsUpdating(true);
      const existingResource = resources.find(resource => resource.$id === selectedResourceId);
      if (!existingResource) return;

      // Prepare the update payload
      const updatePayload: Payload = {
        category: modalCategory || existingResource.category,
        title: modalTitle || existingResource.title,
        description: modalDescription || existingResource.description,
        image: '',
        file: ''
      };

      // Check if a new image has been selected
      if (modalImageUrl && imageInputRef.current?.files?.length) {
        if (existingResource.image) {
          await storage.deleteFile(BUCKET_ID, existingResource.image); // Delete existing image using its ID
        }

        // Upload the new image and store its ID
        const uploadedImageId = await uploadFile(imageInputRef.current.files[0]);
        updatePayload.image = uploadedImageId; // Store new image ID
      }

      // Check if a new file has been selected
      if (modalFileUrl && fileInputRef.current?.files?.length) {
        if (existingResource.file) {
          await storage.deleteFile(BUCKET_ID, existingResource.file); // Delete existing file using its ID
        }

        // Upload the new file and store its ID
        const uploadedFileId = await uploadFile(fileInputRef.current.files[0]);
        updatePayload.file = uploadedFileId; // Store new file ID
      }

      // Update the resource document in the database
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, selectedResourceId, updatePayload);

      setIsModalOpen(false); // Close the modal after updating
      fetchResources(); // Refresh the resource list to show updates
    } catch (error) {
      console.error('Error updating resource:', error);
  
      // Extract error message from AppwriteException
      const errorMessage = error.message || 'Failed to updating resource.';
  
      // Handle specific error if missing "file" attribute
      if (errorMessage.includes('Missing required attribute "file"')) {
        setError('File is required but not provided.');
      } else if (errorMessage.includes('Missing required attribute "image"')) {
        setError('Image is required but not provided.');
      } else {
        // Set the error message from Appwrite if it's a different issue
        setError(errorMessage);
      }
  
      setIsCreating(false);
    }
  };

  const handleCreateResource = async () => {
    if (!newCategory.trim() || !newTitle.trim() || !newDescription.trim()) {
      setError('All fields must be filled.');
      return;
    }

    setIsCreating(true);
    try {
      let uploadedImageId = null;
      let uploadedFileId = null;

      // Upload the image only if the user selected an image
      if (selectedImage) {
        uploadedImageId = await uploadFile(selectedImage); // Store the image ID in 'image'
      }

      // Upload the file only if the user selected a file
      if (selectedFile) {
        uploadedFileId = await uploadFile(selectedFile); // Store the file ID in 'file'
      }

      // Create the resource in the database with the IDs (not URLs)
      const response = await databases.createDocument(
        DATABASE_ID, 
        COLLECTION_ID, 
        'unique()', 
        {
          id: Date.now(), 
          category: newCategory, 
          title: newTitle,  
          description: newDescription, 
          image: uploadedImageId,  // Store image ID
          file: uploadedFileId,    // Store file ID
          createdAt: new Date().toISOString(), 
        }
      );

      setNewResourceId(response.$id);
      setNewCategory(''); 
      setNewTitle('');
      setNewDescription('');
      setSelectedFile(null); 
      setSelectedImage(null); 
      setFileUrl(''); 
      setImageUrl(''); 
      setError(null);
      fetchResources(); // Fetch updated resources
      setIsCreateModalOpen(false); // Close modal after creation
    } catch (error) {
      console.error('Error creating resource:', error);
  
      // Extract error message from AppwriteException
      const errorMessage = error.message || 'Failed to create resource.';
  
      // Handle specific error if missing "file" attribute
      if (errorMessage.includes('Missing required attribute "file"')) {
        setError('File is required but not provided.');
      } else if (errorMessage.includes('Missing required attribute "image"')) {
        setError('Image is required but not provided.');
      } else {
        // Set the error message from Appwrite if it's a different issue
        setError(errorMessage);
      }
  
      setIsCreating(false);
    }
  };

  const openModal = (resourceId: string) => {
    const resource = resources.find(res => res.$id === resourceId);
    if (resource) {
      setModalCategory(resource.category);
      setModalTitle(resource.title);
      setModalDescription(resource.description);
    }
    setSelectedResourceId(resourceId);
    setIsModalOpen(true);
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      setDeletingResourceId(resourceId);  // Mark this resource as deleting
      setIsDeleting(true);
      const resource = resources.find(res => res.$id === resourceId);
      if (!resource) return;

      const fileId = resource.file; // Stored file ID
      const imageId = resource.image; // Stored image ID

      if (fileId) {
        await storage.deleteFile(BUCKET_ID, fileId);
      }

      if (imageId) {
        await storage.deleteFile(BUCKET_ID, imageId);
      }

      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, resourceId);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource and file:', error);
    } finally {
      // Always set deleting state to false when done
      setDeletingResourceId(null);  // Reset deletion state for this resource
      setIsDeleting(false);
    }
  };

  // Handle file change in the modal for updating
const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const fileUrl = files[0].name; // Just capture the file name for the modal display
    setModalFileUrl(fileUrl); // Set the preview file name in the modal
    fileInputRef.current = e.target; // Set the reference to the selected file for uploading
  }
};

// Handle image change in the modal for updating
const handleModalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    const imageUrl = URL.createObjectURL(files[0]); // Generate a preview URL for the selected image
    setModalImageUrl(imageUrl); // Update the state to show the preview
    imageInputRef.current = e.target; // Set the reference to the selected file for uploading
  }
};

if (authLoading || loading) {
  return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
}

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex bg-[#eff6ff]">
        <div className="flex-grow flex flex-col bg-[#eff6ff] px-10 py-8 overflow-y-auto">
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center rounded-md mb-6">
            <h1 className="text-xl font-bold text-gray-800">Resources</h1>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* List of Resources */}
          {resources.length === 0 ? (
            <p>No resources available.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#eff6ff]">
              {resources.map((resource) => (
                <div key={resource.$id} className="bg-white rounded-lg shadow-lg relative p-4 cursor-pointer">
                  {resource.image ? (
                    <Image
                      src={getFileUrl(resource.image)}  // Ensure this returns a valid URL
                      alt={resource.title}
                      width={800}  // Define a width (adjust based on your needs)
                      height={160} // Define a height (adjust based on your needs)
                      className="w-full h-40 object-cover rounded-t-lg"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                    <p className="text-gray-600 mt-2">{resource.description}</p>
                    <div className="border-t mt-4 pt-2">
                      <p className="text-sm text-gray-500">{resource.category}</p>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <button onClick={(e) => { e.stopPropagation(); openModal(resource.$id); }} className="bg-white p-2 rounded-full shadow hover:bg-gray-200">
                      <FaEdit className="w-6 h-6 text-gray-800" />
                    </button>
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteResource(resource.$id); }} 
                      className="text-red-500 hover:text-red-700"
                      disabled={deletingResourceId === resource.$id || isDeleting}  // Disable the button for the resource being deleted
                    >
                      {deletingResourceId === resource.$id ? (  // Show spinner only for the deleting resource
                        <svg
                          className="w-6 h-6 animate-spin text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                            d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z"
                            className="opacity-75"
                          />
                        </svg>
                      ) : (
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
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Updating Resource */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-auto">
              <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Update Resource</h3>

                {/* Error message display */}
                {error && (
                  <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <label className="block text-gray-700">Category:</label>
                <input type="text" value={modalCategory} onChange={(e) => setModalCategory(e.target.value)} className="border border-gray-300 rounded px-4 py-2 mb-4 w-full" />

                <label className="block text-gray-700">Title:</label>
                <input type="text" value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} className="border border-gray-300 rounded px-4 py-2 mb-4 w-full" />

                <label className="block text-gray-700">Description:</label>
                <textarea value={modalDescription} onChange={(e) => setModalDescription(e.target.value)} className="border border-gray-300 rounded px-4 py-2 mb-4 h-40 w-full" />

                <label className="block text-gray-700">Update Cover Image:</label>
                <input type="file" className="mb-4" ref={imageInputRef} onChange={handleModalImageChange} />
                {modalImageUrl && (
                  <Image
                    src={modalImageUrl}
                    alt="Preview Image"
                    width={800}  // Replace with your desired width in pixels
                    height={320} // Replace with your desired height in pixels
                    className="w-full h-40 object-cover rounded mb-4"
                    unoptimized
                  />
                )}
                <label className="block text-gray-700">Update File:</label>
                <input type="file" className="mb-4" ref={fileInputRef} onChange={handleModalFileChange} />
                {modalFileUrl && <p>File uploaded successfully.</p>}

                <div className="flex justify-end">
                  <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4">Cancel</button>
                  <button
                    onClick={handleUpdateResource}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={isUpdating} // Disable the button while updating
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Creating a Resource */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 overflow-auto">
              <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Add a Resource Card</h3>

                {/* Error message display */}
                {error && (
                  <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                <label className="block text-gray-700">Category:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter or add new category"
                  className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                />

                <label className="block text-gray-700">Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter or add new title"
                  className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                />

                <label className="block text-gray-700">Description:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter description"
                  className="border border-gray-300 rounded px-4 py-2 mb-4 h-40 w-full"
                />

                <label className="block text-gray-700">Upload Cover Image:</label>
                <input
                  type="file"
                  ref={imageInputRef}
                  className="mb-4"
                  onChange={handleImageChange}
                />
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Preview Image"
                    width={800} // specify the width
                    height={320} // specify the height
                    className="object-cover rounded mb-4"
                    unoptimized
                  />
                )}

                <label className="block text-gray-700">Upload File:</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="mb-4"
                  onChange={handleFileChange}
                />
                {fileUrl && <p>File uploaded successfully.</p>}

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateResource}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={isCreating} // Disable the button while creating
                  >
                    {isCreating ? 'Creating Resource...' : 'Create Resource'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
