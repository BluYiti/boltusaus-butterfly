'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { databases, account } from '@/app/appwrite';

const AVAILABILITY_COLLECTION_ID = 'AvailabilityCalendar';
const BOOKSESSION_COLLECTION_ID = '66fc20e3001c99031d2f';
const availableTimes = ["9-10 AM", "10-11 AM", "1-2 PM", "2-3 PM", "3-4 PM"];

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Function to format the date into a human-readable format
const formatDate = (dateString: string) => {
  const parsedDate = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return parsedDate.toLocaleDateString(undefined, options);
};

// Function to extract userId from permissions
const extractUserIdFromPermissions = (permissions: string[]): string | null => {
  const readPermission = permissions.find((perm) => perm.startsWith('read('));
  if (readPermission) {
    const match = readPermission.match(/read\("user:(.*?)"\)/);
    return match ? match[1] : null;
  }
  return null;
};

// Fetch user details via the Next.js API route
const fetchUserDetailsFromAPI = async (userId: string) => {
  try {
    console.log(`Fetching user with ID: ${userId}`);
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Error fetching user with ID: ${userId}`);
    }
    const user = await response.json();
    console.log('User fetched:', user);
    return user.name;
  } catch (error) {
    console.error('Error fetching user data from API:', error);
    return 'Unknown User';
  }
};

const Dashboard = () => {
  const router = useRouter();
  const [existingSelections, setExistingSelections] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [sessionCreators, setSessionCreators] = useState<{ [key: string]: string }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleAvailabilityClick = () => {
    router.push('/psychotherapist/pages/availabilitycalendar/');
  };

  // Helper function to check if a date is fully booked
  const isDateFullyBooked = (date: number): boolean => {
    const selectedTimesForDate = existingSelections.filter(
      (selection) => 
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date
    );
    return selectedTimesForDate.length === availableTimes.length;
  };

  // Helper function to check if a date has some selected times but is not fully booked
  const isDatePartiallyBooked = (date: number): boolean => {
    const selectedTimesForDate = existingSelections.filter(
      (selection) =>
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date
    );
    return selectedTimesForDate.length > 0 && selectedTimesForDate.length < availableTimes.length;
  };

  // Fetch the already selected dates and times from Appwrite
  useEffect(() => {
    const fetchExistingSelections = async () => {
      try {
        setLoading(true); // Start loading
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          AVAILABILITY_COLLECTION_ID
        );
        setExistingSelections(response.documents);
      } catch (error) {
        console.error('Error fetching availability data:', error);
        setError('Failed to fetch availability data.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    const fetchUpcomingSessions = async () => {
      try {
        setLoading(true); // Start loading
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          BOOKSESSION_COLLECTION_ID
        );
        setUpcomingSessions(response.documents);

        // Fetch and store session creators' names
        const creators: { [key: string]: string } = {};
        for (const session of response.documents) {
          const userId = extractUserIdFromPermissions(session.$permissions);
          if (userId) {
            const userName = await fetchUserDetailsFromAPI(userId);
            creators[session.$id] = userName;
          }
        }
        setSessionCreators(creators);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
        setError('Failed to fetch upcoming sessions.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchExistingSelections();
    fetchUpcomingSessions();
  }, []);

  // Fetch the logged-in user's name from Appwrite
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = await account.get();
        setUserName(user.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, []);

  // Conditional rendering for loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/images/butterfly.jpg" alt="Logo" className="h-8" />
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="/psychotherapist" className="hover:text-black">Dashboard</a>
          {/* Other navigation links */}
        </nav>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Section */}
        <div className="lg:col-span-2">
          {/* Greeting Box */}
          <div className="bg-blue-500 text-white p-6 rounded-xl flex items-center space-x-4">
            <div>
              <img src="/avatar.png" alt="Avatar" className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Good day, {userName}!</h2>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="mt-6 bg-white shadow-md p-4 rounded-xl">
            <h3 className="text-xl font-semibold">Upcoming Sessions</h3>
            <ul className="mt-4 space-y-4">
              {upcomingSessions.map((session) => (
                <li key={session.$id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full h-10 w-10 flex items-center justify-center font-semibold`} style={{ backgroundColor: '#E5E7EB' }}>
                      {session.clientInitials || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">{session.clientName || 'Unknown'}</span>
                      <div className="text-gray-500 text-sm">
                        {formatDate(session.selectedDate)}
                      </div>
                      <div className="text-gray-500 text-xs">Created by: {sessionCreators[session.$id] || 'Unknown'}</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{session.selectedTime}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
