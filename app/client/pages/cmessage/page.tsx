'use client';
import { FC, useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import CallNotification from '@/components/CallNotification';
import Image from 'next/image';

// Interface Definitions
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

// Call State
interface Call {
  isActive: boolean;
  caller: Contact | null;
}

// Static Data
const contacts: Contact[] = [
  {
    id: 1,
    name: 'Mrs. Angelica Peralta',
    lastMessage: '',
    imageUrl: '/images/denzel.jpg',
    time: '9:00 AM',
    isSession: true,
  },
];

const chatMessages: { [key: number]: Message[] } = {
  1: [],
};

// Contact List Component
const ContactList: FC<{ onContactClick: (id: number) => void; selectedContact: number | null }> = ({
  onContactClick,
  selectedContact,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearSearch = () => setSearchTerm('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/4 bg-gray-200 p-4 border-r border-gray-200">
      <h1 className="text-xl font-bold text-gray-800">Chats</h1>
      <div className="relative flex items-center bg-gray-100 p-2 rounded-full mb-4">
        <FaSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="flex-grow bg-transparent p-2 outline-none text-sm"
        />
        {searchTerm && (
          <button onClick={handleClearSearch} className="absolute right-2 text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        )}
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No contacts found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                selectedContact === contact.id ? 'bg-gray-300' : 'hover:bg-gray-100'
              }`}
              onClick={() => onContactClick(contact.id)}
            >
              <Image
                src={contact.imageUrl}
                alt={contact.name}
                width={48}
                height={48}
                className="rounded-full mr-4"
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
      )}
    </div>
  );
};

// Chat Box Component
  // Chat Box Component
const ChatBox: FC<{ selectedContact: Contact | null; messages: Message[]; onSendMessage: (text: string) => void }> = ({
  selectedContact,
  messages,
  onSendMessage,
}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll when messages change
  }, [messages]);

  if (!selectedContact) {
    return (
      <div className="w-3/4 p-6 flex items-center justify-center">
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="w-3/4 p-6 flex flex-col justify-between">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <Image
            src={selectedContact.imageUrl}
            alt={selectedContact.name}
            width={48}  // Equivalent to w-12 (12px * 4)
            height={48} // Equivalent to h-12 (12px * 4)
            className="rounded-full mr-4"
          />
          <h2 className="text-xl font-bold">{selectedContact.name}</h2>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-4 rounded-lg shadow ${message.sender === 'client' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <p>{message.text}</p>
              <span className="block text-xs text-gray-400">{message.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Empty div to act as scroll target */}
      </div>

      <div className="flex items-center mt-4 border-t pt-4">
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSendMessage();
              setMessageInput(''); // Clear input after sending
            }
          }}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-full"
        />

        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-400 text-white px-4 py-2 rounded-full hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};


// Main Chat Page Component
const ChatPage: FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [messagesByContact, setMessagesByContact] = useState(chatMessages);
  const [call, setCall] = useState<Call>({ isActive: false, caller: null });
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const selectedContact = contacts.find(contact => contact.id === selectedContactId) || null;
  const messages = selectedContact ? messagesByContact[selectedContactId] || [] : [];

  const handleSendMessage = (text: string) => {
    if (selectedContactId === null) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'client',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesByContact(prevMessages => ({
      ...prevMessages,
      [selectedContactId]: [...(prevMessages[selectedContactId] || []), newMessage],
    }));
  };

  const handleAcceptCall = () => {
    setCall({ isActive: false, caller: null }); // Hide call notification
    setIsVideoCallActive(true); // Start video call
  };

  useEffect(() => {
    if (isVideoCallActive && videoRef.current) {
      const startVideoCall = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          videoRef.current.srcObject = stream;
        } catch (err) {
          console.error('Error accessing media devices.', err);
        }
      };

      startVideoCall();

      // Copy the current ref to a local variable to avoid stale ref issues
      const currentVideoRef = videoRef.current;

      return () => {
        if (currentVideoRef && currentVideoRef.srcObject) {
          (currentVideoRef.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isVideoCallActive]);

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        {!isVideoCallActive ? (
          <div className="flex-grow flex flex-col justify-between">
            <div className="flex h-screen">
              <ContactList onContactClick={setSelectedContactId} selectedContact={selectedContactId} />
              <ChatBox selectedContact={selectedContact} messages={messages} onSendMessage={handleSendMessage} />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-screen border-8 border-gray-500"> {/* Full-size video call area */}
            <video ref={videoRef} className="rounded-lg w-full h-full object-cover" autoPlay></video>
          </div>
        )}

        {/* Call Notification */}
        {call.isActive && (
          <CallNotification
            caller={call.caller}
            onAccept={handleAcceptCall}
          />
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;
