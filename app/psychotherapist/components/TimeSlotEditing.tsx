import React, { useEffect, useState } from 'react';
import { fetchTimeSlots } from '@/hooks/userService';

interface TimeSlotAddingProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const TimeSlotAdding: React.FC<TimeSlotAddingProps> = ({ selectedDay, selectedMonth }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const getTimeSlots = async () => {
      const slots = (await fetchTimeSlots() || []).map(slot => slot.time);
      setTimeSlots(slots);
    };

    getTimeSlots();
  }, []);

  if (!selectedDay || !selectedMonth) {
    return null;
  }
  // function to toggle dropdown visibility
  const handleAddTimeSlot = (type: string) => {
    if (type === 'global') {
      // logic to add global time slot
    } else if (type === 'single') {
      // logic to add time slot for a single date
    }
  };

  return (
    <>
    <div>
      <div>
        <h1 className="text-2xl font-bold text-[#3585ff]">
          <span className='text-amber-600'>Edit </span>time slots for&nbsp;
          {selectedMonth} {selectedDay.toString()}
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {timeSlots.map((time) => {
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
    <div className="mt-4">
      <div className="relative inline-block text-left mr-2">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Add Time Slot
        </button>
        {showDropdown && (
          <div className="origin-bottom-right absolute right-0 mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
            role="menuitem"
            onClick={() => handleAddTimeSlot('global')}
          >
            Add Global Time Slot
          </button>
          <button
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
            role="menuitem"
            onClick={() => handleAddTimeSlot('single')}
          >
            Add Time Slot for a Single Date
          </button>
        </div>
          </div>
        )}
      </div>
      <button
      className={`bg-yellow-500 text-white py-2 px-4 rounded-lg mr-2 ${!selectedTime ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"}`}
      disabled={!selectedTime}
      >
      Edit Time Slot
      </button>
      <button
      className={`bg-red-500 text-white py-2 px-4 rounded-lg mr-2 ${!selectedTime ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
      disabled={!selectedTime}
      >
      Delete Time Slot
      </button>
    </div>
    </>
  );
};

export default TimeSlotAdding;