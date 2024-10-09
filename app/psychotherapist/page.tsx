'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Client, Databases } from 'appwrite';
import items from './data/Links';

// Define types for the availability response
interface Availability {
  date: string;
  slotsAvailable: number;
}

const Dashboard: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [slotsInfo, setSlotsInfo] = useState<number | null>(null);
  const [year, setYear] = useState(date.getFullYear());

  // Set up Appwrite Client
  const client = new Client();
  const databases = new Databases(client);

  // Make sure you have the Appwrite endpoint and project configured correctly
  client.setEndpoint('https://[YOUR-ENDPOINT]') // Replace with your Appwrite endpoint
        .setProject('[YOUR-PROJECT-ID]'); // Replace with your project ID

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await databases.listDocuments(
          '[your_database_id]',  // Replace with your database ID
          '[your_collection_id]', // Replace with your availability collection ID
        );
        const fetchedAvailability = response.documents.map((doc: any) => ({
          date: doc.date,
          slotsAvailable: doc.slotsAvailable,
        }));
        setAvailability(fetchedAvailability);
      } catch (error) {
        console.error('Error fetching availability from Appwrite:', error);
        setError('Failed to fetch availability. Using mock data.');

        // Mock data for development
        setAvailability([
          { date: '2024-10-04', slotsAvailable: 3 },
          { date: '2024-10-05', slotsAvailable: 0 }, // Fully booked day
          { date: '2024-10-06', slotsAvailable: 1 },
        ]);
      }
    };

    fetchAvailability();
  }, []);

  // Helper function to format dates in YYYY-MM-DD format (to match with the availability dates)
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Helper to find availability for a given date
  const getAvailabilityForDate = (date: Date) => {
    const formattedDate = formatDate(date);
    const availabilityForDate = availability.find((item) => item.date === formattedDate);
    return availabilityForDate ? availabilityForDate.slotsAvailable : null;
  };

  const handleDateClick = (value: Date) => {
    const slotsAvailable = getAvailabilityForDate(value);
    setSlotsInfo(slotsAvailable !== null ? slotsAvailable : null);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(event.target.value));
  };

  // Generate the calendar weeks for the current month
  const getCurrentMonthWeeks = (currentDate: Date) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const weekStart = new Date(startOfMonth);
    weekStart.setDate(startOfMonth.getDate() - startOfMonth.getDay()); // Adjust to the start of the week

    // Generate weeks (with the first and last days included)
    const weeks = [];
    let dateIterator = weekStart;

    while (dateIterator <= endOfMonth || dateIterator.getDay() !== 0) {
      weeks.push(new Date(dateIterator));
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    return weeks;
  };

  const currentMonthWeeks = getCurrentMonthWeeks(date);

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="bg-gray-100"> {/* Ensure it can scroll if content exceeds height */}
          <div className="bg-white rounded-b-lg shadow-md p-5 top-0 left-60 w-full z-10"> {/* Fixed position with full width */}
            <h2 className="text-2xl font-bold">Hello, Psychotherapist!</h2>
          </div>
  
        {/* Main Dashboard Sections */}
        <div className="pt-10"> {/* Add padding to prevent overlap with the fixed header */}
          <div className="grid grid-cols-3 gap-4 mx-10">
            {/* To Be Evaluated Section */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">To be Evaluated</h3>
              <p>Placeholder for evaluation data fetched from Appwrite.</p>
            </div>
  
            {/* Upcoming Sessions Section */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
              <p>Placeholder for upcoming sessions data fetched from Appwrite.</p>
            </div>
  
            {/* Missed Appointments Section */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Missed Appointments</h3>
              <p>Placeholder for missed appointments data fetched from Appwrite.</p>
            </div>
          </div>
  
          {/* Availability Calendar */}
          <div className="grid grid-cols-3 gap-4 mt-8 mx-10">
            <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Availability Calendar</h3>
  
              <div className="flex justify-between mb-4">
                <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
                  <FaChevronLeft />
                </button>
                <h4 className="font-semibold">
                  {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </h4>
                <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
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
                      className={`p-2 text-center rounded
                        ${isOutsideMonth ? 'text-gray-400' : ''}
                        ${slotsAvailable === null ? 'bg-gray-200' : ''}
                        ${slotsAvailable === 0 ? 'bg-red-200' : ''}
                        ${slotsAvailable > 0 ? 'bg-green-200' : ''}
                      `}
                      disabled={slotsAvailable === null}  // Disable days with no availability data
                      onClick={() => {
                        if (slotsAvailable !== null) {
                          handleDateClick(weekDate);
                        }
                      }}
                    >
                      {weekDate.getDate()}
                    </button>
                  );
                })}
              </div>
  
              {/* Slots Information */}
              {slotsInfo !== null && (
                <p className="mt-4">
                  {slotsInfo === 0
                    ? 'No slots available for the selected date.'
                    : `${slotsInfo} slots available for the selected date.`}
                </p>
              )}
            </div>
  
            {/* Payments Status (Placeholder section) */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
              <p>Placeholder for payment status information</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );  
};  

export default Dashboard;
