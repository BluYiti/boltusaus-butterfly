'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailabilityCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState({});
  const API_KEY = 'YOUR_CALENDARIFIC_API_KEY'; // Replace with your Calendarific API key
  const COUNTRY_CODE = 'PH'; // Philippines country code
  const YEAR = new Date().getFullYear();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(
          `https://calendarific.com/api/v2/holidays?api_key=${rVHlUPUosToVJh7G2rsPigYxdjAVAe7F}&country=${COUNTRY_CODE}&year=${YEAR}`
        );
        setHolidays(response.data.response.holidays);
      } catch (error) {
        console.error('Error fetching holidays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [API_KEY]);

  // Toggle availability
  const toggleAvailability = (date) => {
    setAvailability((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  if (loading) return <div>Loading...</div>;

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${day}`;
    return dateString;
  });

  return (
    <div className="availability-calendar">
      <h2 className="text-2xl font-bold">Availability Calendar</h2>
      <div className="calendar-grid grid grid-cols-7 gap-2 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="font-bold">{day}</div>
        ))}
        {calendarDays.map((date) => {
          const isHoliday = holidays.some(holiday => holiday.date.iso === date);
          const isAvailable = availability[date];

          return (
            <div
              key={date}
              className={`p-2 border ${isHoliday ? 'bg-yellow-200' : ''} ${isAvailable ? 'bg-green-200' : ''} cursor-pointer`}
              onClick={() => toggleAvailability(date)}
              title={isHoliday ? 'Holiday' : isAvailable ? 'Available' : 'Not Available'}
            >
              {date.split('-')[2]} {/* Show only the day */}
              {isHoliday && <div className="text-sm">{holidays.find(holiday => holiday.date.iso === date)?.name}</div>}
            </div>
          );
        })}
      </div>
      <p className="mt-4">Click on a date to toggle availability.</p>
    </div>
  );
};

export default AvailabilityCalendar;
