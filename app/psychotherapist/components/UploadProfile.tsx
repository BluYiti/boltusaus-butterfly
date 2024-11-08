import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface UploadProfileProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadProfile: React.FC<UploadProfileProps> = ({ isModalOpen, setIsModalOpen, handleFileChange }) => {
  const [image, setImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const cropperRef = useRef<any>(null); // Reference to the Cropper component

  if (!isModalOpen) return null; // If the modal is not open, return nothing.

  // Handle file input change
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Crop the image using the cropper ref
  const onCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas({
        width: 200, // Width of the cropped image (you can adjust the size)
        height: 200, // Height of the cropped image (you can adjust the size)
      });
      setCroppedImage(croppedCanvas.toDataURL()); // Convert the canvas to a base64 string
    }
  };

  // Convert the cropped image to a file
  const onUpload = () => {
    if (croppedImage) {
      // You can upload the cropped image as a File object if needed
      const byteString = atob(croppedImage.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uintArray], { type: 'image/jpeg' });
      const file = new File([blob], 'cropped-profile.jpg', { type: 'image/jpeg' });

      // Call your upload function here (e.g., upload to the server, Appwrite, etc.)
      console.log('Uploading cropped image:', file);
    }
    setIsModalOpen(false); // Close modal after uploading
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
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
          <>
            <div className="mb-4">
              <Cropper
                ref={cropperRef}
                src={URL.createObjectURL(image)}
                style={{ width: '100%', height: 400 }}
                aspectRatio={1} // Aspect ratio set to 1 for 2x2 crop
                guides={false} // Remove grid guides
                crop={onCrop}
              />
            </div>

            {/* Show cropped image preview */}
            {croppedImage && (
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">Cropped Preview:</h3>
                <img
                  src={croppedImage}
                  alt="Cropped Preview"
                  className="mt-2 max-w-xs h-auto rounded-full"
                />
              </div>
            )}
          </>
        )}

        {/* Modal buttons */}
        <div className="flex justify-between">
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
