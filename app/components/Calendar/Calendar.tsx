import React, { useState, useEffect } from 'react';
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
    const [isNextMonthAvailable, setIsNextMonthAvailable] = useState(false);
    const [isFormComplete, setIsFormComplete] = useState(false);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate());
    const isPreviousMonthAvailable = date > new Date(today.getFullYear(), today.getMonth(), 1);

    const bookingEndDate = new Date(today);
    bookingEndDate.setDate(today.getDate() + 8);

    // Check if today is on or after the 25th of the month
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

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = event.target.value;
        setSelectedMonth(selectedMonth);
        setSelectedDay(null);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
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
                    onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
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
                {["10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"].map((time) => (
                    <button
                        key={time}
                        className={`py-2 px-4 rounded-lg ${selectedTime === time ? "bg-blue-300 text-white" : "bg-gray-300 text-black hover:bg-blue-500 hover:text-white hover:scale-110"}`}
                        onClick={() => setSelectedTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calendar;