"use client"; // Add this at the top to mark it as a Client Component

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, addDays, isBefore, isAfter } from 'date-fns';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import ConfirmationModal from "@/components/ConfirmationModal";
import { Account, Client, Databases, Permission, Query, Role } from 'appwrite';

interface Goal {
    id: string;
    client: string;
    clientId: string;
    psychotherapist: string;
    psychotherapistId: string; 
    mood: 'HAPPY' | 'SAD' | 'ANXIOUS' | 'FEAR' | 'FRUSTRATED';
    activities: string;
    date: string;
    startTime: string;
    endTime: string;
    progress: 'todo' | 'doing' | 'done' | 'missed';
}

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);
  const databases = new Databases(client);
  const account = new Account(client);
const CLIENT_COLLECTION_ID = 'Client';

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
    const [goalReminder, setGoalReminder] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userName, setUserName] = useState('Client');
    const [clientId, setClientId] = useState<string | null>(null);
    const [psychotherapistId, setPsychotherapistId] = useState<string | null>(null);

    const oneWeekAhead = addDays(new Date(), 7);

    // Fetch the real name of the logged-in user and client/psychotherapist IDs
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await account.get();
                if (user && user.name) {
                    setUserName(user.name);
                    console.log('User:', user);

                    // Fetch the client document for the logged-in user
                    const clientResponse = await databases.listDocuments('Butterfly-Database', CLIENT_COLLECTION_ID, [
                        Query.equal("userid", user.$id),
                    ]);

                    if (clientResponse.documents.length > 0) {
                        const clientDoc = clientResponse.documents[0];
                        setClientId(clientDoc.$id);
                        console.log('Client Document:', clientDoc);

                        // Check if psychotherapist is linked in the client document
                        if (clientDoc.psychotherapist) {
                            setPsychotherapistId(clientDoc.psychotherapist);
                        } else {
                            console.warn('Psychotherapist ID not found in Client document.');
                        }
                    } else {
                        console.warn('Client document not found for user.');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    // Function to fetch goals created by the authenticated user
useEffect(() => {
    const fetchUserGoals = async () => {
        try {
            // Retrieve the current user
            const user = await account.get().catch(error => {
                console.error("User not authenticated:", error);
                alert("Please log in to view goals.");
                return null;
            });

            if (!user) return;

            // Fetch the Client document ID for the current user
            const clientResponse = await databases.listDocuments('Butterfly-Database', 'Client', [
                Query.equal('userid', user.$id)
            ]);

            if (clientResponse.documents.length === 0) {
                throw new Error("Client document not found for the current user.");
            }

            const clientDocument = clientResponse.documents[0];
            const clientId = clientDocument.$id;

            // Fetch goals where the clientId matches the logged-in user's clientId
            const response = await databases.listDocuments('Butterfly-Database', 'Goals', [
                Query.equal('clientId', clientId)
            ]);

            // Set only the goals created by this user
            setGoals(response.documents);
        } catch (error) {
            console.error('Error fetching user goals:', error);
        }
    };

    fetchUserGoals();
}, []);

    const handleSave = async () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }
    
        // Retrieve the current user
        const user = await account.get().catch(error => {
            console.error("User not authenticated:", error);
            alert("Please log in to save goals.");
            return null;
        });
        
        if (!user) return;
    
        // Fetch the Client document ID for the current user
        const clientResponse = await databases.listDocuments('Butterfly-Database', 'Client', [
            Query.equal('userid', user.$id)
        ]);
        
        if (clientResponse.documents.length === 0) {
            throw new Error("Client document not found for the current user.");
        }
    
        const clientDocument = clientResponse.documents[0];
        const clientId = clientDocument.$id;
    
        // Fetch the Psychotherapist document ID associated with this client
        const psychotherapistId = clientDocument.psychotherapist.$id;
        console.log("psychotherpistid",psychotherapistId)
        
        if (!psychotherapistId) {
            throw new Error("Psychotherapist data is missing for the current client.");
        }
    
        // Define the goal data
        const validMood = mood.toLowerCase();
        const initialProgress = 'todo';
    
        const startHour24 = startPeriod === 'PM' && startHour !== 12 ? startHour + 12 : startHour;
        const endHour24 = endPeriod === 'PM' && endHour !== 12 ? endHour + 12 : endHour;
    
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
    
        const newGoal: Omit<Goal, 'id'> = {
            mood: validMood as Goal['mood'],
            activities,
            date: format(selectedDate, 'yyyy-MM-dd'),
            startTime: startTimeISO,
            endTime: endTimeISO,
            progress: initialProgress,
            clientId: clientId, // String field for direct access
            psychotherapistId: psychotherapistId,
            psychotherapist: '',
            client: '',
        };
    
        try {
            const response = await databases.createDocument('Butterfly-Database', 'Goals', 'unique()', newGoal);
            setGoals([...goals, { ...newGoal, id: response.$id }]);
            setShowModal(true);
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };
    

    // Function to handle progress change and update in the database
// Function to handle progress change and update in the database
const handleProgressChange = async (newProgress: Goal['progress'], goalId: string, goalIndex: number) => {
    try {
        if (!goalId) {
            console.error("Missing goalId for update.");
            return;
        }

        console.log(`Updating goal with ID: ${goalId} to progress: ${newProgress}`);

        // Update the progress in the Appwrite database
        await databases.updateDocument('Butterfly-Database', 'Goals', goalId, {
            progress: newProgress
        });

        // Update the local state to reflect the new progress
        const updatedGoals = goals.map((g, idx) =>
            idx === goalIndex ? { ...g, progress: newProgress } : g
        );
        setGoals(updatedGoals);

        console.log("Goal progress updated successfully in database.");
    } catch (error) {
        console.error("Error updating goal progress:", error);
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
                        <select
                            value={activities}
                            onChange={(e) => setActivities(e.target.value)}
                            className="border rounded-lg p-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            <option value="meditate">Meditate</option>
                            <option value="exercise">Exercise</option>
                            <option value="read">Read</option>
                            <option value="music">Music</option>
                            <option value="stroll">Stroll</option>
                            <option value="pet">Pet time</option>
                            <option value="arts">Arts</option>
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
                                    onChange={(e) => handleStartPeriodChange(e.target.value)}
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
                                    disabled={true}
                                >
                                    <option value={endHour}>{endHour}</option>
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
                                    disabled={true}
                                >
                                    <option value={endPeriod}>{endPeriod}</option>
                                </select>
                            </div>
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
                const goalId = goal.$id; // Use goal.$id as the document ID
                const currentTime = new Date().getTime();
                const goalEndTime = new Date(goal.endTime).getTime();

                // Check if the goal's end time has passed
                const isPastEndTime = currentTime > goalEndTime;

                // Determine the display progress
                const displayProgress = isPastEndTime ? 'missing' : goal.progress;

                return (
                    <li
                        key={goalId} // Ensure a unique key using `goal.$id`
                        className="p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center"
                    >
                        <div>
                            <p className="text-sm">
                                {goal.activities} for {goal.duration} minutes on {goal.date} (Mood: {goal.mood})
                            </p>
                            <p className="text-xs text-gray-500">Status: {displayProgress}</p>
                        </div>
                        {!isPastEndTime ? (
                            <select
                                value={goal.progress}
                                onChange={(e) => handleProgressChange(e.target.value as Goal['progress'], goalId, index)}
                                className="border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 transition-colors duration-200"
                                disabled={isPastEndTime}
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">Doing</option>
                                <option value="done">Done</option>
                            </select>
                        ) : (
                            <span className="text-red-500">Missing</span>
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
