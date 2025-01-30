import { databases, Query } from '@/appwrite';
import React, { useState, useEffect, useMemo } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CalendarProps {
    currentMonth: string;
    nextMonth: string;
    currentDate: number;
    currentYear: number;
    selectedDay: number | null;
    setSelectedDay: (day: number | null) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    selectedTime: string | null;
    setSelectedTime: (time: string | null) => void;
    isTherapistSelected: boolean;
    selectedTherapistId: string | null;
}

interface Booking {
    day: number;
    month: string;
    slots: string; // This could be a time like "09:00am"
    status: 'pending' | 'paid' | 'rescheduled' | 'happening' | 'missed' | 'disabled' | 'refunded'; // Adjust based on the actual statuses you have
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Calendar: React.FC<CalendarProps> = ({
    currentMonth,
    nextMonth,
    currentYear,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    setSelectedMonth,
    selectedTime,
    setSelectedTime,
    selectedTherapistId,
    isTherapistSelected,
}) => {
    const [date, setDate] = useState(new Date());
    const [bookedSlots, setBookedSlots] = useState<Booking[]>([]); // To store fetched booked slots
    const [isNextMonthAvailable, setIsNextMonthAvailable] = useState(false);
    const [, setIsFormComplete] = useState(false);
    const [accountRole,] = useState(null);

    // Memoize the 'today' date object to ensure it's stable across renders
    const today = useMemo(() => new Date(), []);
    const tomorrow = useMemo(() => {
        const newTomorrow = new Date(today);
        newTomorrow.setDate(today.getDate() + 4);
        return newTomorrow;
    }, [today]);
    
    const bookingEndDate = useMemo(() => {
        const newBookingEndDate = new Date(today);
        newBookingEndDate.setDate(today.getDate() + 12);
        return newBookingEndDate;
    }, [today]);

    const isMonthEndingSoon = today.getDate() >= 25;

    const isDateInRange = React.useCallback((date: Date) => {
        return date >= tomorrow && date <= bookingEndDate && date.getDay() !== 0;
    }, [tomorrow, bookingEndDate]);    

    const currentMonthIndex = new Date(`${currentMonth} 1, ${currentYear}`).getMonth();
    const nextMonthIndex = new Date(`${nextMonth} 1, ${currentYear}`).getMonth();

    const monthsToDisplay = React.useMemo(() => [
        { name: currentMonth, days: new Date(currentYear, currentMonthIndex + 1, 0).getDate() },
        { name: nextMonth, days: new Date(currentYear, nextMonthIndex + 1, 0).getDate() },
    ], [currentMonth, currentYear, currentMonthIndex, nextMonth, nextMonthIndex]);

    const firstDayOfMonth = selectedMonth === currentMonth
        ? new Date(currentYear, currentMonthIndex, 1).getDay()
        : new Date(currentYear, nextMonthIndex, 1).getDay();

    const checkPreviousMonthAvailability = () => {
        const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const previousMonthDays = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).getDate();
    
        for (let day = 1; day <= previousMonthDays; day++) {
            const dateToCheck = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), day);
            if (isDateInRange(dateToCheck)) {
                return true;
            }
        }
        return false;
    };

    const isPreviousMonthAvailable = checkPreviousMonthAvailability(); 

    // Fetch booked slots when therapist changes
    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!selectedTherapistId) return;
        
            try {
                const bookingsResponse = await databases.listDocuments(
                    'Butterfly-Database', 'Bookings',
                    [Query.equal('psychotherapist', selectedTherapistId)] // Filter by therapistId
                );
        
                const bookedData: Booking[] = bookingsResponse.documents.map((doc) => ({
                    day: doc.day, // assuming the document contains a 'day' field
                    month: doc.month, // assuming the document contains a 'month' field
                    slots: doc.slots, // assuming the document contains a 'slots' field
                    status: doc.status, // assuming the document contains a 'status' field
                }));
                
                console.log("Booked slots:", bookedData); // Log the booked slots
                setBookedSlots(bookedData);
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            }            
        };
        

        fetchBookedSlots();
    }, [selectedTherapistId]); // Re-run when therapistId changes

    const handleNextMonthClick = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(newDate); 
        setSelectedMonth(newDate.toLocaleString('default', { month: 'long' }));
    };

    const handlePreviousMonthClick = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setDate(newDate);
        setSelectedMonth(newDate.toLocaleString('default', { month: 'long' }));
    };

    useEffect(() => {
        const checkNextMonthAvailability = () => {
            for (let day = 1; day <= monthsToDisplay[1].days; day++) {
                const date = new Date(currentYear, nextMonthIndex, day);
                if (isDateInRange(date)) {
                    setIsNextMonthAvailable(true);
                    return;
                }
            }
            setIsNextMonthAvailable(false);
        };

        checkNextMonthAvailability();
    }, [isDateInRange, monthsToDisplay, nextMonthIndex, currentYear]);

    useEffect(() => {
        setIsFormComplete(!!selectedDay && !!selectedTime);
    }, [selectedDay, selectedTime]);

    const isSlotBooked = (day: number, time: string) => {
        return bookedSlots.some(
            (slot) => 
                slot.day === day && 
                slot.month.toLowerCase() === selectedMonth.toLowerCase() &&  // Ensure month comparison is case-insensitive
                slot.slots === time && 
                (slot.status === 'pending' || slot.status === 'paid' || slot.status === 'rescheduled' || slot.status === 'disabled')  // Add 'rescheduled' to consider those as booked too
        );
    };    

    const isDayFullyBooked = (day: number) => {
        const times = ["09:00am", "10:00am", "11:00am", "01:00pm", "02:00pm", "03:00pm", "04:00pm"];
        return times.every((time) => isSlotBooked(day, time)); 
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <button
                    onClick={handlePreviousMonthClick}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
                    aria-label="Previous Month"
                    disabled={!isPreviousMonthAvailable}
                >
                    <FaChevronLeft />
                </button>

                <h4 className="font-semibold text-xl text-blue-400">
                    {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </h4>

                <button
                    onClick={handleNextMonthClick}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
                    aria-label="Next Month"
                    disabled={!isNextMonthAvailable || !isTherapistSelected}
                >
                    <FaChevronRight />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-600 mb-2">
                {weekdays.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4 p-4 rounded shadow-md bg-gray-200">
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={index}></div>
                ))}

                {Array.from({ length: selectedMonth === currentMonth ? monthsToDisplay[0].days : monthsToDisplay[1].days }, (_, i) => {
                    const day = i + 1;
                    const date = new Date(currentYear, selectedMonth === currentMonth ? currentMonthIndex : nextMonthIndex, day);
                    const isPastDate = !isDateInRange(date);
                    const isFullyBooked = isDayFullyBooked(day);

                    return (
                        <button
                            key={day}
                            className={`py-2 px-1 rounded-lg ${selectedDay === day
                                ? "bg-blue-300 rounded-3xl text-white"
                                : isPastDate || !isTherapistSelected
                                    ? "bg-gray-400 text-gray-700 rounded-3xl cursor-not-allowed"
                                    : isFullyBooked
                                        ? "bg-red-500 text-white rounded-3xl cursor-not-allowed"
                                        : "rounded-3xl bg-[#49c987] text-white font-poppins hover:bg-green-300 hover:text-black hover:scale-110"
                                }`}
                            onClick={() => !isPastDate && !isFullyBooked && isTherapistSelected && setSelectedDay(day)}
                            disabled={isPastDate || !isTherapistSelected || isFullyBooked}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <h3 className="text-lg font-bold text-blue-900">Select Time {!selectedTime && <span className="text-red-500">*</span>}</h3>
            {accountRole === "client"

            }
            <div className="grid grid-cols-4 gap-4 mt-4">
                {["09:00am", "10:00am", "11:00am", "01:00pm", "02:00pm", "03:00pm", "04:00pm"].map((time) => {
                    const isBooked = isSlotBooked(selectedDay || 0, time);

                    return (
                        <button
                            key={time}
                            className={`py-2 px-4 rounded-lg ${selectedTime === time ? "bg-blue-300 text-white" : isBooked
                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                : "bg-gray-300 text-black hover:bg-blue-200 hover:text-white hover:scale-110"
                                }`}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            disabled={isBooked}
                        >
                            {time}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
