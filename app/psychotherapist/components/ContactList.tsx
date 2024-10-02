'use client';
import { FC, useState } from 'react';
import Link from 'next/link';

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  imageUrl: string;
  time: string;
  isSession: boolean;
}

const contacts: Contact[] = [
  { id: 1, name: 'Denzel White', lastMessage: 'Your session is about to start in 5 minutes!', imageUrl: '/images/denzel.jpg', time: '10:00 AM', isSession: true },
  { id: 2, name: 'Gwen Stacey', lastMessage: 'You: How are you?', imageUrl: '/images/gwen.jpg', time: '1:00 PM', isSession: false },
  { id: 3, name: 'Robert Junior', lastMessage: 'I’m doing good', imageUrl: '/images/robert.jpg', time: '1:00 PM', isSession: false },
  { id: 4, name: 'Hev Abigail', lastMessage: 'You: How are you?', imageUrl: '/images/hev.jpg', time: '2:00 PM', isSession: false },
  { id: 5, name: 'Thomas Edison', lastMessage: 'You: How are you?', imageUrl: '/images/thomas.jpg', time: '4:00 PM', isSession: false },
  { id: 6, name: 'Sabrina Karpintero', lastMessage: 'You: Taste him too?', imageUrl: '/images/sabrina.jpg', time: '4:00 PM', isSession: false },
];

const ContactList: FC = () => {
  const [selectedContact, setSelectedContact] = useState<number | null>(null);

  return (
    <div className="w-1/4 bg-white p-4 border-r border-gray-200">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-full border border-gray-300"
        />
      </div>

      <div className="space-y-2">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
              selectedContact === contact.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedContact(contact.id)}
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

export default ContactList;
