'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Assuming you're using Next.js for navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

// Define the type for messages
interface Message {
  text: string;
  isClient: boolean;
}

// Define the type for a patient
interface Patient {
  id: number;
  name: string;
  avatar: string;
  chatHistory: Message[];
}

// Main Chat Component
const Chat: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // Track whether the component is mounted
  const router = useRouter(); // Use router for navigation

  // Ensure that router is only accessed when the component is mounted
  useEffect(() => {
    setIsMounted(true); // Set to true when component is mounted
  }, []);

  // Define a list of patients
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "Denzel White",
      avatar: "https://via.placeholder.com/50",
      chatHistory: [
        { text: "How has your day been?", isClient: false },
        { text: "It has been better", isClient: true },
        { text: "What happened today?", isClient: false },
        { text: "I guess things happened in an unfortunate way", isClient: true },
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "https://via.placeholder.com/50",
      chatHistory: [
        { text: "How are you feeling today?", isClient: false },
        { text: "I'm feeling anxious", isClient: true },
      ],
    },
    {
      id: 3,
      name: "John Doe",
      avatar: "https://via.placeholder.com/50",
      chatHistory: [
        { text: "Have you had your session?", isClient: false },
        { text: "Yes, it went well.", isClient: true },
      ],
    },
  ]);

  // Track selected patient and message input
  const [selectedPatientId, setSelectedPatientId] = useState<number>(patients[0].id);
  const [newMessage, setNewMessage] = useState<string>("");

  // Find the currently selected patient
  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId);

  // Function to send a new message
  const sendMessage = () => {
    if (newMessage.trim() && selectedPatient) {
      // Create a new chat history with the new message
      const updatedChatHistory = [...selectedPatient.chatHistory, { text: newMessage, isClient: false }];

      // Update the patient object with the new chat history
      const updatedPatients = patients.map((patient) =>
        patient.id === selectedPatientId ? { ...patient, chatHistory: updatedChatHistory } : patient
      );

      // Set the updated patients in state
      setPatients(updatedPatients);
      setNewMessage("");
    }
  };

  // Function to handle video call click and navigate to the video call page
  const handleVideoCallClick = (patientName: string) => {
    if (isMounted && router) {
      const formattedName = patientName.toLowerCase().replace(/ /g, '-'); // Convert name to URL-friendly format
      router.push(`./pvideocall/`); // Navigate to the pvideocall route
    }
  };

  // Function to simulate a back button
  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back(); // Ensure we have access to window object for navigation
    }
  };

  if (!isMounted) {
    return null; // Don't render until the component is mounted
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      {/* Back Button Outside */}
      <div className="mb-4">
        <button onClick={goBack} className="text-2xl bg-gray-300 rounded-md px-4 py-2">
          &larr;
        </button>
      </div>

      <div className="flex flex-1">
        {/* Patient List */}
        <div className="w-1/4 bg-white rounded-md shadow-lg p-6 mr-4">
          <h2 className="text-xl font-bold mb-4">Patients</h2>
          <ul>
            {patients.map((patient) => (
              <li
                key={patient.id}
                className={`flex items-center p-2 mb-2 cursor-pointer rounded-md ${selectedPatientId === patient.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <img
                  src={patient.avatar}
                  alt={patient.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span>{patient.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Box */}
        <div className="w-3/4 bg-white rounded-md shadow-lg p-6">
          {selectedPatient && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={selectedPatient.avatar}
                    alt={selectedPatient.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />

                  {/* Name and Icon */}
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold mr-2">{selectedPatient.name}</h2>
                    <button
                      onClick={() => handleVideoCallClick(selectedPatient.name)}
                      className="text-xl bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700"
                      aria-label="Start Video Call"
                    >
                      <FontAwesomeIcon icon={faVideo} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex flex-col space-y-4 mb-6">
                {selectedPatient.chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${message.isClient ? 'flex-row' : 'flex-row-reverse'} space-x-4`}
                  >
                    <img
                      src={`https://via.placeholder.com/50?text=${message.isClient ? 'C' : 'P'}`}
                      alt={message.isClient ? 'Client' : 'Psychotherapist'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`p-3 rounded-lg ${message.isClient ? 'bg-gray-100' : 'bg-blue-200'} max-w-xs`}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Section */}
              <div className="flex items-center mt-4 p-2 border rounded-full shadow-sm">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow bg-transparent outline-none px-4"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                />
                <button onClick={sendMessage} className="text-xl px-4">
                  &#9654; {/* Send icon */}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
