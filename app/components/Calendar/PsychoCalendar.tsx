import React, { useState, useEffect, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DayGrid from '@/components/Calendar/DayGrid';

interface CalendarProps {
  currentMonth: string;
  nextMonth: string;
  currentYear: number;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
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
}) => {
  const [date, setDate] = useState(new Date(currentYear, new Date(`${currentMonth} 1, ${currentYear}`).getMonth()));

  // Get days in a month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  // Get the first day of the month (0 = Sunday, 1 = Monday, ...)
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleNextMonthClick = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setDate(newDate);
    setSelectedMonth(newDate.toLocaleString("default", { month: "long" }));
  };

  const handlePreviousMonthClick = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setDate(newDate);
    setSelectedMonth(newDate.toLocaleString("default", { month: "long" }));
  };

  // Days to display for the current month
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(date.getFullYear(), date.getMonth());

  // Generate an array for empty slots before the first day
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Generate an array of days in the month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePreviousMonthClick}
          className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
          aria-label="Previous Month"
        >
          <FaChevronLeft />
        </button>

        <h4 className="font-semibold text-xl text-blue-400">
          {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
        </h4>

        <button
          onClick={handleNextMonthClick}
          className="p-2 text-blue-500 hover:bg-blue-100 rounded transition"
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
        {/* Empty slots */}
        {emptySlots.map((_, index) => (
          <div key={index} className="invisible">-</div>
        ))}

        {/* Days in the month */}
        {daysArray.map((day) => {
        const isToday =
            day === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

        const isWeekend = [0, 6].includes(new Date(date.getFullYear(), date.getMonth(), day).getDay());

        return (
            <button
            key={day}
            className={`py-2 px-1 rounded-lg ${
                selectedDay === day
                ? "bg-blue-300 text-white"
                : isToday
                ? "bg-green-200 text-black"
                : isWeekend
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-blue-100"
            }`}
            onClick={() => !isWeekend && setSelectedDay(day)}
            disabled={isWeekend}
            >
            {day}
            </button>
        );
        })}
      </div>

      <div>
          <DayGrid selectedDay={selectedDay} selectedMonth={selectedMonth} />
        </div>
    </div>
  );
};

export default Calendar;
