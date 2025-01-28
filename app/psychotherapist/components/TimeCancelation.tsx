import React, { useEffect, useState } from 'react';
import { account, databases } from '@/appwrite';
import { Query } from 'appwrite';
import { bookAppointmentWithDisabledStatus, enableTimeSlot, fetchPsychoId, fetchTimeSlots } from '@/hooks/userService';

interface TimeCancelationProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

interface Booking {
  day: number;
  month: string;
  slots: string; // This could be a time like "09:00am"
  status: 'pending' | 'paid' | 'rescheduled' | 'happening' | 'missed' | 'disabled' | 'refunded'; // Adjust based on the actual statuses you have
}

const TimeCancelation: React.FC<TimeCancelationProps> = ({ selectedDay, selectedMonth }) => {
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [psychoId, setPsychoId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTimeSlots = async () => {
      const slots = (await fetchTimeSlots() || []).map(slot => slot.time);
      setTimeSlots(slots);
    };

    const fetchBookedSlots = async () => {
      try {
        const user = await account.get();
        const psychoId = await fetchPsychoId(user.$id);
        setPsychoId(psychoId);
        const bookingsResponse = await databases.listDocuments(
          'Butterfly-Database', 'Bookings',
          [Query.equal('psychotherapist', psychoId)]
        );

        const bookedData: Booking[] = bookingsResponse.documents.map((doc) => ({
          day: doc.day,
          month: doc.month,
          slots: doc.slots,
          status: doc.status,
        }));

        setBookedSlots(bookedData);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
    getTimeSlots();
  }, [psychoId, timeSlots]);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDay, selectedMonth]);

  if (!selectedDay || !selectedMonth) {
    return null;
  }

  const isSlotBooked = (day: number, time: string) => {
    return bookedSlots.some(
      (slot) =>
        slot.day === day &&
        slot.month.toLowerCase() === selectedMonth?.toLowerCase() &&
        slot.slots === time &&
        ['pending', 'paid', 'rescheduled', 'missed'].includes(slot.status)
    );
  };
  
  const isSlotDisabled = (day: number, time: string) => {
    return bookedSlots.some(
      (slot) =>
        slot.day === day &&
        slot.month.toLowerCase() === selectedMonth?.toLowerCase() &&
        slot.slots === time &&
        ['disabled'].includes(slot.status)
    );
  };

  const handleDisableTimeSlot = async () => {
    const currentDate = new Date();
    const selectedDate = new Date(`${selectedMonth} ${selectedDay}, ${currentDate.getFullYear()}`);

    if (selectedDate <= currentDate) {
      setErrorMessage('Cannot disable past or current dates.');
      return;
    }

    if (!psychoId) {
      setErrorMessage('Psychotherapist ID not found.');
      return;
    }

    try {
      await bookAppointmentWithDisabledStatus({ client: null, psychotherapist: psychoId, slots: selectedTime, day: selectedDay, month: selectedMonth });
      setSelectedTime(null);
    } catch (error) {
      console.error('Error disabling time slot:', error);
      setErrorMessage('Failed to disable the time slot. Please try again.');
    }
  };
  
  const handleEnableTimeSlot = async () => {
    if (!psychoId) {
      setErrorMessage('Psychotherapist ID not found.');
      return;
    }

    try {
      await enableTimeSlot(selectedTime, selectedDay, selectedMonth, psychoId);
      setSelectedTime(null);
    } catch (error) {
      console.error('Error enabling time slot:', error);
      setErrorMessage('Failed to enable the time slot. Please try again.')
    };
  };

  const handleDisableDay = () => {
    const currentDate = new Date();
    const selectedDate = new Date(`${selectedMonth} ${selectedDay}, ${currentDate.getFullYear()}`);

    if (selectedDate <= currentDate) {
      setErrorMessage('Cannot disable past or current dates.');
      return;
    }

    // Logic to disable the entire day
    console.log('Disabling entire day:', selectedDay, selectedMonth);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-[#3585ff]">
          <span className='text-red-400'>Disable&nbsp;</span>time slots for&nbsp;
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
      ) : (<>
        <div className="grid grid-cols-4 gap-4 mt-4">
            {timeSlots.map((time) => {
            const isBooked = isSlotBooked(selectedDay || 0, time);
            const isDisabled = isSlotDisabled(selectedDay || 0, time);

            return (
              <button
              key={time}
              className={`py-2 px-4 rounded-lg ${selectedTime === time ? "bg-blue-300 text-white" : isBooked
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : isDisabled
              ? "bg-yellow-400 text-gray-700"
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
            <button
            className={`py-2 px-4 rounded-lg mr-4 ${!selectedTime ? "bg-gray-400 text-gray-700 cursor-not-allowed" : isSlotDisabled(selectedDay || 0, selectedTime) ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            onClick={isSlotDisabled(selectedDay || 0, selectedTime) ? handleEnableTimeSlot : handleDisableTimeSlot}
            disabled={!selectedTime}
            >
            {isSlotDisabled(selectedDay || 0, selectedTime) ? "Enable Time Slot" : "Disable Time Slot"}
            </button>
          <button
            className="py-2 px-4 bg-red-500 text-white rounded-lg"
            onClick={handleDisableDay}
          >
            Disable Day
          </button>
        </div></>
      )}
    </div>
  );
};

export default TimeCancelation;