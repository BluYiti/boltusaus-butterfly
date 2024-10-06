'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from './components/SideBar';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

  // Fetch availability data from API (mock or real)
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get('https://calendarific.com/api'); // Replace with your real endpoint
        setAvailability(response.data);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setError('Failed to fetch availability. Using mock data.');

        // Mock data for development
        setAvailability([
          { date: '2024-10-04', slotsAvailable: 3 },
          { date: '2024-10-05', slotsAvailable: 0 },
          { date: '2024-10-06', slotsAvailable: 1 }
        ]);
      }
    };

    fetchAvailability();
  }, []);

  // Determine the tile class based on the availability
  const tileClassName = (currentDate: Date, isOutsideMonth: boolean) => {
    const dateString = currentDate.toISOString().split('T')[0];
    const dayAvailability = availability.find(day => day.date === dateString);

    // Apply styles for outside months
    if (isOutsideMonth) {
      return 'text-gray-400'; // Gray out outside month dates
    }

    // Apply styles for available dates
    if (dayAvailability) {
      return dayAvailability.slotsAvailable === 0 ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
    }
    
    return 'bg-gray-200'; // Default style for available dates
  };

  const handleDateClick = (value: Date) => {
    setDate(value);
    const dateString = value.toISOString().split('T')[0];
    const dayAvailability = availability.find(day => day.date === dateString);
    setSlotsInfo(dayAvailability ? dayAvailability.slotsAvailable : null); 
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(event.target.value));
  };

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
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 bg-gray-100">
        <div className="bg-white rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold p-5">Hello, Psychotherapist!</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mx-10">
          {/* To Be Evaluated Section */}
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">To be Evaluated</h3>
            <ul className="space-y-2">
              {['Michael Bieber', 'Bella Swan', 'Edward Cullen', 'Jennifer Lawrence'].map((name, index) => (
                <li key={index} className="flex justify-between">
                  <span>{name}</span>
                  <a href="#" className="text-blue-500">view assessment</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Sessions */}
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
            <ul className="space-y-2">
              {[{ name: 'Nicki Minaj', time: 'October 4, 2024 9:30 AM' },
                { name: 'Leon Kennedy', time: 'October 4, 2024 11:30 AM' }]
                .map((session, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{session.name}</span>
                    <span>{session.time}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Missed Appointments */}
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Missed Appointments</h3>
            <ul className="space-y-2">
              {[{ name: 'Ana Smith', time: 'October 1, 2024 9:00 AM' },
                { name: 'Hev Abigail', time: 'October 1, 2024 3:00 PM' },
                { name: 'Snoop Dog', time: 'October 2, 2024 9:00 AM' },
                { name: 'Chris Grey', time: 'October 2, 2024 12:00 PM' },
                { name: 'Ariana Grande', time: 'October 3, 2024 9:00 AM' }]
                .map((missed, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{missed.name}</span>
                    <span>{missed.time}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Availability Calendar and Payments Status */}
        <div className="grid grid-cols-3 gap-4 mt-8 mx-10">
          {/* Availability Calendar */}
          <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Availability Calendar</h3>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <button
                  onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
                  className="mr-2"
                >
                  <FaChevronLeft className="text-blue-500" />
                </button>
                <h4 className="font-semibold">{date.toLocaleString('default', { month: 'long' })} {year}</h4>
                <button
                  onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
                  className="ml-2"
                >
                  <FaChevronRight className="text-blue-500" />
                </button>
              </div>

              <select
                value={year}
                onChange={handleYearChange}
                className="border rounded p-1 overflow-y-scroll"
                style={{ maxHeight: '100px' }} 
              >
                {Array.from({ length: 10 }, (_, index) => year - 5 + index).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="text-center font-semibold">{day}</div>
              ))}
            </div>

            {/* Calendar Dates */}
            <div className="grid grid-cols-7 gap-2">
              {currentMonthWeeks.map((currentDate, index) => {
                const isOutsideMonth = currentDate.getMonth() !== date.getMonth();
                return (
                  <div
                    key={index}
                    onClick={() => !isOutsideMonth && handleDateClick(currentDate)} // Disable click for outside month dates
                    className={`p-2 rounded-lg cursor-pointer ${tileClassName(currentDate, isOutsideMonth)}`}
                  >
                    <span>{currentDate.getDate()}</span>
                  </div>
                );
              })}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {slotsInfo !== null && (
              <p className={`mt-4 ${slotsInfo === 0 ? 'text-red-500' : 'text-green-500'}`}>
                {slotsInfo === 0 ? 'No slots available' : `${slotsInfo} slots available`}
              </p>
            )}
          </div>

          {/* Payments Status */}
          <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Payments Status</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="border-b py-2">Name</th>
                  <th className="border-b py-2">Date</th>
                  <th className="border-b py-2">Amount</th>
                  <th className="border-b py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[{ name: 'John Doe', date: 'October 1, 2024', amount: '$100', status: 'Pending' },
                  { name: 'Jane Doe', date: 'October 2, 2024', amount: '$200', status: 'Completed' }]
                  .map((payment, index) => (
                    <tr key={index}>
                      <td className="py-2">{payment.name}</td>
                      <td className="py-2">{payment.date}</td>
                      <td className="py-2">{payment.amount}</td>
                      <td className="py-2">
                        <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-200">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
