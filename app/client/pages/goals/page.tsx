'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import Layout from '@/components/Sidebar/Layout'; // Ensure Layout component path is correct
import items from '@/client/data/Links';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const GoalsPage = () => {
    const currentDate = new Date(); // Get current date to prevent going backward
    const currentMonthReal = currentDate.getMonth(); // Real current month
    const currentYearReal = currentDate.getFullYear(); // Real current year
    
    const [mood, setMood] = useState<'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED' | ''>(''); // Default mood
    const [activity, setActivity] = useState('Meditate'); // Default activity
    const [duration, setDuration] = useState(30); // Default duration
    const [goalReminder, setGoalReminder] = useState(false); // Default goal reminder
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Selected date for activity
    const [currentMonth, setCurrentMonth] = useState(currentMonthReal); // Start with the real current month
    const [currentYear, setCurrentYear] = useState(currentYearReal); // Start with the real current year
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility
    const [goals, setGoals] = useState([]); // Mock goals data for simulation

    // Save function to mock saving a goal locally
    const handleSave = () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        const newGoal = {
            id: goals.length + 1, // Mock unique ID for the goal
            mood,
            activity,
            duration,
            date: format(selectedDate, 'yyyy-MM-dd'),
            goalReminder,
        };

        setGoals([...goals, newGoal]); // Add the new goal to the list
        setShowModal(true); // Show the success modal after saving
    };

    // Function to change month and update state, preventing navigation before the current month
    const changeMonth = (increment: number) => {
        const newDate = addMonths(new Date(currentYear, currentMonth), increment);
        const newMonth = newDate.getMonth();
        const newYear = newDate.getFullYear();

        if (newYear > currentYearReal || (newYear === currentYearReal && newMonth >= currentMonthReal)) {
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
        }
    };

    // Get start and end dates of the current month
    const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth));
    const lastDayOfMonth = endOfMonth(new Date(currentYear, currentMonth));

    // Days in the current month for the calendar
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const leadingBlankDays = firstDayOfMonth.getDay(); // Blank days before the 1st of the month
    const totalDays = [...Array(leadingBlankDays).fill(null), ...daysInMonth];

    // Handle clicking on a date
    const handleDateClick = (day: number | null) => {
        if (day) {
            const clickedDate = new Date(currentYear, currentMonth, day);
            setSelectedDate(clickedDate);
        }
    };

    return (
        <Layout sidebarTitle="Butterfly" sidebarItems={items}>
            <div className="flex-grow p-8 bg-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Hello, Client!</h2>

                <div className="flex space-x-4">
                    {/* Calendar Section */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => changeMonth(-1)}
                                className={`text-gray-600 hover:text-blue-500 hover:scale-105 transition-transform ${currentYear === currentYearReal && currentMonth === currentMonthReal ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={currentYear === currentYearReal && currentMonth === currentMonthReal} // Disable the button if viewing the current month
                            >
                                <MdArrowBack size={24} />
                            </button>
                            <h2 className="text-lg font-semibold">{format(new Date(currentYear, currentMonth), 'MMMM yyyy')}</h2>
                            <button
                                onClick={() => changeMonth(1)}
                                className="text-gray-600 hover:text-blue-500 hover:scale-105 transition-transform"
                            >
                                <MdArrowForward size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                            {/* Days of the week */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="font-bold text-center">{day}</div>
                            ))}
                            {/* Calendar days */}
                            {totalDays.map((day, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleDateClick(day)}
                                    className={`h-16 flex items-center justify-center border cursor-pointer ${day ? 'hover:bg-blue-500 hover:text-white' : ''} ${selectedDate && selectedDate.getDate() === day ? 'bg-blue-500 text-white' : ''}`}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Section */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-4">
                        <h3 className="font-semibold">Activity</h3>
                        <select
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            className="border rounded p-2 mt-2 w-full"
                        >
                            <option value="Meditate">Meditate</option>
                            <option value="Exercise">Exercise</option>
                            <option value="Read">Read</option>
                            <option value="Listen to Music">Music</option>
                            <option value="Walk">Walk</option>
                        </select>
                        <div className="mt-2">
                            <label className="block">Duration:</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="border rounded p-2 mt-1 w-full"
                            >
                                <option value={10}>10 minutes</option>
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={50}>50 minutes</option>
                                <option value={55}>55 minutes</option>
                                <option value={60}>1 hour</option>
                            </select>
                        </div>
                        <div className="mt-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={goalReminder}
                                    onChange={() => setGoalReminder(!goalReminder)}
                                    className="mr-2"
                                />
                                Set Goal Reminder
                            </label>
                        </div>
                    </div>

                    {/* Mood Tracker Section */}
                    <div className="flex-1 bg-white shadow-md rounded-lg p-4">
                        <h3 className="font-semibold">Mood Tracker</h3>
                        <div className="flex flex-col mt-2">
                            {['HAPPY', 'SAD', 'ANXIOUS', 'FEAR', 'FRUSTRATED'].map((moodOption) => {
                                const moodColors = {
                                    HAPPY: 'bg-yellow-200 hover:bg-yellow-400',
                                    SAD: 'bg-blue-200 hover:bg-blue-400',
                                    ANXIOUS: 'bg-orange-200 hover:bg-orange-400',
                                    FEAR: 'bg-red-200 hover:bg-red-400',
                                    FRUSTRATED: 'bg-purple-200 hover:bg-purple-400',
                                };

                                const selectedMoodColors = {
                                    HAPPY: 'bg-yellow-500',
                                    SAD: 'bg-blue-500',
                                    ANXIOUS: 'bg-orange-500',
                                    FEAR: 'bg-red-500',
                                    FRUSTRATED: 'bg-purple-500',
                                };

                                return (
                                    <button
                                        key={moodOption}
                                        onClick={() => setMood(moodOption as 'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED')}
                                        className={`p-4 rounded-lg mb-2 text-center text-black ${mood === moodOption ? selectedMoodColors[moodOption] : moodColors[moodOption]}`}
                                    >
                                        {moodOption}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex space-x-4 mt-8">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Save Goal
                    </button>
                </div>

                {/* Modal for success message */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
                        <div className="bg-white p-4 rounded shadow-lg animate-fade-in">
                            <h2 className="text-lg font-bold text-green-600">Goal Saved Successfully!</h2>
                            <p className="mt-2 text-gray-700">Your goal for {format(selectedDate!, 'MMMM dd, yyyy')} has been saved.</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Displaying saved goals as logs */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold">Logged Goals</h3>
                    {goals.length > 0 ? (
                        <ul className="mt-4">
                            {goals.map((goal) => (
                                <li key={goal.id} className="p-2 border-b">
                                    {goal.activity} for {goal.duration} minutes on {goal.date} (Mood: {goal.mood})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-2">No goals logged yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GoalsPage;
