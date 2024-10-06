'use client';

import { useEffect, useState } from 'react';
import { databases, account, ID } from '@/app/appwrite'; // Adjust the path
import { useRouter } from 'next/navigation';

export default function BookSession() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationOption, setConsultationOption] = useState<string | null>(null);
  const [userId, setUserID] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  // Retrieve session data and user info on component mount
  useEffect(() => {
    // Get the selected session details from sessionStorage
    setSelectedDate(sessionStorage.getItem('selectedDate'));
    setSelectedTime(sessionStorage.getItem('selectedTime'));
    setConsultationOption(sessionStorage.getItem('consultationOption'));

    // Fetch the current logged-in user's info
    const fetchUserInfo = async () => {
      try {
        const user = await account.get(); // Get the logged-in user
        setUserID(user.$id); // Set user ID
        setUserName(user.name); // Set user name
        console.log('Logged-in User:', user);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to save the booking information to Appwrite
  const bookSession = async () => {
    if (!selectedDate || !selectedTime || !consultationOption || !userId || !userName) {
      alert('Please select a date, time, consultation option, and make sure you are logged in.');
      return;
    }

    try {
      // Parse the selectedDate and convert it into ISO format
      const date = new Date(selectedDate);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }

      // Appending default time if not provided to make it ISO 8601 format with time
      const isoDate = date.toISOString(); // This ensures the correct ISO 8601 format

      // Log the data before sending to Appwrite
      console.log('Data to be saved:', {
        selectedDate: isoDate,
        selectedTime,
        consultationOption,
        userId,
        userName,
      });

      // Saving to Appwrite database
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string, // Your Appwrite Database ID
        '66fc20e3001c99031d2f', // The collection ID for 'BookSession'
        ID.unique(), // Automatically generate a unique document ID
        {
          selectedDate: isoDate, // Ensure datetime format is used for `selectedDate`
          selectedTime,
          consultationOption,
          userId, // Include the userID who created the session
          userName, // Include the user's name who created the session
        }
      );

      console.log('Session booked successfully:', response);

      // Redirect to confirmation page or show success message
      router.push('/client'); // Adjust the route to where you want to redirect after successful booking
    } catch (error) {
      console.error('Failed to book session:', error);
      alert('An error occurred while booking the session. Please try again.');
    }
  };

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Hi {userName || 'there'}!</h1>
      <p className="mb-2">I'm Hanni, your psychologist.</p>
      <p className="mb-6">
        Book your first live consultation. <br />
        Available on: {selectedDate} at {selectedTime} ({consultationOption})
      </p>
      <button className="py-2 px-8 bg-blue-500 text-white rounded-lg" onClick={bookSession}>
        BOOK SESSION
      </button>
    </div>
  );
}
