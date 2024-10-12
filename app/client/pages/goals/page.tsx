'use client';

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, addDays, isBefore, isAfter } from 'date-fns';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

const GoalsPage = () => {
    const currentDate = new Date();
    const currentMonthReal = currentDate.getMonth();
    const currentYearReal = currentDate.getFullYear();

    const [mood, setMood] = useState<'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED' | ''>('');
    const [activity, setActivity] = useState('Meditate');
    const [duration, setDuration] = useState(30);
    const [goalReminder, setGoalReminder] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(currentMonthReal);
    const [currentYear, setCurrentYear] = useState(currentYearReal);
    const [showModal, setShowModal] = useState(false);
    const [goals, setGoals] = useState([]);

    const twoWeeksAgo = addDays(currentDate, -14);  // 2 weeks ago
    const twoWeeksAhead = addDays(currentDate, 14); // 2 weeks ahead

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
        };

        setGoals([...goals, newGoal]);
        setShowModal(true);
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
    
            // Ensure the clicked date is within the allowed range
            if (isBefore(clickedDate, today)) {
                alert("You cannot select a past date.");
                return;
            }
            if (isAfter(clickedDate, twoWeeksAhead)) {
                alert("You cannot select a date more than two weeks in the future.");
                return;
            }
    
            setSelectedDate(clickedDate);
        }
    };

    return (
        <Layout sidebarTitle="Butterfly" sidebarItems={items}>
            <div className="flex-grow p-8 bg-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Hello, Client!</h2>

                <div className="flex space-x-6">
                    {/* Calendar Section */}
                    <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => changeMonth(-1)}
                                className={`text-gray-500 hover:text-blue-500 hover:scale-105 transition-transform duration-300 ${currentYear === currentYearReal && currentMonth === currentMonthReal ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={currentYear === currentYearReal && currentMonth === currentMonthReal}
                            >
                                <MdArrowBack size={24} />
                            </button>
                            <h2 className="text-xl font-medium">{format(new Date(currentYear, currentMonth), 'MMMM yyyy')}</h2>
                            <button
                                onClick={() => changeMonth(1)}
                                className={`text-gray-500 hover:text-blue-500 hover:scale-105 transition-transform duration-300 ${isAfter(new Date(currentYear, currentMonth), twoWeeksAhead) ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={isAfter(new Date(currentYear, currentMonth), twoWeeksAhead)}
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
                                const isPast = dayDate && isBefore(dayDate, new Date()); // Disable past dates
                                const isTooFar = dayDate && isAfter(dayDate, twoWeeksAhead);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => !isPast && !isTooFar && handleDateClick(day)}
                                        className={`h-16 flex items-center justify-center border rounded-lg ${day ? 'hover:bg-blue-500 hover:text-white transition-colors duration-300' : ''} ${selectedDate && selectedDate.getDate() === day ? 'bg-blue-400 text-white' : ''} 
                                        ${isPast || isTooFar ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Activity Section */}
                    <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-lg font-semibold">Activity</h3>
                        <select
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            className="border rounded p-2 mt-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="Meditate">Meditate</option>
                            <option value="Exercise">Exercise</option>
                            <option value="Read">Read</option>
                            <option value="Listen to Music">Music</option>
                            <option value="Walk">Walk</option>
                        </select>
                        <div className="mt-4">
                            <label className="block font-semibold">Duration:</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="border rounded p-2 mt-1 w-full focus:outline-none focus:ring focus:ring-blue-300"
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
                        <div className="mt-4">
                            <label className="flex items-center font-semibold">
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
                    <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                        <h3 className="font-semibold">Mood Tracker</h3>
                        <div className="flex flex-col mt-4">
                            {['HAPPY', 'SAD', 'ANXIOUS', 'FEAR', 'FRUSTRATED'].map((moodOption) => {
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
                                        key={moodOption}
                                        onClick={() => setMood(moodOption as typeof mood)}
                                        className={`py-2 px-4 rounded-lg mt-2 transition-colors duration-300 ${mood === moodOption ? selectedMoodColors[moodOption] : moodColors[moodOption]}`}
                                    >
                                        {moodOption}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setMood('')}
                            className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                        >
                            Cancel Mood Selection
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={handleSave}
                        className="bg-blue-400 text-white py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors duration-300"
                    >
                        Save Goal
                    </button>
                </div>

                {/* Success Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                        <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
                            <h2 className="text-lg font-bold text-green-600">Goal Saved Successfully!</h2>
                            <p className="mt-4 text-gray-700">Your goal for {format(selectedDate!, 'MMMM dd, yyyy')} has been saved.</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Displaying Saved Goals */}
                <div className="mt-12">
                    <h3 className="text-lg font-semibold">Logged Goals</h3>
                    {goals.length > 0 ? (
                        <ul className="mt-4 space-y-3">
                            {goals.map((goal) => (
                                <li key={goal.id} className="p-3 border-b bg-white shadow rounded-lg">
                                    {goal.activity} for {goal.duration} minutes on {goal.date} (Mood: {goal.mood})
                                </li>
                            ))}
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
