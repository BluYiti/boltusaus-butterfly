"use client"; // Add this line at the very top

import React, { useState } from "react";

interface Mood {
  label: string;
  description: string;
  color: string;
  feedback: string; // Add feedback property for dynamic messages
}

const moods: Mood[] = [
  {
    label: "Joyful",
    description: "I feel satisfied and joyful.",
    color: "bg-yellow-400",
    feedback: "You're doing great! Follow your dreams and have a good day.",
  },
  {
    label: "Sadness",
    description: "There is heaviness in the chest.",
    color: "bg-blue-500",
    feedback: "You're feeling a bit lonely. Try doing something fun and relaxing to brighten your day.",
  },
  {
    label: "Angry",
    description: "I am stressed and tired.",
    color: "bg-red-500",
    feedback: "You're stressed, but stay positive! This day shall pass.",
  },
  {
    label: "Others",
    description: "What are you feeling?",
    color: "bg-green-500",
    feedback: "", // Will dynamically update based on custom mood
  },
];

const MoodSelection: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [customMood, setCustomMood] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false); // New state to track if the mood is confirmed
  const [feedback, setFeedback] = useState<string>("");

  const handleBack = () => {
    console.log("Back button clicked");
    setConfirmed(false); // Reset confirmation state if going back
  };

  const handleConfirm = () => {
    const mood = moods.find((m) => m.label === selectedMood);
    let moodFeedback = mood?.feedback || "";
    if (selectedMood === "Others") {
      moodFeedback = customMood ? `You're feeling ${customMood}. Make sure to have a great day and don't forget to do something exciting to ease that negativity you're feeling.` : "Please enter your custom mood.";
    }

    setFeedback(moodFeedback);
    setConfirmed(true); // Set confirmed to true after mood selection
  };

  return (
    <div className="relative text-black flex flex-col items-center justify-center min-h-screen bg-blue-50 p-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700"
      >
        Back
      </button>

      {/* Mood Feedback Section */}
      {confirmed ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-center p-10">
            <img src="/path-to-happy-emoji.png" alt="Mood Emoji" className="w-40 h-40" />
            <h2 className="text-3xl font-semibold mt-4">You feel {selectedMood === "Others" ? customMood : selectedMood}</h2>
            <p className="text-lg mt-2 text-gray-600">{feedback}</p>
          </div>
          <button
            onClick={() => setConfirmed(false)}
            className="mt-6 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      ) : (
        // Mood Selection Section
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-semibold text-center mb-8">
            How are <span className="font-bold">you</span> today? <span className="text-gray-400">5/5</span>
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.label)}
                className={`p-6 rounded-xl shadow-lg ${selectedMood === mood.label ? "ring-4 ring-gray-400" : ""} ${mood.color} text-white transition transform hover:scale-110`}
              >
                <h3 className="text-xl font-bold">{mood.label}</h3>
                <p className="text-base mt-2">
                  {mood.label === "Others" ? (
                    <input
                      type="text"
                      placeholder="Type here..."
                      className="w-full p-2 mt-4 bg-transparent border-b border-gray-300 text-white placeholder-white focus:outline-none"
                      value={customMood}
                      onChange={(e) => setCustomMood(e.target.value)}
                    />
                  ) : (
                    mood.description
                  )}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {!confirmed && (
        <button
          onClick={handleConfirm}
          className="absolute bottom-4 right-4 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Confirm
        </button>
      )}
    </div>
  );
};

export default MoodSelection;
