import { databases, Query } from '@/appwrite';
import { fetchTimeSlots } from '@/hooks/userService';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    const [bookedSlots, setBookedSlots] = useState<Booking[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [isNextMonthAvailable, setIsNextMonthAvailable] = useState(false);
    const [accountRole,] = useState(null);

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

    const isDateInRange = useCallback((date: Date) => {
        return date >= tomorrow && date <= bookingEndDate && date.getDay() !== 0 && date.getDay() !== 6;
    }, [tomorrow, bookingEndDate]);

    const currentMonthIndex = today.getMonth();
    const nextMonthIndex = (currentMonthIndex + 1) % 12;

    const monthsToDisplay = useMemo(() => [
        { name: currentMonth, days: new Date(currentYear, currentMonthIndex + 1, 0).getDate() },
        { name: nextMonth, days: new Date(currentYear, nextMonthIndex + 1, 0).getDate() },
    ], [currentMonth, currentYear, currentMonthIndex, nextMonth, nextMonthIndex]);

    const firstDayOfMonth = useMemo(() => {
        const monthIndex = selectedMonth === currentMonth ? currentMonthIndex : nextMonthIndex;
        return new Date(currentYear, monthIndex, 1).getDay();
    }, [selectedMonth, currentMonth, currentYear, currentMonthIndex, nextMonthIndex]);

    useEffect(() => {
        const getTimeSlots = async () => {
            const slots = (await fetchTimeSlots() || []).map(slot => slot.time);
            setTimeSlots(slots);
        };

        const fetchBookedSlots = async () => {
            if (!selectedTherapistId) return;

            try {
                const bookingsResponse = await databases.listDocuments(
                    'Butterfly-Database', 'Bookings',
                    [Query.equal('psychotherapist', selectedTherapistId)]
                );

                const bookedData: Booking[] = bookingsResponse.documents.map((doc) => ({
                    day: doc.day,
                    month: doc.month,
                    slots: doc.slots,
                    status: doc.status,
                }));

                console.log("Booked slots:", bookedData);
                setBookedSlots(bookedData);
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            }
        };

        fetchBookedSlots();
        getTimeSlots();
    }, [selectedTherapistId, timeSlots]);

    const handlePreviousMonthClick = () => {
        if (selectedMonth === currentMonth) return; // Prevent going to previous months
        const newDate = new Date(currentYear, currentMonthIndex, 1);
        setDate(newDate);
        setSelectedMonth(newDate.toLocaleString('default', { month: 'long' }));
    };  

    const handleNextMonthClick = () => {
        if (selectedMonth === nextMonth) return; // Prevent going beyond next month
        const newDate = new Date(currentYear, nextMonthIndex, 1);
        setDate(newDate);
        setSelectedMonth(newDate.toLocaleString('default', { month: 'long' }));
    };    

    useEffect(() => {
        const checkNextMonthAvailability = () => {
            if (!isMonthEndingSoon) return;
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
    }, [isDateInRange, isMonthEndingSoon, monthsToDisplay, nextMonthIndex, currentYear]);

    const isSlotBooked = useCallback((day: number, time: string) => {
        return bookedSlots.some(
            (slot) =>
                slot.day === day &&
                slot.month.toLowerCase() === selectedMonth.toLowerCase() &&
                slot.slots === time &&
                (slot.status === 'pending' || slot.status === 'paid' || slot.status === 'rescheduled' || slot.status === 'disabled')
        );
    }, [bookedSlots, selectedMonth]);

    const isDayFullyBooked = useCallback((day: number) => {
        const times = ["09:00am", "10:00am", "11:00am", "01:00pm", "02:00pm", "03:00pm", "04:00pm"];
        return times.every((time) => isSlotBooked(day, time));
    }, [isSlotBooked]);

    return (
        <div>
            <div className="flex justify-between mb-4">
                <button
                    onClick={handlePreviousMonthClick}
                    disabled={selectedMonth === currentMonth}
                    className={`p-2 ${selectedMonth === currentMonth ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'} rounded transition`}
                    aria-label="Previous Month"
                >
                    <FaChevronLeft />
                </button>

                <h4 className="font-semibold text-xl text-blue-400">
                    {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </h4>

                <button
                    onClick={handleNextMonthClick}
                    disabled={selectedMonth === nextMonth}
                    className={`p-2 ${selectedMonth === nextMonth ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-100'} rounded transition`}
                    aria-label="Next Month"
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
                            aria-label={`Select ${day}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <h3 className="text-lg font-bold text-blue-900">Select Time {!selectedTime && <span className="text-red-500">*</span>}</h3>
            <div className="grid grid-cols-4 gap-4 mt-4">
                {timeSlots.map((time) => {
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
                            aria-label={`Select ${time}`}
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