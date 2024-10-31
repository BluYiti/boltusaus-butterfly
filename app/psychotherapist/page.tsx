'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Client, Databases } from 'appwrite';
import items from './data/Links';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';

// Define types for the availability response
interface Availability {
  date: string;
  slotsAvailable: number;
}

const Dashboard: React.FC = () => {
  const { loading: authLoading } = useAuthCheck(['psychotherapist']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(true); // State to track if data is still loading
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [slotsInfo, setSlotsInfo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [year, setYear] = useState(date.getFullYear());

  // Set up Appwrite Client
  const client = new Client();
  const databases = new Databases(client);

  client.setEndpoint('https://[YOUR-ENDPOINT]') // Replace with your Appwrite endpoint
        .setProject('[YOUR-PROJECT-ID]'); // Replace with your project ID

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          'Butterfly-Database',  // Replace with your database ID
          'Availability', // Replace with your availability collection ID
        );
        const fetchedAvailability = response.documents.map((doc: any) => ({
          date: doc.date,
          slotsAvailable: doc.slotsAvailable,
        }));
        setAvailability(fetchedAvailability);
      } catch (error) {
        console.error('Error fetching availability from Appwrite:', error);
        setError('Failed to fetch availability. Using mock data.');
        setAvailability([
          { date: '2024-10-04', slotsAvailable: 3 },
          { date: '2024-10-05', slotsAvailable: 0 }, // Fully booked day
          { date: '2024-10-06', slotsAvailable: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getAvailabilityForDate = (date: Date) => {
    const formattedDate = formatDate(date);
    const availabilityForDate = availability.find((item) => item.date === formattedDate);
    return availabilityForDate ? availabilityForDate.slotsAvailable : null;
  };

  const handleDateClick = (value: Date) => {
    const slotsAvailable = getAvailabilityForDate(value);
    setSlotsInfo(slotsAvailable !== null ? slotsAvailable : null);
  };

  const getCurrentMonthWeeks = (currentDate: Date) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const weekStart = new Date(startOfMonth);
    weekStart.setDate(startOfMonth.getDate() - startOfMonth.getDay()); // Adjust to the start of the week

    const weeks = [];
    let dateIterator = weekStart;

    while (dateIterator <= endOfMonth || dateIterator.getDay() !== 0) {
      weeks.push(new Date(dateIterator));
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    return weeks;
  };

  const currentMonthWeeks = getCurrentMonthWeeks(date);

  if (authLoading) {
    return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-blue-50 min-h-screen"> {/* Changed gray background to light blue */}
        <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10"> {/* Fixed position with full width */}
          <h2 className="text-2xl font-bold text-blue-400">Hello, Psychotherapist!</h2>
        </div>

        {/* Main Dashboard Sections */}
        <div className="pt-10"> {/* Add padding to prevent overlap with the fixed header */}
          <div className="grid grid-cols-3 gap-4 mx-10">
            {/* To Be Evaluated Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-500">To be Evaluated</h3>
              <p>Placeholder for evaluation data fetched from Appwrite.</p>
            </div>

            {/* Upcoming Sessions Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-500">Upcoming Sessions</h3>
              <p>Placeholder for upcoming sessions data fetched from Appwrite.</p>
            </div>

            {/* Missed Appointments Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Missed Appointments</h3>
              <p>Placeholder for missed appointments data fetched from Appwrite.</p>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="grid grid-cols-3 gap-4 mt-8 mx-10">
            <div className="col-span-2 bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-500">Availability Calendar</h3>

              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                  className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
                  aria-label="Previous Month"
                >
                  <FaChevronLeft />
                </button>
                <h4 className="font-semibold">
                  {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </h4>
                <button
                  onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                  className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
                  aria-label="Next Month"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2 text-gray-500 font-semibold">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={index} className="text-center font-semibold">{day}</div>
                ))}
              </div>

              {/* Calendar Weeks */}
              <div className="grid grid-cols-7 gap-2">
                {currentMonthWeeks.map((weekDate, index) => {
                  const isOutsideMonth = weekDate.getMonth() !== date.getMonth();
                  const slotsAvailable = getAvailabilityForDate(weekDate);

                  return (
                    <button
                      key={index}
                      className={`p-2 text-center rounded transition
                        ${isOutsideMonth ? 'text-gray-400' : ''}
                        ${slotsAvailable === null ? 'bg-gray-200 cursor-not-allowed' : ''}
                        ${slotsAvailable === 0 ? 'bg-red-200' : ''}
                        ${slotsAvailable > 0 ? 'bg-blue-200 hover:bg-blue-300' : ''}
                      `}
                      disabled={slotsAvailable === null}
                      onClick={() => {
                        if (slotsAvailable !== null) {
                          handleDateClick(weekDate);
                        }
                      }}
                      aria-label={`Date ${weekDate.getDate()} ${slotsAvailable ? `(${slotsAvailable} slots available)` : 'No slots available'}`}
                    >
                      {weekDate.getDate()}
                    </button>
                  );
                })}
              </div>

              {/* Slots Information */}
              {loading ? (
                <p className="mt-4 animate-pulse text-blue-600">Loading availability...</p>
              ) : slotsInfo !== null && (
                <p className="mt-4 text-blue-400">
                  {slotsInfo === 0
                    ? 'No slots available for the selected date.'
                    : `${slotsInfo} slots available for the selected date.`}
                </p>
              )}
            </div>

            {/* Payments Status (Placeholder section) */}
            <div className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-500">Payment Status</h3>
              <p>Placeholder for payment status information</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );  
};  

export default Dashboard;
