'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { databases, account } from '@/app/appwrite';

const AVAILABILITY_COLLECTION_ID = 'AvailabilityCalendar'; // Collection ID for availability
const BOOKSESSION_COLLECTION_ID = '66fc20e3001c99031d2f'; // Collection ID for booked sessions
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

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const Dashboard = () => {
  const router = useRouter();
  const [existingSelections, setExistingSelections] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [clients, setClients] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch the already selected dates and times from the Availability Calendar
  useEffect(() => {
    const fetchExistingSelections = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          AVAILABILITY_COLLECTION_ID
        );
        setExistingSelections(response.documents);
        console.log('Fetched availability:', response.documents);
      } catch (error) {
        console.error('Error fetching availability data:', error);
      }
    };

    fetchExistingSelections();
  }, []);

  // Fetch the logged-in user's name
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await account.get();
        console.log('Logged-in User:', user);
        setUserName(user.name);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  // Fetch sessions and filter based on psychotherapist preference
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (response.ok) {
          setClients(data.users);
          console.log('Fetched clients:', data.users);
        } else {
          console.error('Failed to fetch clients:', data.error);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchSessionsAndFilter = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          BOOKSESSION_COLLECTION_ID
        );
        const allSessions = response.documents;
        console.log('Fetched Sessions:', allSessions);

        const filteredSessions = allSessions.filter((session) => {
          const client = clients.find((client) => client.$id === session.userId);
          if (client) {
            const clientPsychotherapist = client.prefs?.psychotherapist;
            console.log(`Checking client psychotherapist (${clientPsychotherapist}) against logged-in psychotherapist (${userName})`);
            return clientPsychotherapist === userName;
          }
          return false;
        });

        setFilteredSessions(filteredSessions);
        console.log('Filtered Sessions:', filteredSessions);
      } catch (error) {
        console.error('Error fetching sessions and filtering:', error);
      }
    };

    if (clients.length > 0 && userName) {
      fetchSessionsAndFilter();
    }

    fetchClients();
  }, [clients, userName]);

  // Handle navigating to the previous month
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Handle navigating to the next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper function to check if a date is fully booked
  const isDateFullyBooked = (date: number) => {
    const selectedTimesForDate = existingSelections.filter(
      (selection) => 
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date
    );
    return selectedTimesForDate.length === availableTimes.length;
  };

  // Helper function to check if a date has some selected times
  const isDatePartiallyBooked = (date: number) => {
    const selectedTimesForDate = existingSelections.filter(
      (selection) =>
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date
    );
    return selectedTimesForDate.length > 0 && selectedTimesForDate.length < availableTimes.length;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/images/butterfly.jpg" alt="Logo" className="h-8" />
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="/psychotherapist" className="hover:text-black">Dashboard</a>
          <a href="/psychotherapist/pages/pclientlist" className="hover:text-black">Client List</a>
          <a href="/psychotherapist/pages/preports" className="hover:text-black">Reports</a>
          <a href="#" className="hover:text-black">Recordings</a>
          <a href="/psychotherapist/pages/presources" className="hover:text-black">Resources</a>
          <a href="/psychotherapist/pages/paboutme" className="hover:text-black">About</a>
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
              {filteredSessions.length === 0 && (
                <p>No upcoming sessions for your clients.</p>
              )}

              {filteredSessions.map((session) => (
                <li key={session.$id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-start">
                      <span className="font-semibold"> {session.userName || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-gray-500 text-sm">
                      {formatDate(session.selectedDate)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.selectedTime}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Availability Calendar */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Availability Calendar</h3>
              <button onClick={() => router.push('/psychotherapist/pages/availabilitycalendar')} className="bg-green-500 text-white px-4 py-2 rounded-lg">Update</button>
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button onClick={handlePreviousMonth} className="px-3 py-1 bg-gray-300 rounded-lg">{'<'}</button>
                  <div className="text-lg font-semibold text-center mx-3.5">
                    <div>{currentYear}</div>
                    <div>{months[currentMonth]}</div>
                  </div>
                  <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-300 rounded-lg">{'>'}</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {Array.from({ length: daysInMonth }).map((_, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-full ${
                        isDateFullyBooked(i + 1) ? 'bg-red-200 text-black' :
                        isDatePartiallyBooked(i + 1) ? 'bg-green-200 text-black' : 'text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Client Payments */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold">Client Payments</h3>
            <div className="mt-4">
              <p><strong>Raianna Gayle</strong> has cancelled her appointment. View request to initiate refund.</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
