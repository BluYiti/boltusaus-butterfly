import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { fetchPsychoId, uploadProfilePicture, uploadProfilePictureCollection } from '@/hooks/userService';
import { account, ID } from '@/appwrite';
import Image from 'next/image';
import CropperJS from 'cropperjs';

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const cropperRef = useRef<CropperJS | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      setImage(null);
      setCroppedImage(null);
      setImageUrl(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image]);

  if (!isModalOpen) return null;

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file);  // Debugging line
      setImage(file);
    }
  };

  const onCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.getCroppedCanvas({
        width: 200, // Optional: set width of the cropped image
        height: 200, // Optional: set height of the cropped image
      });
  
      // Convert canvas to data URL and set state
      const croppedImageUrl = croppedCanvas.toDataURL();
      console.log("Cropped Image URL:", croppedImageUrl); // Log the cropped image URL
  
      if (croppedImageUrl !== croppedImage) {
        setCroppedImage(croppedImageUrl); // Update state with the cropped image
      }
    }
  };
  

  const onUpload = async () => {
    if (croppedImage) {
      try {
        const byteString = atob(croppedImage.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        const psychoId = await fetchPsychoId((await user).$id);

        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uintArray], { type: 'image/jpeg' });
        const file = new File([blob], `profile-${psychoId}.jpg`, { type: 'image/jpeg' });

        const fileId = await ID.unique();

        if (!psychoId) {
          throw new Error('Failed to fetch psychoId');
        }

        await uploadProfilePicture(fileId, file);
        await uploadProfilePictureCollection(psychoId, fileId, 'Psychotherapist');
        setIsModalOpen(false);
        window.location.reload();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-6/12">
        <h2 className="text-xl font-semibold text-center mb-4">Upload Profile Picture</h2>

        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full p-2 mb-4 text-gray-700 border border-gray-300 rounded"
        />

        {image && (
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <Cropper
                ref={cropperRef}
                src={imageUrl || ''}
                style={{ width: '100%', height: 400 }}
                aspectRatio={1}
                guides={false}
                crop={onCrop}
              />
            </div>

            <div className="flex-1 text-center">
              {croppedImage && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cropped Preview:</h3>
                  <Image
                    src={croppedImage}
                    alt="Cropped Preview"
                    className="max-w-xs h-auto rounded-full mx-auto"
                    width={300}
                    height={300}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4 flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onUpload}
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
