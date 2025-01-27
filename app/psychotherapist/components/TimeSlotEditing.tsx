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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTimeSlots = async () => {
      try {
        const slots = (await fetchTimeSlots() || []).map(slot => slot.time);
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      } finally {
        setLoading(false);
      }
    };

    getTimeSlots();
  }, []);

  if (!selectedDay || !selectedMonth) {
    return null;
  }

  const handleAddTimeSlot = (type: string) => {
    if (type === 'global') {
      // logic to add global time slot
    } else if (type === 'single') {
      // logic to add time slot for a single date
    }
  };

  const handleDisableTimeSlot = () => {
    // logic to disable selected time slot
  };

  const handleDisableDay = () => {
    // logic to disable the entire day
  };

  const isSlotBooked = (day: number, time: string) => {
    // logic to check if the slot is booked
    return false;
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
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="flex justify-center items-center">
            <img src="/gifs/butterfly.gif" alt="Loading" className="h-8 w-8" />
            <span className="ml-2 text-blue-500">Loading...</span>
          </div>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {timeSlots.map((time) => {
            const isBooked = isSlotBooked(selectedDay || 0, time);

            return (
              <button
                key={time}
                className={`py-2 px-4 rounded-lg ${selectedTime === time ? "bg-blue-300 text-white" : isBooked
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-gray-300 text-black hover:bg-blue-200 hover:text-white hover:scale-110"}`}
                onClick={() => !isBooked && setSelectedTime(time)}
                disabled={isBooked}
              >
                {time}
              </button>
            );
          })}
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-1/3">
                <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Add Time Slot</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  &times;
                </button>
                </div>
                <div className="p-4">
                <div className="flex border-b mb-4">
                  <button
                  className={`flex-1 py-2 text-center ${selectedTime === 'global' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setSelectedTime('global')}
                  >
                  Add Global Time Slot
                  </button>
                  <button
                  className={`flex-1 py-2 text-center ${selectedTime === 'single' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setSelectedTime('single')}
                  >
                  Add Time Slot for a Single Date
                  </button>
                </div>
                {selectedTime === 'global' && (
                  <div>
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
                    onClick={() => handleAddTimeSlot('global')}
                  >
                    Add Global Time Slot
                  </button>
                  </div>
                )}
                {selectedTime === 'single' && (
                  <div>
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-left"
                    onClick={() => handleAddTimeSlot('single')}
                  >
                    Add Time Slot for a Single Date
                  </button>
                  </div>
                )}
                </div>
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
      )}
    </div>
    </>
  );
};

export default TimeSlotAdding;