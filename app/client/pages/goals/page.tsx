'use client';  // Ensure client-side rendering

import React, { useState } from 'react';
import { Client, Databases } from 'appwrite';
import { format, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import Layout from '@/components/Sidebar/Layout';  // Ensure Layout component path is correct
import items from '@/client/data/Links';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint('https://YOUR_APPWRITE_ENDPOINT').setProject('YOUR_PROJECT_ID');

// Initialize Appwrite Databases service
const databases = new Databases(client);

const GoalsPage = () => {
    const [mood, setMood] = useState<'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED' | ''>(''); // Default mood
    const [activity, setActivity] = useState('Meditate'); // Default activity
    const [duration, setDuration] = useState(30); // Default duration
    const [goalReminder, setGoalReminder] = useState(false); // Default goal reminder
    const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Selected date for activity
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // Current month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Current year
    const [showModal, setShowModal] = useState(false); // State for controlling modal visibility

    // Save function to store data in Appwrite
    const handleSave = async () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }

        const data = {
            mood,
            activity,
            duration,
            date: format(selectedDate, 'yyyy-MM-dd'),
            goalReminder,
        };

        try {
          await databases.createDocument('YOUR_DATABASE_ID', 'YOUR_COLLECTION_ID', 'unique()', data);
          setShowModal(true); // Show the success modal after saving
      } catch (error) {
          console.error(error);
          alert('Error saving data');
      }
  };

    // Placeholder remove function
    const handleRemove = () => {
        alert('Removed successfully!');
    };

    // Function to change month and update state
    const changeMonth = (increment: number) => {
        const newDate = addMonths(new Date(currentYear, currentMonth), increment);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
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

    // Define mood colors for buttons
    const moodColors = {
        HAPPY: 'hover:bg-yellow-500',
        SAD: 'hover:bg-blue-500',
        ANXIOUS: 'hover:bg-orange-500',
        FEAR: 'hover:bg-red-500',
        FRUSTRATED: 'hover:bg-purple-500',
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
                                className="text-gray-600 hover:text-blue-500 hover:scale-105 transition-transform"
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
                    onClick={() => setMood(moodOption)}
                    className={`border rounded p-2 my-1 w-full transition-colors duration-300 
                        ${mood === moodOption ? selectedMoodColors[moodOption] + ' text-white' : moodColors[moodOption] + ' text-gray-800'} hover:text-white`}
                >
                    {moodOption}
                </button>
            );
        })}
    </div>
</div>


                </div>

                {/* Save and Remove Buttons */}
                <div className="mt-4 flex flex-col space-y-4 items-center">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded w-40"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleRemove}
                        className="bg-red-500 text-white px-4 py-2 rounded w-40"
                    >
                        Remove
                    </button>
                </div>

                 {/* Modal for success message */}
                 {showModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8">
                            <h3 className="text-lg font-semibold mb-4">You have successfully set a goal!</h3>
                            <p className="mb-4">You may view your goals on your profile page.</p>
                            <div className="flex space-x-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        setShowModal(false);
                                        // Add your routing logic to navigate to the profile page here
                                    }}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}



            </div>
        </Layout>
    );
};

export default GoalsPage;
