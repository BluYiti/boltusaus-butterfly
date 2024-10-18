"use client"; // Add this at the top to mark it as a Client Component

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, addDays, isBefore, isAfter, isSameDay } from 'date-fns';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const GoalsPage = () => {
    const currentDate = new Date();
    const currentMonthReal = currentDate.getMonth();
    const currentYearReal = currentDate.getFullYear();

    const [mood, setMood] = useState<'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED' | ''>('');
    const [activity, setActivity] = useState('Meditate');
 
    const [startHour, setStartHour] = useState(1); // Default start hour
    const [startMinute, setStartMinute] = useState(0);
    const [startPeriod, setStartPeriod] = useState('AM');
    
    const [endMinute, setEndMinute] = useState(0);
    const [endPeriod, setEndPeriod] = useState('AM'); 
    const [endHour, setEndHour] = useState(2); // End period can default to AM
    
    const [reminderTime, setReminderTime] = useState(0); // Default to no reminder

    

    const [goalReminder, setGoalReminder] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(currentMonthReal);
    const [currentYear, setCurrentYear] = useState(currentYearReal);
    const [showModal, setShowModal] = useState(false);
    const [goals, setGoals] = useState<any[]>([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);


    const oneWeekAhead = addDays(currentDate, 7);

    const handleSave = () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        const newGoal = {
            id: goals.length + 1,
            mood,
            activity,
            duration,
            date: format(selectedDate, 'yyyy-MM-dd'),
            goalReminder,
            status: 'To Do',
        };

        setGoals([...goals, newGoal]);
        setShowConfirmationModal(true); // Show the confirmation modal
    };

    const changeMonth = (increment: number) => {
        const newDate = addMonths(new Date(currentYear, currentMonth), increment);
        const newMonth = newDate.getMonth();
        const newYear = newDate.getFullYear();

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth));
    const lastDayOfMonth = endOfMonth(new Date(currentYear, currentMonth));
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const leadingBlankDays = firstDayOfMonth.getDay();
    const totalDays = [...Array(leadingBlankDays).fill(null), ...daysInMonth];

    const handleDateClick = (day: number | null) => {
        if (day) {
            const clickedDate = new Date(currentYear, currentMonth, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (isBefore(clickedDate, today)) {
                alert("You cannot select a past date.");
                return;
            }
            if (isAfter(clickedDate, oneWeekAhead)) {
                alert("You cannot select a date more than one week in the future.");
                return;
            }
            if (isDayWithGoal(day)) {
                alert("A goal is already set for this date.");
                return;
            }
    
            setSelectedDate(clickedDate);
        }
    };

    // Disable days that already have goals
    const isDayWithGoal = (day: number) => {
        const dayDate = new Date(currentYear, currentMonth, day);
        return goals.some((goal) => isSameDay(new Date(goal.date), dayDate));
    };

    const hasGoalForSelectedDate = selectedDate ? isDayWithGoal(selectedDate.getDate()) : false;


    const handleStartHourChange = (hour) => {
        const hourNumber = Number(hour);
        setStartHour(hourNumber);
    
        // Calculate end hour and period based on start hour
        if (hourNumber === 12) {
            // If starting at 12, set end hour to 1 and switch period
            setEndHour(1);
            setEndPeriod(startPeriod === 'AM' ? 'PM' : 'AM');
        } else {
            // Set end hour to one hour later, wrapping around at 12
            const newEndHour = hourNumber + 1 > 12 ? 1 : hourNumber + 1;
            setEndHour(newEndHour);
            setEndPeriod(startPeriod); // Keep the same period
        }
    };
    
    
    

    return (
        <Layout sidebarTitle="Butterfly" sidebarItems={items}>
            <div className="flex-grow p-8 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-200">
                    <h2 className="text-4xl font-bold text-blue-500 mb-4">Hello, Client!</h2>
                    <p className="text-gray-600 text-lg">Set and track your personal goals with ease.</p>
                </div>
                <div className="flex space-x-8">
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => changeMonth(-1)}
                                className={`text-gray-400 hover:text-blue-500 hover:scale-105 transition-transform duration-300 ${currentYear === currentYearReal && currentMonth === currentMonthReal ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={currentYear === currentYearReal && currentMonth === currentMonthReal}
                            >
                                <MdArrowBack size={24} />
                            </button>
                            <h2 className="text-2xl font-semibold text-blue-400">{format(new Date(currentYear, currentMonth), 'MMMM yyyy')}</h2>
                            <button
                                onClick={() => changeMonth(1)}
                                className={`text-gray-800 hover:text-blue-500 hover:scale-105 transition-transform duration-300 ${isAfter(new Date(currentYear, currentMonth), oneWeekAhead) ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={isAfter(new Date(currentYear, currentMonth), oneWeekAhead)}
                            >
                                <MdArrowForward size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-3 mt-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="font-semibold text-center text-gray-600">{day}</div>
                            ))}
                            {totalDays.map((day, index) => {
                                const dayDate = day ? new Date(currentYear, currentMonth, day) : null;
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const isPast = dayDate && isBefore(dayDate, today) && dayDate.getTime() !== today.getTime();
                                const isTooFar = dayDate && isAfter(dayDate, oneWeekAhead);
                                const isSelected = selectedDate && selectedDate.getDate() === day;
                                const hasGoal = day && isDayWithGoal(day);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => !isPast && !isTooFar && !hasGoal && handleDateClick(day)}
                                        className={`h-16 flex items-center justify-center border rounded-lg transition-colors duration-300
                                        ${day ? '' : ''} 
                                        ${isSelected ? 'bg-blue-400 text-white' : 'bg-gray-100'} 
                                        ${hasGoal ? 'bg-green-400 text-white cursor-not-allowed opacity-50' : ''}
                                        ${!isSelected && !isPast && !isTooFar && !hasGoal ? 'hover:bg-blue-500 hover:text-white' : ''} 
                                        ${isPast || isTooFar || hasGoal ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                
{/* Activity Section */}
<div className="flex-1 bg-white shadow-md rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-blue-400">Activity</h3>
    
    <select
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
        className="border rounded-lg p-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        disabled={hasGoalForSelectedDate}
    >
        <option value="Meditate">Meditate</option>
        <option value="Exercise">Exercise</option>
        <option value="Read">Read</option>
        <option value="Listen to Music">Music</option>
        <option value="Stroll">Stroll</option>
        <option value="Pet time">Pet time</option>
        <option value="Arts">Arts</option>
    </select>

{/* Start Time Selection */}
<div className="mt-4">
                <label className="block font-semibold text-gray-700">Start Time:</label>
                <div className="flex space-x-2">
                    <select
                        value={startHour}
                        onChange={(e) => handleStartHourChange(e.target.value)}
                        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        {[...Array(12).keys()].map((hour) => (
                            <option key={hour + 1} value={hour + 1}>
                                {hour + 1}
                            </option>
                        ))}
                    </select>

                    <select
                        value={startMinute}
                        onChange={(e) => setStartMinute(Number(e.target.value))}
                        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        {[0, 10, 15, 20, 30, 40, 45, 50, 55].map((minute) => (
                            <option key={minute} value={minute}>
                                {minute < 10 ? `0${minute}` : minute}
                            </option>
                        ))}
                    </select>

                    <select
                        value={startPeriod}
                        onChange={(e) => setStartPeriod(e.target.value)}
                        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>

            {/* End Time Selection */}
            <div className="mt-4">
                <label className="block font-semibold text-gray-700">End Time:</label>
                <div className="flex space-x-2">
                    <select
                        value={endHour}
                        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        disabled={true} // Disable user interaction
                    >
                        <option value={endHour}>{endHour}</option> {/* Display end hour */}
                    </select>

                    <select
                        value={endMinute}
                        onChange={(e) => setEndMinute(Number(e.target.value))}
                        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        {[0, 10, 15, 20, 30, 40, 45, 50, 55].map((minute) => (
                            <option key={minute} value={minute}>
                                {minute < 10 ? `0${minute}` : minute}
                            </option>
                        ))}
                    </select>

                    <select
                        value={endPeriod}
                        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        disabled={true} // Disable user interaction
                    >
                        <option value={endPeriod}>{endPeriod}</option> {/* Display end period */}
                    </select>
                </div>
            </div>



    {/* Reminder Selection */}
<div className="mt-4">
    <label className="block font-semibold text-gray-700">Reminder:</label>
    <select
        value={reminderTime}
        onChange={(e) => setReminderTime(Number(e.target.value))}
        className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        disabled={hasGoalForSelectedDate}
    >
        <option value={0}>None</option>
        <option value={5}>5 minutes before</option>
        <option value={10}>10 minutes before</option>
        <option value={15}>15 minutes before</option>
        <option value={20}>20 minutes before</option>
        <option value={30}>30 minutes before</option>
    </select>
</div>


    <div className="mt-4">
        <label className="flex items-center font-semibold text-gray-700">
            <input
                type="checkbox"
                checked={goalReminder}
                onChange={() => setGoalReminder(!goalReminder)}
                className="mr-2"
                disabled={hasGoalForSelectedDate}
            />
            Set Goal Reminder
        </label>
    </div>
</div>


                    {/* Mood Tracker Section */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h3 className="font-semibold text-blue-400">Mood Tracker</h3>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {[ 
                                { label: 'HAPPY', emoji: '😊' }, 
                                { label: 'SAD', emoji: '😢' }, 
                                { label: 'ANXIOUS', emoji: '😰' }, 
                                { label: 'FEAR', emoji: '😨' }, 
                                { label: 'FRUSTRATED', emoji: '😠' }
                            ].map((moodOption) => {
                                const moodColors = {
                                    HAPPY: 'bg-yellow-200 hover:bg-yellow-400 hover:text-white',
                                    SAD: 'bg-blue-200 hover:bg-blue-400 hover:text-white',
                                    ANXIOUS: 'bg-orange-200 hover:bg-orange-400 hover:text-white',
                                    FEAR: 'bg-red-200 hover:bg-red-400 hover:text-white',
                                    FRUSTRATED: 'bg-purple-200 hover:bg-purple-400 hover:text-white',
                                };

                                const selectedMoodColors = {
                                    HAPPY: 'bg-yellow-500 text-white',
                                    SAD: 'bg-blue-500 text-white',
                                    ANXIOUS: 'bg-orange-500 text-white',
                                    FEAR: 'bg-red-500 text-white',
                                    FRUSTRATED: 'bg-purple-500 text-white',
                                };

                                return (
                                    <button
                                        key={moodOption.label}
                                        onClick={() => setMood(moodOption.label as typeof mood)}
                                        className={`py-2 px-4 rounded-lg mt-2 transition-colors duration-300 shadow-md 
                                            ${mood === moodOption.label ? selectedMoodColors[moodOption.label] : 'bg-gray-200 text-gray-600'}`}
                                        style={{ opacity: mood === moodOption.label ? 1 : 0.6 }} // Emphasize the selected mood
                                    >
                                        {moodOption.emoji} {moodOption.label}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setMood('')} // Remove the setMoodColors line
                            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 shadow-md"
                        >
                            Cancel Mood Selection
                        </button>


                    </div>
                </div>

                {/* Save Button and Modal */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSave}
                        className="bg-blue-400 text-white py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors duration-300 shadow-lg"
                        disabled={hasGoalForSelectedDate}
                    >
                        Save Goal
                    </button>
                </div>

                {showConfirmationModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                        <div className="bg-white p-8 rounded-lg shadow-xl">
                            <h2 className="text-xl font-bold text-blue-500">Are you sure?</h2>
                            <p className="mt-4 text-gray-700">Do you want to save this goal for {format(selectedDate!, 'MMMM dd, yyyy')}?</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => {
                                        // Save the goal here
                                        const newGoal = {
                                            id: goals.length + 1,
                                            mood,
                                            activity,
                                            duration,
                                            date: format(selectedDate, 'yyyy-MM-dd'),
                                            goalReminder,
                                            status: 'To Do',
                                        };

                                        setGoals([...goals, newGoal]);
                                        setShowModal(true); // Show success modal
                                        setShowConfirmationModal(false); // Close the confirmation modal
                                    }}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                >
                                    Yes, Save
                                </button>
                                <button
                                    onClick={() => setShowConfirmationModal(false)} // Close the modal
                                    className="ml-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                        <div className="bg-white p-8 rounded-lg shadow-xl">
                            <h2 className="text-xl font-bold text-green-600">Goal Saved Successfully!</h2>
                            <p className="mt-4 text-gray-700">Your goal for {format(selectedDate!, 'MMMM dd, yyyy')} has been saved.</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Logged Goals Section */}
                <div className="mt-12 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-blue-400">Logged Goals</h3>
                    {goals.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                            {goals.map((goal) => {
                                // Automatically mark the goal as "Missed" if the date has passed and the goal is not done
                                const goalDate = new Date(goal.date);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                if (goalDate < today && goal.status !== 'Done') {
                                    goal.status = 'Missed';
                                }

                                return (
                                    <li
                                        key={goal.id}
                                        className="p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-sm">
                                                {goal.activity} for {goal.duration} minutes on {goal.date} (Mood: {goal.mood})
                                            </p>
                                            <p className="text-xs text-gray-500">Status: {goal.status}</p>
                                        </div>
                                        <select
                                            value={goal.status}
                                            onChange={(e) => {
                                                setGoals(goals.map((g) =>
                                                    g.id === goal.id ? { ...g, status: e.target.value } : g
                                                ));
                                            }}
                                            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                                        >
                                            <option value="To Do" className="text-blue-500">To Do</option>
                                            <option value="Doing" className="text-yellow-500">Doing</option>
                                            <option value="Done" className="text-green-500">Done</option>
                                        </select>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="mt-2 text-gray-600">No goals logged yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GoalsPage;

