import React from 'react';
import { account, databases } from '@/appwrite';
import { Query } from 'appwrite';

interface TimeSlotAddingProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const TimeSlotAdding: React.FC<TimeSlotAddingProps> = ({ selectedDay, selectedMonth }) => {
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  if (!selectedDay || !selectedMonth) {
    return null;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-[#3585ff]">
          <span className='text-amber-600'>Edit </span>time slots for&nbsp;
          {selectedMonth} {selectedDay.toString()}
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {["09:00am", "10:00am", "11:00am", "01:00pm", "02:00pm", "03:00pm", "04:00pm"].map((time) => {
          return (
            <button
              key={time}
              className={`py-2 px-4 rounded-lg ${selectedTime === time ? "bg-blue-300 text-white" : 
                "bg-gray-300 text-black hover:bg-blue-200 hover:text-white hover:scale-110"}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotAdding;