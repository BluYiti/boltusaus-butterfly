"use client"; // Ensure compatibility with Next.js

import React, { useState } from "react";
import Link from "next/link";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";

interface Goal {
  date: string;
  activities: string[];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = 2024;

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<Goal | null>(null);
  const [newActivity, setNewActivity] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const nextMonth = () => setSelectedDate(addMonths(selectedDate, 1));
  const prevMonth = () => setSelectedDate(subMonths(selectedDate, 1));

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";

  const renderDays = () => {
    const dayFormat = "EEEE";
    const days = [];
    const startDate = startOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-lg font-semibold text-blue-900">
          {format(addDays(startDate, i), dayFormat)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-2 mb-4">{days}</div>;
  };

  const handleAddGoal = () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const existingGoal = goals.find((goal) => goal.date === formattedDate);
    if (existingGoal) {
      existingGoal.activities.push(newActivity);
    } else {
      setGoals([...goals, { date: formattedDate, activities: [newActivity] }]);
    }
    setNewActivity(""); 
  };

  const handleConfirm = () => {
    handleAddGoal();
    setShowGoalModal(false); 
    setIsEditing(false); 
  };

  const handleDateClick = (day: Date) => {
    const formattedDate = format(day, "yyyy-MM-dd");
    const dayGoals = goals.find((goal) => goal.date === formattedDate);
    setSelectedGoals(dayGoals || { date: formattedDate, activities: [] });
    setSelectedDate(day); 

    if (!dayGoals || dayGoals.activities.length === 0) {
      setIsEditing(true); 
    } else {
      setIsEditing(false); 
    }

    setShowGoalModal(true);
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        const dayGoal = goals.find(
          (goal) => goal.date === format(day, "yyyy-MM-dd")
        );

        days.push(
          <div
            key={day.toString()}
            className={`p-4 rounded-lg cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : "text-blue-900"
            } ${
              isSameDay(day, selectedDate)
                ? "bg-blue-100 text-blue-900"
                : "hover:bg-blue-200"
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="text-center">{formattedDate}</span>
            <div className="flex justify-center mt-2">
              {dayGoal && dayGoal.activities.length > 0 && (
                <div>
                  {dayGoal.activities.map((activity, index) => (
                    <span key={index} className="mr-1">
                      📝
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="min-h-screen h-full bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 animate-gradient-x flex items-center justify-center">
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg max-w-5xl relative">
        {/* Back Button */}
        <Link href="/client" className="absolute top-4 left-4 bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">
          Back
        </Link>

        <div className="mt-8 flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            &lt;
          </button>
          <h2 className="text-xl font-semibold text-blue-900">
            {months[monthStart.getMonth()]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            &gt;
          </button>
        </div>

        {renderDays()}
        {renderCells()}

        {selectedGoals && (
          <div className="text-gray-500 mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-blue-900">
              Goals for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <ul className="list-disc list-inside mb-4">
              {selectedGoals.activities.length > 0 ? (
                selectedGoals.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))
              ) : (
                <li className="text-gray-600">No goals set for this day.</li>
              )}
            </ul>
            {!isConfirmed && (
              <div className="text-black flex items-center">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Add a new goal"
                  className="border border-gray-300 rounded-lg p-2 w-full mr-2"
                />
                <button
                  onClick={handleAddGoal}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        )}

        {showGoalModal && (
          <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
              <button
                onClick={() => setShowGoalModal(false)}
                className="absolute top-2 left-2 text-gray-600 hover:text-gray-800"
              >
                ✖
              </button>
              <h3 className="text-lg font-bold mb-2 text-blue-900">
                Goals for {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <ul className="list-disc list-inside mb-4">
                {selectedGoals && selectedGoals.activities.length > 0 ? (
                  selectedGoals.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))
                ) : (
                  <li className="text-gray-600">No goals set for this day.</li>
                )}
              </ul>

              {isEditing && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Add a new goal"
                    className="border border-gray-300 rounded-lg p-2 w-full mr-2"
                  />
                  <button
                    onClick={handleAddGoal}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
//TEST
export default Calendar;
