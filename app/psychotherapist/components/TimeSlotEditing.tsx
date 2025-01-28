import React, { useEffect, useState } from 'react';
import { addTimeSlotToDatabase, deleteTimeSlotFromDatabase, fetchTimeSlots } from '@/hooks/userService';

interface TimeSlotAddingProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const TimeSlotAdding: React.FC<TimeSlotAddingProps> = ({ selectedDay, selectedMonth }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [selectedMinute, setSelectedMinute] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('AM');
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditDropdown, setShowEditDropdown] = useState<boolean>(false);

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

  const handleDisableTimeSlot = () => {
    // logic to disable selected time slot
  };

  const handleDisableDay = () => {
    // logic to disable the entire day
  };

  const handleAddTimeSlot = async (type: string) => {
    const timeString = `${selectedHour.padStart(2, '0')}:${selectedMinute.padStart(2, '0')}${selectedPeriod}`;
    let newTimeSlot;
    if (type === 'global') {
      newTimeSlot = {
        time: timeString,
        month: "all",
        day: null,
      };
    } else if (type === 'single') {
      newTimeSlot = {
        time: timeString,
        month: selectedMonth,
        day: selectedDay,
      };
    }
    try {
      await addTimeSlotToDatabase(newTimeSlot);
      console.log('Added time slot:', newTimeSlot);
      setTimeSlots([...timeSlots, timeString]);
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const handleDeleteTimeSlot = async (selectedTimeSlot: string) => {
    try {
      // Assuming you have a function to delete a time slot from the database
      await deleteTimeSlotFromDatabase(selectedTimeSlot);
      console.log('Deleted time slot:', selectedTimeSlot);
      // Update the state to remove the deleted time slot from the list
      setTimeSlots(timeSlots.filter(time => time !== selectedTimeSlot));
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  const isSlotBooked = (day: number, time: string) => {
    // logic to check if the slot is booked
    return false;
  };

  if (!selectedDay || !selectedMonth) {
    return null;
  }

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
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0">
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
                {(selectedTime === 'global' || selectedTime === 'single') && (
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
                    <input
                    type="number"
                    min={1}
                    max={12}
                    className="border rounded-lg py-2 px-4 w-full md:w-1/4"
                    placeholder="HH"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    />
                    <input
                    type="number"
                    min={0}
                    max={59}
                    className="border rounded-lg py-2 px-4 w-full md:w-1/4"
                    placeholder="MM"
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    />
                    <select
                    className="border rounded-lg py-2 px-4 w-full md:w-1/4"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                    </select>
                    <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full md:w-1/4 hover:bg-blue-600"
                    onClick={() => {
                      const timeString = `${selectedHour.padStart(2, '0')}:${selectedMinute.padStart(2, '0')}${selectedPeriod}`;
                      setSelectedTime(timeString);
                      handleAddTimeSlot(selectedTime);
                    }}
                    >
                    {selectedTime === 'global' ? 'Add Global Time Slot' : 'Add Time Slot for a Single Date'}
                    </button>
                    </div>
                )}
                </div>
              </div>
              </div>
            )}
          </div>
          <button
            className={`bg-red-500 text-white py-2 px-4 rounded-lg mr-2 ${!selectedTime ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
            disabled={!selectedTime}
            onClick={() => handleDeleteTimeSlot(selectedTime)}
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