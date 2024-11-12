"use client"; // Add this at the top to mark it as a Client Component

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, addDays, isBefore, isAfter } from 'date-fns';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import ConfirmationModal from "@/components/ConfirmationModal";
import { databases, account } from '@/appwrite'; // Import Appwrite client configuration and account API

interface Goal {
    id: string;
    mood: 'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED';
    activities: string;
    duration: number;
    date: string;
    startTime: string;
    endTime: string;
    setReminder: string;
    progress: 'todo' | 'doing' | 'done' | 'missed';
}

// Appwrite database and collection IDs
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Butterfly-Database';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'Goals';

const GoalsPage = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [mood, setMood] = useState<'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED' | ''>('');
    const [activities, setActivities] = useState('meditate');
    const [startHour, setStartHour] = useState(1);
    const [startMinute, setStartMinute] = useState(0);
    const [startPeriod, setStartPeriod] = useState('AM');
    const [endHour, setEndHour] = useState(2);
    const [endMinute, setEndMinute] = useState(0);
    const [endPeriod, setEndPeriod] = useState('AM');
    const [reminderTime, setReminderTime] = useState(0);
    const [goalReminder, setGoalReminder] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userName, setUserName] = useState('Client'); // Default to "Client" before fetching real name

    const oneWeekAhead = addDays(new Date(), 7);

    // Fetch the real name of the logged-in user from Appwrite
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = await account.get(); // Fetch user details from Appwrite
                if (user && user.name) {
                    setUserName(user.name); // Set the user's real name
                }
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };
        fetchUserName();
    }, []);

    // Fetch goals from Appwrite when component mounts
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
                setGoals(response.documents);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };
        fetchGoals();
    }, []);

    const handleSave = async () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }
    
        const validMood = mood.toLowerCase(); // Convert mood to lowercase
        const validReminderTime = String(reminderTime || 5); // Default to 5 if no reminderTime is selected
        const initialProgress = 'todo'; // Default progress to 'todo'
    
        // Combine selectedDate with startTime and endTime
        const startHour24 = startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startHour; // Convert to 24-hour format
        const endHour24 = endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endHour; // Convert to 24-hour format
    
        // Create DateTime objects for start and end times
        const startTimeISO = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            startHour24,
            startMinute
        ).toISOString();
    
        const endTimeISO = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            endHour24,
            endMinute
        ).toISOString();
    
        // Create the goal object without errors
        const newGoal: Omit<Goal, 'id'> = {
            mood: validMood as Goal['mood'],
            activities, // Ensure this is being passed correctly
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: startTimeISO, // Set the valid ISO string for startTime
            endTime: endTimeISO, // Set the valid ISO string for endTime
            setReminder: validReminderTime,
            progress: initialProgress,
        };
    
        try {
            const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', newGoal);
            setGoals([...goals, { ...newGoal, id: response.$id }]);
            setShowModal(true);
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };

    const changeMonth = (increment: number) => {
        const newDate = addMonths(new Date(currentYear, currentMonth), increment);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
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

    const handleStartHourChange = (newStartHour) => {
        setStartHour(newStartHour);
        updateEndTime(newStartHour, startPeriod);
    };

    const handleStartPeriodChange = (newStartPeriod) => {
        setStartPeriod(newStartPeriod);
        updateEndTime(startHour, newStartPeriod);
    };

    const updateEndTime = (newStartHour, newStartPeriod) => {
        let endHourValue = parseInt(newStartHour) + 1;

        let endPeriodValue = newStartPeriod;
        if (endHourValue > 12) {
            endHourValue = 1;
            endPeriodValue = newStartPeriod === "AM" ? "PM" : "AM";
        }

        setEndHour(endHourValue);
        setEndPeriod(endPeriodValue);
    };

    return (
        <Layout sidebarTitle="Butterfly" sidebarItems={items}>
            <div className="flex-grow p-8 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="bg-white shadow-lg rounded-xl p-8 mb-10 border border-blue-200">
                    <h2 className="text-4xl font-bold text-blue-500 mb-4">Hello, {userName}!</h2>
                    <p className="text-gray-600 text-lg">Set and track your personal goals with ease.</p>
                </div>
                <div className="flex space-x-8">
                    <div className="flex-1 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => changeMonth(-1)}
                                className={`text-gray-400 hover:text-blue-500 hover:scale-105 transition-transform duration-300 ${currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
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
                    <div className="flex-1 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-blue-400">Activity</h3>
                    <div className="flex flex-col gap-2 mt-2">
                        {['meditate', 'exercise', 'read', 'music', 'stroll', 'pet', 'arts'].map((activity) => (
                        <button
                            key={activity}
                            onClick={() => setActivities(activity)}
                            className={`px-4 py-2 rounded-lg focus:outline-none ${
                            activities === activity
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {activity.charAt(0).toUpperCase() + activity.slice(1)}
                        </button>
                        ))}
                    </div>
                    </div>


                    {/* Mood Tracker Section */}
                    <div className="flex-1 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
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
                                        onClick={() => setMood(moodOption.label)}
                                        className={`py-2 px-4 rounded-lg mt-2 transition-colors duration-300 shadow-md 
                                            ${mood === moodOption.label ? selectedMoodColors[moodOption.label] : 'bg-gray-200 text-gray-600'}`}
                                        style={{ opacity: mood === moodOption.label ? 1 : 0.6 }}
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
                        onClick={() => setShowConfirmationModal(true)}
                        className="bg-blue-400 text-white py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors duration-300 shadow-lg"
                    >
                        Save Goal
                    </button>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    showModal={showConfirmationModal}
                    setShowModal={setShowConfirmationModal}
                    selectedDate={selectedDate}
                    title="Are you sure?"
                    message="Do you want to save this goal for"
                    confirmLabel="Yes, Save"
                    cancelLabel="Cancel"
                    onConfirm={handleSave}
                />

{/* Logged Goals Section */}
<div className="mt-12 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
    <h3 className="text-lg font-semibold text-blue-400">Logged Goals</h3>
    {goals.length > 0 ? (
        <ul className="mt-4 space-y-3">
            {goals.map((goal, index) => {
                const currentTime = new Date().getTime();
                const goalEndTime = new Date(goal.endTime).getTime();

                // Check if the goal's end time has passed
                const isPastEndTime = currentTime > goalEndTime;

                // Determine the display progress
                const displayProgress = isPastEndTime ? 'missing' : goal.progress;

                // Define dropdown class based on progress or if the end time has passed
                let dropdownClass = 'border rounded-lg p-2 focus:outline-none focus:ring-2 text-gray-700 transition-colors duration-200';

                // Apply background color based on progress
                if (isPastEndTime) {
                    dropdownClass += ' bg-red-500 text-white'; // Red if the end time has passed
                } else if (goal.progress === 'done') {
                    dropdownClass += ' bg-green-500 text-white'; // Green for "done"
                } else if (goal.progress === 'doing') {
                    dropdownClass += ' bg-yellow-500 text-white'; // Yellow for "doing"
                } else {
                    dropdownClass += ' bg-white'; // Default white for "to do"
                }

                return (
                    <li
                        key={goal.id || index} // Ensure a unique key using `goal.id` or fallback to `index`
                        className="p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center"
                    >
                        <div>
                            <p className="text-sm">
                                {goal.activities} for {goal.duration} minutes on {goal.date} (Mood: {goal.mood})
                            </p>
                            <p className="text-xs text-gray-500">Status: {displayProgress}</p> {/* Display 'missing' if applicable */}
                        </div>
                        {!isPastEndTime ? ( // Render the dropdown only if the end time has not passed
                            <select
                                value={goal.progress}
                                onChange={(e) => {
                                    const updatedGoals = goals.map((g, idx) =>
                                        idx === index ? { ...g, progress: e.target.value as Goal['progress'] } : g
                                    );
                                    setGoals(updatedGoals); // Update only the specific goal's state
                                }}
                                className={dropdownClass}
                                disabled={isPastEndTime} // Disable dropdown if the end time has passed
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </select>
                        ) : (
                            <span className="text-red-500">Missing</span> // Show 'Missing' if the end time has passed
                        )}
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
