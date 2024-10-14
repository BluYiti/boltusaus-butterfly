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
            today.setHours(0, 0, 0, 0);

            if (isBefore(clickedDate, today)) {
                alert("You cannot select a past date.");
                return;
            }
            if (isAfter(clickedDate, oneWeekAhead)) {
                alert("You cannot select a date more than one week in the future.");
                return;
            }

            setSelectedDate(clickedDate);
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

        return (
            <div
                key={index}
                onClick={() => !isPast && !isTooFar && handleDateClick(day)}
                className={`h-16 flex items-center justify-center border rounded-lg transition-colors duration-300
                ${day ? '' : ''} 
                ${isSelected ? 'bg-blue-400 text-white' : 'bg-gray-100'} 
                ${!isSelected && !isPast && !isTooFar ? 'hover:bg-blue-500 hover:text-white' : ''} 
                ${isPast || isTooFar ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
                        >
                            <option value="Meditate">Meditate</option>
                            <option value="Exercise">Exercise</option>
                            <option value="Read">Read</option>
                            <option value="Listen to Music">Music</option>
                            <option value="Stroll">Stroll</option>
                            <option value="Pet time">Pet time</option>
                            <option value="Arts">Arts</option>
                        </select>
                        <div className="mt-4">
                            <label className="block font-semibold text-gray-700">Duration:</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="border rounded-lg p-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                            <label className="flex items-center font-semibold text-gray-700">
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
                    <div className="flex-1 bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h3 className="font-semibold text-blue-400">Mood Tracker</h3>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {[
                                { label: 'HAPPY', emoji: '😊' },
                                { label: 'SAD', emoji: '😢' },
                                { label: 'ANXIOUS', emoji: '😰' },
                                { label: 'FEAR', emoji: '😨' },
                                { label: 'FRUSTRATED', emoji: '😠' },
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
                                        className={`py-2 px-4 rounded-lg mt-2 transition-colors duration-300 shadow-md ${mood === moodOption.label ? selectedMoodColors[moodOption.label] : moodColors[moodOption.label]}`}
                                    >
                                        {moodOption.emoji} {moodOption.label}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => setMood('')}
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
                    >
                        Save Goal
                    </button>
                </div>

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