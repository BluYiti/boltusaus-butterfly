'use client';

import { FC, useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import Layout from '@/components/Sidebar/Layout';
import items from '@/psychotherapist/data/Links';
import { Query, ID } from 'appwrite';
import Image from 'next/image';
import { account, databases, storage } from '@/appwrite';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import { checkClientLink } from '@/psychotherapist/hooks/checkClientLink';
import { setNewLink } from '@/psychotherapist/hooks/setNewLink';
import { fetchPsychoId } from '@/hooks/userService';


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

// Contact List component
const ContactList: FC<{ onContactClick: (id: string) => void; selectedContact: string | null; contacts: Contact[] }> = ({ onContactClick, selectedContact, contacts }) => {
  return (
    <div className="bg-gray-100 border-gray-200 overflow-x-auto">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 bg-white z-10 shadow">
        <div className="flex items-center bg-white p-2 rounded-lg">
          <FaSearch className="text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow bg-transparent p-2 outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                selectedContact === contact.id ? 'bg-blue-100' : 'overflow-hidden hover:bg-gray-100'
              }`}
              onClick={() => onContactClick(contact.id)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={contact.imageUrl}
                  alt={contact.name}
                  width={48}  // 12 * 4 = 48px width
                  height={48} // 12 * 4 = 48px height
                  className="object-cover"
                  unoptimized
                />
              </div>
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
const ChatBox: FC<{
  selectedContact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}> = ({ selectedContact, messages, onSendMessage, onBack }) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [psychoId, setPsychoId] = useState<string | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [meetLink, setMeetLink] = useState('https://meet.google.com/landing');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);

        const psychoId = await fetchPsychoId(userData.$id);
        setPsychoId(psychoId);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const goToMeet = () => {
    if (typeof window !== 'undefined') {
      window.open(meetLink, '_blank');
    }
  };

  const handleEditMeetLink = async () => {
    const newLink = prompt(
      `Enter Google Meet link for ${selectedContact?.name} and ${psychoId}:`,
      meetLink
    );

    if (newLink) {
      await setNewLink(selectedContact?.id || '', psychoId || '', newLink);
      setMeetLink(newLink);
    }
  };

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!selectedContact) return;
  
    let isMounted = true;
  
    const fetchMeetLink = async () => {
      try {
        const clientId = selectedContact.id;
        const response = await databases.listDocuments('Butterfly-Database', 'MeetLink', [
          Query.equal('client', clientId) // Querying where the 'client' attribute matches clientId
        ]);
  
        if (isMounted && response.documents.length > 0) {
          setMeetLink(response.documents[0].link); // Assuming 'link' is the field storing the Meet link
        }
      } catch (error) {
        console.error('Failed to fetch meet link:', error);
      }
    };
  
    fetchMeetLink();
  
    return () => {
      isMounted = false;
    };
  }, [selectedContact]);
  

  if (!selectedContact) {
    return (
      <div className="w-3/4 p-6 flex items-center justify-center">
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 flex flex-col justify-between">
      <div className="flex items-center justify-start w-full mb-3 top-0">
        <div className="mr-3">
          <button
            onClick={onBack}
            className="text-white hover:bg-blue-200 hover:text-black bg-blue-400 rounded-xl p-2"
          >
            Back
          </button>
        </div>

        <div className="flex-1 flex justify-start items-center">
          <Image
            src={selectedContact.imageUrl}
            alt={selectedContact.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover aspect-square mr-4"
          />
          <h2 className="text-xs md:text-xl font-bold">{selectedContact.name}</h2>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-4">
          <button
            onClick={toggleDropdown}
            className="p-2 bg-blue-200 text-white rounded-full hover:bg-blue-400"
            aria-label="Start Video Call"
          >
            <Image src="/images/meet-logo.png" alt="Google Meet" width={30} height={30} className="rounded-full" />
          </button>
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute mt-32 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <button
                onClick={handleEditMeetLink}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Edit Meet Link
              </button>
              <button
                onClick={goToMeet}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Go to Meet Link
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`group relative ${
              message.sender === 'psychotherapist' ? 'justify-end' : 'justify-start'
            } flex`}
          >
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

      <div className="flex flex-wrap items-center mt-4 border-t pt-4 px-4 sm:px-6">
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
          className="flex-grow p-2 border border-gray-300 rounded-full text-sm sm:text-base"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
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

  const handleContactClick = (id: string) => {
    setSelectedContactId(id);
    fetchOrCreateConversation(id);
  };

  const handleBackToContacts = () => {
    setSelectedContactId(null);
  };

  const selectedContact = contacts.find(contact => contact.id === selectedContactId) || null;

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
      {selectedContact ? (
        // Show ChatBox when a contact is selected
        <ChatBox
          selectedContact={selectedContact}
          messages={messages}
          onSendMessage={handleSendMessage}
          onBack={handleBackToContacts} // Pass back function to ChatBox
        />
      ) : (
        // Show ContactList when no contact is selected
        <div className="w-full h-full">
          <ContactList
            onContactClick={handleContactClick}
            selectedContact={selectedContactId}
            contacts={contacts}
          />
        </div>
      )}
      </div>
    </Layout>
  );
};

export default Communication;