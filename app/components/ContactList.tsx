'use client';
import { FC, useState } from 'react';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';

interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  imageUrl: string;
  time: string;
  isSession: boolean;
}

const contacts: Contact[] = [
  { id: 1, name: 'Mrs. Angelica Peralta', lastMessage: 'Your session is about to start in 5 minutes!', imageUrl: '/images/denzel.jpg', time: '9:00 AM', isSession: true },
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