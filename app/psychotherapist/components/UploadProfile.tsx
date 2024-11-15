import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { fetchPsychoId, uploadProfilePicture, uploadProfilePictureCollection } from '@/hooks/userService';
import { account, ID } from '@/appwrite';
import Image from 'next/image';
import CropperJS from 'cropperjs'; // Import CropperJS for type referencing

interface UploadProfileProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadProfile: React.FC<UploadProfileProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const user = account.get();
  const [image, setImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State for object URL

  // Use CropperJS type for the ref
  const cropperRef = useRef<CropperJS | null>(null);

  // Reset image and cropped image when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setImage(null);
      setCroppedImage(null);
      setImageUrl(null);
    }
  }, [isModalOpen]);

  // Cleanup object URL when image changes or component unmounts
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url); // Set image URL in state
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // Clean up object URL
      }
    };
  }, [image, imageUrl]);

  if (!isModalOpen) return null; // If the modal is not open, return nothing.

  // Handle file input change
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Function to crop image and update croppedImage state
  const onCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas({
        width: 200, // Width of the cropped image (you can adjust the size)
        height: 200, // Height of the cropped image (you can adjust the size)
      });

      const croppedImageUrl = croppedCanvas.toDataURL();
      if (croppedImageUrl !== croppedImage) {
        setCroppedImage(croppedImageUrl); // Only update if it's different
      }
    }
  };

  // Convert the cropped image to a file (when uploading)
  const onUpload = async () => {
    if (croppedImage) {
      try {
        // Convert base64 to Blob and create a File object
        const byteString = atob(croppedImage.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        
        // Fetch psychoId (with error handling)
        const psychoId = await fetchPsychoId((await user).$id);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([uintArray], { type: 'image/jpeg' });
        const file = new File([blob], `profile-${psychoId}.jpg`, { type: 'image/jpeg' });
        
        // Generate a unique file ID using Appwrite's unique() method
        const fileId = await ID.unique();
  
        if (!psychoId) {
          throw new Error('Failed to fetch psychoId');
        }
  
        // Upload the profile picture with the unique fileId
        await uploadProfilePicture(fileId, file);
  
        // Upload the profile picture collection with the same fileId
        await uploadProfilePictureCollection(psychoId, fileId, 'Psychotherapist');
  
        // Close the modal after upload
        setIsModalOpen(false);

        window.location.reload();
      } catch (error) {
        console.error('Upload failed:', error);
        // Handle error gracefully, show an alert or message to the user
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-6/12">
        <h2 className="text-xl font-semibold text-center mb-4">Upload Profile Picture</h2>

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full p-2 mb-4 text-gray-700 border border-gray-300 rounded"
        />

        {/* Show the cropper only if there's an image */}
        {image && (
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <Cropper
                ref={cropperRef} // Correctly pass the ref to Cropper
                src={imageUrl || ''} // Use the imageUrl state instead of useRef
                style={{ width: '100%', height: 400 }}
                aspectRatio={1} // Aspect ratio set to 1 for 2x2 crop
                guides={false} // Remove grid guides
                crop={onCrop} // Crop handler function
              />
            </div>

            <div className="flex-1 text-center">
              {/* Show cropped image preview */}
              {croppedImage && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cropped Preview:</h3>
                  <Image
                    src={croppedImage}
                    alt="Cropped Preview"
                    className="max-w-xs h-auto rounded-full mx-auto"
                    width={300} // or any appropriate width
                    height={300} // or any appropriate height
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal buttons */}
        <div className="flex justify-between mt-4 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setIsModalOpen(false)} // Close the modal
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onUpload} // Upload the cropped image
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfile;
