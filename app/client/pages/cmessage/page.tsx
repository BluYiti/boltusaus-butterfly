'use client';
import { FC, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Added FaTimes for the clear (X) button
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';

// Interface for Contact
interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  imageUrl: string;
  time: string;
  isSession: boolean;
}

// Interface for Message
interface Message {
  id: number;
  text: string;
  sender: string;
  time: string;
}

// Static data for contacts
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

// Static messages based on contacts (simulate fetching different messages for each contact)
const chatMessages: { [key: number]: Message[] } = {
  1: [],
};

// Contact List component with search, clear functionality, and no contacts message
const ContactList: FC<{ onContactClick: (id: number) => void; selectedContact: number | null }> = ({
  onContactClick,
  selectedContact,
}) => {
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  const handleClearSearch = () => {
    setSearchTerm(''); // Clears the search input
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/4 bg-gray-200 p-4 border-r border-gray-200">
      <h1 className="text-xl font-bold text-gray-800">Chats</h1>
      {/* Search Bar */}
      <div className="relative flex items-center bg-gray-100 p-2 rounded-full mb-4">
        <FaSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="flex-grow bg-transparent p-2 outline-none text-sm"
        />
        {searchTerm && (
          <button onClick={handleClearSearch} className="absolute right-2 text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        )}
      </div>

      {/* No Contacts Found Message */}
      {filteredContacts.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No contacts found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                selectedContact === contact.id ? 'bg-gray-300' : 'hover:bg-gray-100'
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
      )}
    </div>
  );
};

// Chat Box component (unchanged)
const ChatBox: FC<{ selectedContact: Contact | null; messages: Message[]; onSendMessage: (text: string) => void }> = ({
  selectedContact,
  messages,
  onSendMessage,
}) => {
  const [messageInput, setMessageInput] = useState(''); // Message input state

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput(''); // Clear the input after sending
    }
  };

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
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
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

// Main Chat Page component (unchanged)
const ChatPage: FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [messagesByContact, setMessagesByContact] = useState(chatMessages); // State to manage messages
  const [userName, setUserName] = useState('Client'); // Define userName, can be dynamic

  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) || null;

  // Fetch messages based on selected contact
  const messages = selectedContact ? messagesByContact[selectedContactId] || [] : [];

  // Function to handle sending a new message
  const handleSendMessage = (text: string) => {
    if (selectedContactId === null) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'client',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesByContact((prevMessages) => ({
      ...prevMessages,
      [selectedContactId]: [...(prevMessages[selectedContactId] || []), newMessage],
    }));
  };

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-between">
          {/* Top Section with User Info and Header */}
          <div className="bg-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="flex items-center space-x-3">
            </div>
          </div>

          {/* Chat Layout */}
          <div className="flex h-screen">
            <ContactList onContactClick={setSelectedContactId} selectedContact={selectedContactId} />
            <ChatBox selectedContact={selectedContact} messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
