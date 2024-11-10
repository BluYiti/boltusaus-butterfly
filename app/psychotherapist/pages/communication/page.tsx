'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { FaVideo, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import Layout from '@/components/Sidebar/Layout';
import VideoCall from '@/components/VideoCall';
import items from '@/psychotherapist/data/Links';
import { Client, Databases, Account, Query, Storage, ID } from 'appwrite';


// Define interfaces
interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  imageUrl: string;
  time: string;
  isSession: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
}

interface Conversation {
  id: string;
  clientId: string;
  psychotherapistId: string;
}

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

// Contact List component
const ContactList: FC<{ onContactClick: (id: string) => void; selectedContact: string | null; contacts: Contact[] }> = ({ onContactClick, selectedContact, contacts }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r border-gray-200">
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
const ChatBox: FC<{ selectedContact: Contact | null; messages: Message[]; onSendMessage: (text: string) => void; onStartCall: () => void }> = ({ selectedContact, messages, onSendMessage, onStartCall }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    scrollToBottom();
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
          <img
            src={selectedContact.imageUrl}
            alt={selectedContact.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <h2 className="text-xl font-bold">{selectedContact.name}</h2>
        </div>
        <button
          onClick={onStartCall}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FaVideo />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`group relative ${message.sender === 'psychotherapist' ? 'justify-end' : 'justify-start'} flex`}>
            <div
              className={`max-w-xs p-4 rounded-lg shadow ${
                message.sender === 'psychotherapist' ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <p>{message.text}</p>
              <span className="block text-xs text-gray-400">{message.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center mt-4 border-t pt-4">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-full"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

// Main Communication Page component with Layout
const Communication: FC = () => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const selectedContact = contacts.find(contact => contact.id === selectedContactId) || null;

  const handleStartCall = () => {
    setIsVideoCallActive(true);
  };

  const handleEndCall = () => {
    setIsVideoCallActive(false);
  };

  useEffect(() => {
    const fetchPsychotherapistData = async () => {
      try {
        const loggedInUser = await account.get();
        setLoggedInUser(loggedInUser);
  
        // Get the psychotherapist document
        const psychotherapistResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Psychotherapist',
          [Query.equal('userId', loggedInUser.$id)]
        );
  
        if (psychotherapistResponse.documents.length === 0) {
          throw new Error('No psychotherapist found for the logged-in user');
        }
  
        const psychotherapistDocumentId = psychotherapistResponse.documents[0].$id;
  
        // Get the clients related to the psychotherapist
        const clientResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Client',
          [Query.equal('psychotherapist', psychotherapistDocumentId)]
        );
  
        const clientDataPromises = clientResponse.documents.map(async (doc: any) => {
          let profilePicUrl = '/default-avatar.jpg';
          if (doc.idFile) {
            const imagePreview = storage.getFilePreview('Images', doc.idFile);
            profilePicUrl = imagePreview;
          }
  
          // Fetch the latest message for this client
          const conversationResponse = await databases.listDocuments(
            'Butterfly-Database',
            'Conversation',
            [
              Query.equal('clientId', doc.$id),
              Query.equal('psychotherapistId', psychotherapistDocumentId),
            ]
          );
  
          let lastMessage = 'No messages yet';
          let lastMessageTime = '';
  
          if (conversationResponse.documents.length > 0) {
            const conversationId = conversationResponse.documents[0].$id;
  
            // Fetch the latest message for the conversation
            const messageResponse = await databases.listDocuments(
              'Butterfly-Database',
              'Messages',
              [
                Query.equal('conversationId', conversationId),
                Query.orderDesc('dateTime'),  // Order messages by date in descending order
                Query.limit(1),  // Get only the latest message
              ]
            );
  
            if (messageResponse.documents.length > 0) {
              const latestMessage = messageResponse.documents[0];
              lastMessage = `${latestMessage.senderId === loggedInUser.$id ? 'You' : doc.firstname}: ${latestMessage.content}`;
              lastMessageTime = new Date(latestMessage.dateTime).toLocaleTimeString();
            }
          }
  
          return {
            id: doc.$id,
            name: `${doc.firstname} ${doc.lastname}`,
            lastMessage: lastMessage,
            imageUrl: profilePicUrl,
            time: lastMessageTime || new Date().toLocaleTimeString(),
            isSession: false
          };
        });
  
        const clientData = await Promise.all(clientDataPromises);
        setContacts(clientData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchPsychotherapistData();
  }, []);
  

  const fetchOrCreateConversation = async (contactId: string): Promise<string | null> => {
    try {
      // Fetch the logged-in psychotherapist
      const psychotherapistResponse = await databases.listDocuments(
        'Butterfly-Database',
        'Psychotherapist',
        [Query.equal('userId', loggedInUser.$id)]
      );
  
      if (psychotherapistResponse.documents.length === 0) {
        throw new Error('No psychotherapist found for the logged-in user');
      }
  
      const psychotherapistDocumentId = psychotherapistResponse.documents[0].$id;
  
      // Check if a conversation already exists using the new `clientId` and `psychotherapistId` fields
      const response = await databases.listDocuments(
        'Butterfly-Database',
        'Conversation',
        [
          Query.equal('clientId', contactId),
          Query.equal('psychotherapistId', psychotherapistDocumentId)
        ]
      );
  
      if (response.documents.length > 0) {
        // Use the existing conversation
        const existingConversation = response.documents[0];
        setConversationId(existingConversation.$id);
        return existingConversation.$id;
      } else {
        // Create a new conversation if none exists
        const newConversation = await databases.createDocument(
          'Butterfly-Database',
          'Conversation',
          ID.unique(), // Generate a unique ID
          {
            clientId: contactId,
            psychotherapistId: psychotherapistDocumentId,
            startDate: new Date().toISOString(),
            endDate: null,
          }
        );
        setConversationId(newConversation.$id);
        return newConversation.$id;
      }
    } catch (error) {
      console.error('Error in fetchOrCreateConversation:', error);
      return null;
    }
  };
  
 // Updated handleSendMessage to ensure only messages are sent
const handleSendMessage = async (text: string) => {
  if (!selectedContactId) return;

  try {
    const user = await account.get();

    const psychotherapistResponse = await databases.listDocuments(
      'Butterfly-Database',
      'Psychotherapist',
      [Query.equal('userId', user.$id)]
    );

    if (psychotherapistResponse.documents.length === 0) {
      console.error("Psychotherapist not found.");
      return;
    }

    const psychotherapistDocumentId = psychotherapistResponse.documents[0].$id;

    const conversationIdToUse = conversationId || await fetchOrCreateConversation(selectedContactId);

    if (!conversationIdToUse) {
      console.error('Failed to create or retrieve conversation.');
      return;
    }


    const messagePayload = {
      senderId: psychotherapistDocumentId, // Use psychotherapist document ID as senderId
      receiverId: selectedContactId,
      content: text,
      conversationId: conversationIdToUse,
      dateTime: new Date().toISOString(),
      status: 'sent',
    };

    const uniqueMessageId = ID.unique();

    const newMessage = await databases.createDocument(
      'Butterfly-Database',
      'Messages',
      uniqueMessageId,
      messagePayload
    );

    const message: Message = {
      id: newMessage.$id,
      text: messagePayload.content,
      sender: messagePayload.senderId,
      time: new Date(messagePayload.dateTime).toLocaleTimeString(),
    };

    setMessages((prevMessages) => 
      prevMessages.map((msg) =>
        msg.id === uniqueMessageId
          ? { ...msg, id: newMessage.$id }
          : msg
      )
    );

    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContactId
          ? { ...contact, lastMessage: `You: ${text}`, time: new Date().toLocaleTimeString() }
          : contact
      )
    );
  } catch (error) {
    console.error('Error sending message:', error);
  }
  
  
};

  

useEffect(() => {
  let fetchInterval: NodeJS.Timeout | null = null;

  const fetchMessages = async () => {
    if (selectedContactId && conversationId) {
      try {

        const psychotherapistResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Psychotherapist',
          [Query.equal('userId', loggedInUser?.$id)]
        );

        if (psychotherapistResponse.documents.length === 0) {
          console.error("Psychotherapist not found.");
          return;
        }

        const psychotherapistDocumentId = psychotherapistResponse.documents[0].$id;

        const response = await databases.listDocuments(
          'Butterfly-Database',
          'Messages',
          [Query.equal('conversationId', conversationId), Query.orderAsc('dateTime')]
        );

        const filteredMessages = response.documents.filter((msg) => {
          return (
            (msg.senderId === selectedContactId && msg.receiverId === psychotherapistDocumentId) ||
            (msg.senderId === psychotherapistDocumentId && msg.receiverId === selectedContactId)
          );
        });

        const messageData = filteredMessages.map((msg) => ({
          id: msg.$id,
          text: msg.content,
          sender: msg.senderId === psychotherapistDocumentId ? 'psychotherapist' : 'client',
          time: new Date(msg.dateTime).toLocaleTimeString(),
        }));

        setMessages(messageData);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    }
  };

  fetchMessages();

  // Set up interval to auto-refresh messages every 3 seconds
  fetchInterval = setInterval(fetchMessages, 3000);

  // Clear interval when component unmounts or when the conversation changes
  return () => {
    if (fetchInterval) {
      clearInterval(fetchInterval);
    }
  };
}, [selectedContactId, conversationId, loggedInUser?.$id]);






return (
  <Layout sidebarTitle="Butterfly" sidebarItems={items}>
    <div className="flex h-screen bg-blue-50">
      {isVideoCallActive ? (
        <VideoCall onEndCall={handleEndCall} />
      ) : (
        <>
          <ContactList
            onContactClick={(id) => {
              setSelectedContactId(id);
              fetchOrCreateConversation(id);
            }}
            selectedContact={selectedContactId}
            contacts={contacts}
          />
          <ChatBox
            selectedContact={selectedContact}
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartCall={handleStartCall}
          />
        </>
      )}
    </div>
  </Layout>
);
};

export default Communication;
