'use client';

import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Layout from '@/components/Sidebar/Layout';
import VideoCall from '@/components/VideoCall';
import items from '@/psychotherapist/data/Links';
import { Query, ID } from 'appwrite';
import Image from 'next/image';
import { account, databases, storage } from '@/appwrite';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';

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

const ContactList: FC<{
  onContactClick: (id: string) => void;
  selectedContact: string | null;
  contacts: Contact[];
}> = ({ onContactClick, selectedContact, contacts }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating Button when Minimized */}
      {isMinimized && (
        <button
          className="fixed top-4 left-4 z-20 p-3 bg-white shadow-lg rounded-full hover:bg-gray-200 transition md:hidden"
          onClick={() => setIsMinimized(false)}
        >
          <FaChevronRight />
        </button>
      )}

      <div
        className={`bg-gray-100 border-gray-200 transition-all duration-300 overflow-hidden h-full flex flex-col 
        ${isMinimized ? "w-0 hidden" : "w-full sm:w-1/3 md:w-1/4 lg:w-1/5"}`}
      >
        {/* Sticky Search Bar */}
        <div className="sticky top-0 bg-white z-10 shadow flex items-center p-2">
          <div className="flex items-center bg-white p-2 rounded-lg flex-grow">
            <FaSearch className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search"
              className="flex-grow bg-transparent p-2 outline-none text-sm"
            />
          </div>
          {/* Minimize Button (Mobile) */}
          <button
            className="ml-2 p-2 rounded-full hover:bg-gray-200 transition md:hidden"
            onClick={() => setIsMinimized(true)}
          >
            <FaChevronLeft />
          </button>
        </div>

        {/* Contact List */}
        <div className="space-y-2 overflow-y-auto flex-grow">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition 
              ${selectedContact === contact.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
              onClick={() => onContactClick(contact.id)}
            >
              <Image
                src={contact.imageUrl}
                alt={contact.name}
                width={48}
                height={48}
                className="rounded-full mr-4"
                unoptimized
              />
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className={`text-sm ${contact.isSession ? "text-blue-500" : "text-gray-500"}`}>
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const ChatBox: FC<{ selectedContact: Contact | null; messages: Message[]; onSendMessage: (text: string) => void; onStartCall: () => void }> = ({selectedContact, messages, onSendMessage, onStartCall,}) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedContact) {
    return (
      <div className="w-full sm:w-2/3 md:w-3/4 p-6 flex items-center justify-center">
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="w-full sm:w-2/3 md:w-3/4 p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center">
          <Image
            src={selectedContact.imageUrl}
            alt={selectedContact.name}
            width={48}
            height={48}
            className="rounded-full mr-4"
          />
          <h2 className="text-xl font-bold">{selectedContact.name}</h2>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4 p-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'psychotherapist' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs p-3 rounded-lg shadow ${message.sender === 'psychotherapist' ? 'bg-blue-100' : 'bg-gray-100'}`}
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
  const authLoading = useAuthCheck(['psychotherapist']);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [psychotherapistDocumentId, setPsychotherapistDocumentId] = useState<string | null>(null); // Store psychotherapist document ID
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  const selectedContact = contacts.find(contact => contact.id === selectedContactId) || null;

  const handleStartCall = async () => {
    if (!selectedContactId || !psychotherapistDocumentId) return;

    try {
      const callNotificationData = {
        isActive: true,
        callerId: psychotherapistDocumentId, // Use psychotherapist document ID here
        receiverId: selectedContactId, // ID of the client being called
        timestamp: new Date().toISOString(),
      };

      const existingNotificationResponse = await databases.listDocuments(
        'Butterfly-Database',
        'Call-Notification',
        [Query.equal('receiverId', selectedContactId)]
      );

      if (existingNotificationResponse.documents.length > 0) {
        await databases.updateDocument(
          'Butterfly-Database',
          'Call-Notification',
          existingNotificationResponse.documents[0].$id,
          callNotificationData
        );
      } else {
        await databases.createDocument(
          'Butterfly-Database',
          'Call-Notification',
          ID.unique(),
          callNotificationData
        );
      }

      setIsVideoCallActive(true);
    } catch (error) {
      console.error('Failed to notify client of call:', error);
    }
  };

  useEffect(() => {
    const fetchPsychotherapistData = async () => {
      try {
        const loggedInUser = await account.get();
        const userId = loggedInUser.$id;

        const psychotherapistResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Psychotherapist',
          [Query.equal('userId', userId)]
        );

        if (psychotherapistResponse.documents.length === 0) {
          throw new Error('No psychotherapist found for the logged-in user');
        }

        const psychotherapistDocumentId = psychotherapistResponse.documents[0].$id;
        setPsychotherapistDocumentId(psychotherapistDocumentId); // Store psychotherapist document ID

        const clientResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Client',
          [Query.equal('psychotherapist', psychotherapistDocumentId)]
        );

        const clientDataPromises = clientResponse.documents.map(async (doc) => {
          let profilePicUrl = '/default-avatar.jpg';
          if (doc.profilepic) {
            const imagePreview = storage.getFilePreview('Images', doc.profilepic);
            profilePicUrl = imagePreview;
          }else{
            profilePicUrl = '/images/default-profile.png';
          }

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

            const messageResponse = await databases.listDocuments(
              'Butterfly-Database',
              'Messages',
              [
                Query.equal('conversationId', conversationId),
                Query.orderDesc('dateTime'),
                Query.limit(1),
              ]
            );

            if (messageResponse.documents.length > 0) {
              const latestMessage = messageResponse.documents[0];
              lastMessage = `${latestMessage.senderId === userId ? 'You' : doc.firstname}: ${latestMessage.content}`;
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

  const fetchOrCreateConversation = useCallback(
    async (contactId: string): Promise<string | null> => {
      if (!psychotherapistDocumentId) return null;
      try {
        const response = await databases.listDocuments(
          'Butterfly-Database',
          'Conversation',
          [
            Query.equal('clientId', contactId),
            Query.equal('psychotherapistId', psychotherapistDocumentId),
          ]
        );
  
        if (response.documents.length > 0) {
          const existingConversation = response.documents[0];
          setConversationId(existingConversation.$id);
          return existingConversation.$id;
        }
  
        const newConversation = await databases.createDocument(
          'Butterfly-Database',
          'Conversation',
          ID.unique(),
          {
            clientId: contactId,
            psychotherapistId: psychotherapistDocumentId,
            startDate: new Date().toISOString(),
          }
        );
        setConversationId(newConversation.$id);
        return newConversation.$id;
      } catch (error) {
        console.error('Error in fetchOrCreateConversation:', error);
        return null;
      }
    },
    [psychotherapistDocumentId]
  );  

  const handleSendMessage = async (text: string) => {
    if (!selectedContactId) return;

    try {
      const conversationIdToUse = conversationId || await fetchOrCreateConversation(selectedContactId);

      if (!conversationIdToUse || !psychotherapistDocumentId) {
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

      const newMessage = await databases.createDocument(
        'Butterfly-Database',
        'Messages',
        ID.unique(),
        messagePayload
      );

      const message: Message = {
        id: newMessage.$id,
        text: messagePayload.content,
        sender: 'psychotherapist',
        time: new Date(messagePayload.dateTime).toLocaleTimeString(),
      };

      setMessages((prevMessages) => [...prevMessages, message]);

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
      if (selectedContactId && conversationId && psychotherapistDocumentId) {
        try {
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

    fetchInterval = setInterval(fetchMessages, 3000);

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [selectedContactId, conversationId, psychotherapistDocumentId]);

  if (authLoading) return <LoadingScreen />;

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="flex h-screen bg-blue-50">
        {isVideoCallActive && psychotherapistDocumentId && selectedContactId ? (
          <VideoCall
            onEndCall={() => {
              setIsVideoCallActive(false);
            }} 
            callerId={psychotherapistDocumentId} // Use the psychotherapist document ID as the caller ID
            receiverId={selectedContactId}
          />
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
