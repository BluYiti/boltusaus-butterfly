'use client';
import { FC } from 'react';
import Image from 'next/image';

interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
}

const messages: Message[] = [
  { id: 1, text: 'How has your day been?', sender: 'therapist', time: '10:05 AM' },
];

const ChatBox: FC = () => {
  return (
    <div className="w-3/4 p-6 flex flex-col justify-between">
      {/* Chat Header */}
      <div className="flex items-center mb-4">
        <Image
          src="/images/denzel.jpg"
          alt="Denzel White"
          width={48}  // width in pixels
          height={48} // height in pixels
          className="rounded-full mr-4"
        />
        <h2 className="text-xl font-bold">Denzel White</h2>
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
              message.sender === 'client' ? 'bg-blue-100' : 'bg-gray-100'
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
    </div>
  );
};

export default ChatBox;