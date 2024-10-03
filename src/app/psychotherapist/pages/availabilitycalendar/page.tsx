'use client'

import React, { useState, useEffect } from 'react';
import { databases } from '@/app/appwrite';
import { useRouter } from 'next/navigation';

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const AvailabilityCalendar = () => {
  const router = useRouter();

  const availableTimes = ["9-10 AM", "10-11 AM", "1-2 PM", "2-3 PM", "3-4 PM"];

  // State for the selected date, time, and current month/year
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isTimeSelectedAlready, setIsTimeSelectedAlready] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingSelections, setExistingSelections] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const backButton = () => {
    router.push('/psychotherapist/');
  };

  // Fetch the already selected dates and times from Appwrite
  useEffect(() => {
    const fetchExistingSelections = async () => {
      try {
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID as string,
          process.env.NEXT_PUBLIC_AVAILABILITY_CALENDAR_COLLECTION_ID!,
        );
        setExistingSelections(response.documents);
      } catch (error) {
        console.error('Error fetching selections', error);
      }
    };

    fetchExistingSelections();
  }, []);

  // Function to get the number of days in the current month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

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

  // Function to handle date selection
  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // Function to handle time selection or cancellation
  const handleTimeSelect = async (time: string) => {
    if (selectedDate === null) return;

    const isTimeAlreadySelected = isAlreadySelected(selectedDate, time);
    setIsTimeSelectedAlready(isTimeAlreadySelected);

    if (isTimeAlreadySelected) {
      setSelectedTime(time);
    } else {
      setSelectedTime(time);
    }
  };

// Helper function to convert date to UTC+08:00 (Philippines Time)
const convertToPhilippinesTime = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  
  // Set time to noon to avoid time zone issues
  date.setHours(12, 0, 0, 0);

  // Adjust for UTC+08:00 (Philippines time zone)
  const timezoneOffset = -8 * 60;
  const adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);

  return adjustedDate;
};

// Function to save availability to Appwrite
const saveAvailability = async () => {
  if (selectedDate === null || selectedTime === null) return;
  setLoading(true);

  try {
    // Convert to Philippines time
    const philippinesTimeDate = convertToPhilippinesTime(currentYear, currentMonth, selectedDate);

    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID as string,
      process.env.NEXT_PUBLIC_AVAILABILITY_CALENDAR_COLLECTION_ID!,
      'unique()',
      {
        selectedDate: philippinesTimeDate.toISOString(),
        selectedTime: selectedTime,
      }
    );

    console.log('Availability saved', response);
    alert('Availability saved successfully');

    // Update the existing selections after saving
    setExistingSelections((prevSelections) => [
      ...prevSelections,
      { $id: response.$id, selectedDate: philippinesTimeDate.toISOString(), selectedTime }
    ]);
  } catch (error) {
    console.error('Error saving availability', error);
    alert('Error saving availability');
  } finally {
    setLoading(false);
  }
};


  // Function to cancel selected time
  const cancelSelectedTime = async () => {
    if (selectedDate === null || selectedTime === null) return;

    const documentToDelete = existingSelections.find(
      (selection) =>
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === selectedDate &&
        selection.selectedTime === selectedTime
    );

    if (!documentToDelete) return;

    try {
      // Delete the document from Appwrite
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID as string,
        process.env.NEXT_PUBLIC_AVAILABILITY_CALENDAR_COLLECTION_ID!,
        documentToDelete.$id
      );

      // Remove the deleted selection from state
      setExistingSelections((prevSelections) =>
        prevSelections.filter((selection) => selection.$id !== documentToDelete.$id)
      );

      alert(`Time slot ${selectedTime} on ${months[currentMonth]} ${selectedDate} has been canceled.`);
      setSelectedTime(null);
      setIsTimeSelectedAlready(false);
    } catch (error) {
      console.error('Error canceling the selected time', error);
      alert('Error canceling the selected time');
    }
  };

  // Helper function to check if a date has any selected time for the current month/year
  const isDateSelected = (date: number) => {
    return existingSelections.some(
      (selection) => 
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date
    );
  };

  // Helper function to check if a specific time is already selected for the selected date in the current month/year
  const isAlreadySelected = (date: number, time: string | null) => {
    if (!time) return false;
    return existingSelections.some(
      (selection) =>
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date && 
        selection.selectedTime === time
    );
  };

  // Helper function to check if a date is fully booked (i.e., all available times are selected) for the current month/year
  const isDateFullyBooked = (date: number) => {
    const selectedTimesForDate = existingSelections.filter(
      (selection) => 
        new Date(selection.selectedDate).getFullYear() === currentYear &&
        new Date(selection.selectedDate).getMonth() === currentMonth &&
        new Date(selection.selectedDate).getDate() === date
    );
    return selectedTimesForDate.length === availableTimes.length;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  return (
    <div className="min-h-screen bg-gray-50">
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center">
        <button className="mr-4" onClick={backButton}>
          <img src="/images/backButton.png" alt="Back" className="h-6" />
        </button>
        <h1 className="text-2xl font-bold">Availability Calendar</h1>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Calendar Section */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button onClick={handlePreviousMonth} className="px-3 py-1 bg-gray-300 rounded-lg">{'<'}</button>
            <div className="text-lg font-semibold text-center">
              <div>{currentYear}</div>
              <div>{months[currentMonth]}</div>
            </div>
          <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-300 rounded-lg">{'>'}</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div 
              key={i} 
              className={`p-2 rounded-full ${
                isDateFullyBooked(i + 1) ? 'bg-red-200 text-black' : 
                isDateSelected(i + 1) ? 'bg-green-200 text-black' : 
                selectedDate === i + 1 ? 'bg-blue-200 text-black font-bold' : 'hover:bg-gray-200'
              } cursor-pointer`} 
              onClick={() => handleDateSelect(i + 1)}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Time Selection Section */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <h3 className="text-xl font-semibold">
          {selectedDate ? `${months[currentMonth]} ${selectedDate}, ${currentYear}` : "Select a Date"}
        </h3>

        <div className="mt-4">
          <h4 className="font-semibold">Available Time</h4>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`py-2 px-4 rounded-lg border border-gray-300 ${
                  selectedDate !== null && isAlreadySelected(selectedDate, time) ? 'bg-green-300 text-white' : 
                  selectedTime === time ? 'bg-blue-300 text-white' : ''
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            {/* Confirm Button */}
            <button
              onClick={saveAvailability}
              className={`bg-blue-500 text-white px-6 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Confirm'}
            </button>

            {/* Cancel Button: Show only if the time is already selected */}
            {isTimeSelectedAlready && selectedTime && (
              <button
                onClick={cancelSelectedTime}
                className="bg-red-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  </div>
);
};

export default AvailabilityCalendar;
