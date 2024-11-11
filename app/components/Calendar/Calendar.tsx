import { databases } from '@/appwrite';
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Define the CalendarProps interface
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
    isTherapistSelected,
}) => {
    const [date, setDate] = useState(new Date());
    const [bookedSlots, setBookedSlots] = useState<any[]>([]); // To store fetched booked slots
    const [isNextMonthAvailable, setIsNextMonthAvailable] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);

    const today = new Date(); // Month is 0-indexed, so 10 is November
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 4);

    const bookingEndDate = new Date(today);
    bookingEndDate.setDate(today.getDate() + 12);

    const isMonthEndingSoon = today.getDate() >= 25;

    const isDateInRange = (date: Date) => {
        return date >= tomorrow && date <= bookingEndDate && date.getDay() !== 0; // Exclude Sundays
    };

    const currentMonthIndex = new Date(`${currentMonth} 1, ${currentYear}`).getMonth();
    const nextMonthIndex = new Date(`${nextMonth} 1, ${currentYear}`).getMonth();

    const monthsToDisplay = [
        { name: currentMonth, days: new Date(currentYear, currentMonthIndex + 1, 0).getDate() },
        { name: nextMonth, days: new Date(currentYear, nextMonthIndex + 1, 0).getDate() },
    ];

    const firstDayOfMonth = selectedMonth === currentMonth
        ? new Date(currentYear, currentMonthIndex, 1).getDay()
        : new Date(currentYear, nextMonthIndex, 1).getDay();

    const checkPreviousMonthAvailability = () => {
        const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const previousMonthDays = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0).getDate();
    
        for (let day = 1; day <= previousMonthDays; day++) {
            const dateToCheck = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), day);
            if (isDateInRange(dateToCheck)) {
                return true; // Bookable date found in the previous month
            }
        }
        return false; // No bookable dates in the previous month
    };

    const isPreviousMonthAvailable = checkPreviousMonthAvailability(); 

    useEffect(() => {
        // Fetch the bookings data from Appwrite's "Bookings" collection
        const fetchBookedSlots = async () => {
            try {
                const bookingsResponse = await databases.listDocuments('Butterfly-Database', 'Bookings');
                const bookedData = bookingsResponse.documents; // Assuming the response has a "documents" field with the slots

                setBookedSlots(bookedData); // Store the fetched booked slots in state
            } catch (error) {
                console.error('Error fetching booked slots:', error);
            }
        };

        fetchBookedSlots(); // Fetch bookings on component mount
    }, []);

    const handleNextMonthClick = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(newDate); // Update the current date state
        setSelectedMonth(newDate.toLocaleString('default', { month: 'long' })); // Explicitly set the selected month
    };

    const handlePreviousMonthClick = () => {
        const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setDate(newDate); // Update the current date state
        setSelectedMonth(newDate.toLocaleString('default', { month: 'long' })); // Explicitly set the selected month
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
    }, [isMonthEndingSoon, monthsToDisplay, nextMonthIndex, currentYear]);

    useEffect(() => {
        setIsFormComplete(!!selectedDay && !!selectedTime);
    }, [selectedDay, selectedTime]);

    const isSlotBooked = (day: number, time: string) => {
        return bookedSlots.some(
            (slot) => slot.day === day && slot.month === selectedMonth && slot.slots === time && slot.status === 'pending'
        );
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

                    return (
                        <button
                            key={day}
                            className={`py-2 px-1 rounded-lg ${selectedDay === day
                                ? "bg-blue-300 rounded-3xl text-white"
                                : isPastDate || !isTherapistSelected
                                    ? "bg-gray-400 text-gray-700 rounded-3xl cursor-not-allowed"
                                    : "rounded-3xl bg-[#49c987] text-white font-poppins hover:bg-green-300 hover:text-black hover:scale-110"
                                }`}
                            onClick={() => !isPastDate && isTherapistSelected && setSelectedDay(day)}
                            disabled={isPastDate || !isTherapistSelected}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <h3 className="text-lg font-bold text-blue-900">Select Time {!selectedTime && <span className="text-red-500">*</span>}</h3>
            <div className="grid grid-cols-4 gap-4 mt-4">
                {["09:00am", "10:00am", "11:00am", "01:00pm", "02:00pm", "03:00pm", "04:00pm"].map((time) => {
                    const isBooked = isSlotBooked(selectedDay || 0, time);  // Check if the slot is booked for the selected day and time

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
