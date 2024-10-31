'use client';

import { FC, useState } from 'react';
import { FaVideo, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Layout from '@/components/Sidebar/Layout';
import items from '@/psychotherapist/data/Links';

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  imageUrl: string;
  time: string;
  isSession: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
}

// Static data for contacts
const contacts: Contact[] = [
  { id: 1, name: 'Denzel White', lastMessage: 'Your session is about to start in 5 minutes!', imageUrl: '/images/denzel.jpg', time: '10:00 AM', isSession: true },
  { id: 2, name: 'Gwen Stacey', lastMessage: 'You: How are you?', imageUrl: '/images/gwen.jpg', time: '1:00 PM', isSession: false },
  { id: 3, name: 'Robert Junior', lastMessage: 'I’m doing good', imageUrl: '/images/robert.jpg', time: '1:00 PM', isSession: false },
  { id: 4, name: 'Hev Abigail', lastMessage: 'You: How are you?', imageUrl: '/images/hev.jpg', time: '2:00 PM', isSession: false },
  { id: 5, name: 'Thomas Edison', lastMessage: 'You: How are you?', imageUrl: '/images/thomas.jpg', time: '4:00 PM', isSession: false },
  { id: 6, name: 'Sabrina Karpintero', lastMessage: 'You: Taste him too?', imageUrl: '/images/sabrina.jpg', time: '4:00 PM', isSession: false },
];

// Static messages based on contacts (simulate fetching different messages for each contact)
const chatMessages = {
  1: [
    { id: 1, text: 'How has your day been?', sender: 'therapist', time: '10:05 AM' },
    { id: 2, text: 'It has been better', sender: 'client', time: '10:06 AM' },
    { id: 3, text: 'That’s nice to hear!', sender: 'therapist', time: '10:07 AM' },
    { id: 4, text: 'Have a nice day!', sender: 'client', time: '10:08 AM' },
  ],
  2: [
    { id: 1, text: 'Hi Gwen!', sender: 'therapist', time: '1:05 PM' },
    { id: 2, text: 'How are you?', sender: 'therapist', time: '1:06 PM' },
    { id: 3, text: 'I’m feeling better now, thank you!', sender: 'client', time: '1:08 PM' },
  ],
  // Additional messages for other contacts can be added in a similar fashion...
};

// Contact List component
const ContactList: FC<{ onContactClick: (id: number) => void; selectedContact: number | null }> = ({ onContactClick, selectedContact }) => {
  return (
    <div className="w-1/4 bg-gray-100   p-4 border-r border-gray-200">
      {/* Search Bar */}
      <div className="flex items-center bg-white p-2 rounded-full mb-4">
        <FaSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Search"
          className="flex-grow bg-transparent p-2 outline-none text-sm"
        />
      </div>

      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
              selectedContact === contact.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => onContactClick(contact.id)}
          >
            <img
              src={contact.imageUrl}
              alt={contact.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{contact.name}</span>
                <span className="text-xs text-gray-500">{contact.time}</span>
              </div>
              <p className={`text-sm ${contact.isSession ? 'text-blue-500' : 'text-gray-500'}`}>
                {contact.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chat Box component
const ChatBox: FC<{ selectedContact: Contact | null; messages: Message[] }> = ({ selectedContact, messages }) => {
  if (!selectedContact) {
    return (
      <div className="w-3/4 p-6 flex items-center justify-center">
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="w-3/4 p-6 flex flex-col justify-between">
      {/* Chat Header */}
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            src={selectedContact.imageUrl}
            alt={selectedContact.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <h2 className="text-xl font-bold">{selectedContact.name}</h2>
        </div>
        {/* Video Call Icon */}
        <Link href='/psychotherapist/pages/vcountdown'>
          <button className="p-2 bg-blue-500 text-white rounded-full">
            <FaVideo />
          </button>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'client' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`max-w-xs p-4 rounded-lg shadow ${
              message.sender === 'client' ? 'bg-blue-100' : 'bg-white'
            }`}>
              <p>{message.text}</p>
              <span className="block text-xs text-gray-400">{message.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center mt-4 border-t pt-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-full"
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full">
          Send
        </button>
      </div>

      {/* Session Notification */}
      {selectedContact.isSession && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          <p>Your session is about to start in 5 minutes! <a href="/psychotherapist/pages/vcountdown" className="text-blue-500 underline">Start Call</a></p>
        </div>
      )}
    </div>
  );
};

// Main Communication Page component with Layout
const Communication: FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const selectedContact = contacts.find(contact => contact.id === selectedContactId) || null;

  // Fetch messages based on selected contact
  const messages = selectedContact ? chatMessages[selectedContactId] || [] : [];

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="flex h-screen bg-blue-50">
        <ContactList onContactClick={setSelectedContactId} selectedContact={selectedContactId} />
        <ChatBox selectedContact={selectedContact} messages={messages} />
      </div>
    </Layout>
  );
};

export default Communication;
