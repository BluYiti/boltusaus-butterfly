'use client';

import { useRouter } from 'next/navigation'; // Import from next/navigation for app directory
import { useState } from 'react';

export default function ConsultationSelection() {
  const router = useRouter(); // Initialize router

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationOption, setConsultationOption] = useState<string>('Face to Face');

  const availableDates = [
    { day: '23', weekday: 'Friday' },
    { day: '26', weekday: 'Monday' },
    { day: '27', weekday: 'Tuesday' },
  ];

  const availableTimes = ['7:30 AM', '8:30 AM', '9:30 AM', '10:30 AM'];

  const handleDateClick = (day: string) => {
    setSelectedDate(day);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };

  const handleConsultationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConsultationOption(e.target.value);
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time.');
      return;
    }

    // Store selected details in sessionStorage
    sessionStorage.setItem('selectedDate', selectedDate);
    sessionStorage.setItem('selectedTime', selectedTime);
    sessionStorage.setItem('consultationOption', consultationOption);

    // Redirect to the 'booksession' page
    router.push('/client/pages/booksession');
  };

  return (
    <div className="text-black flex flex-col bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 animate-gradient-x relative overflow-hidden items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-lg">
        {/* Available dates */}
        <h2 className="text-lg font-bold mb-4">Available dates</h2>
        <div className="flex space-x-4 mb-4">
          {availableDates.map((date) => (
            <button
              key={date.day}
              className={`p-4 rounded-lg ${selectedDate === date.day ? 'bg-gray-300 border-2 border-black' : 'bg-gray-200'}`}
              onClick={() => handleDateClick(date.day)}
            >
              <div className="font-bold text-xl">{date.day}</div>
              <div className="text-sm">{date.weekday}</div>
            </button>
          ))}
        </div>

        {/* Available time slots */}
        <h2 className="text-lg font-bold mb-4">Available time of consultation</h2>
        <div className="flex space-x-4 mb-4">
          {availableTimes.map((time) => (
            <button
              key={time}
              className={`p-4 rounded-lg ${selectedTime === time ? 'bg-gray-300 border-2 border-black' : 'bg-gray-200'}`}
              onClick={() => handleTimeClick(time)}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Consultation options */}
        <h2 className="text-lg font-bold mb-4">Consultation Option</h2>
        <div className="mb-4">
          <select
            className="w-full p-4 rounded-lg bg-gray-200"
            value={consultationOption}
            onChange={handleConsultationChange}
          >
            <option value="Face to Face">Face to Face</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {/* Confirm button */}
        <div className="flex justify-center">
          <button
            className="py-2 px-8 bg-blue-500 text-white rounded-lg"
            onClick={handleConfirm}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}
