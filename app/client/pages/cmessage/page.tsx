'use client';
import { FC, useState, useRef, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import { Client, Databases, Account, Query, ID } from 'appwrite';
import Image from 'next/image';
import LoadingScreen from '@/components/LoadingScreen';
import useAuthCheck from '@/auth/page';
import { fetchProfileImageUrl } from '@/hooks/userService';

// Interface Definitions
interface Psychotherapist {
  id: string;
  name: string;
  imageUrl: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  time: string;
}

interface Call {
  isActive: boolean;
  caller: Psychotherapist | null;
}

// Set up Appwrite Client
const client = new Client();
const databases = new Databases(client);
const account = new Account(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const ChatPage: FC = () => {
  const authLoading = useAuthCheck(['client']);
  const [psychotherapist, setPsychotherapist] = useState<Psychotherapist | null>(null);
  const [isPsychotherapistMissing, setIsPsychotherapistMissing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [clientDocumentId, setClientDocumentId] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState('https://meet.google.com/landing');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetching the Psychotherapist and Conversation ID
  useEffect(() => {
    const fetchPsychotherapist = async () => {
      try {
        const user = await account.get();
  
        const clientResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Client',
          [Query.equal('userid', user.$id)]
        );
  
        if (clientResponse.documents.length > 0) {
          const clientData = clientResponse.documents[0];
          setClientDocumentId(clientData.$id);
  
          if (clientData.psychotherapist) {
            const psychotherapistId = clientData.psychotherapist.$id || clientData.psychotherapist;
  
            if (psychotherapistId) {
              const psychotherapistResponse = await databases.getDocument('Butterfly-Database', 'Psychotherapist', psychotherapistId);
              console.log(psychotherapistResponse)

              const url = await fetchProfileImageUrl(psychotherapistResponse.profilepic);
  
              setPsychotherapist({
                id: psychotherapistResponse.$id,
                name: `${psychotherapistResponse.firstName || 'Unknown'} ${psychotherapistResponse.lastName || 'Name'}`,
                imageUrl: url || '/images/default-profile.png',
              });
  
              const conversationResponse = await databases.listDocuments(
                'Butterfly-Database',
                'Conversation',
                [Query.equal('clientId', clientData.$id), Query.equal('psychotherapistId', psychotherapistId)]
              );
  
              if (conversationResponse.documents.length > 0) {
                setConversationId(conversationResponse.documents[0].$id);
              } else {
                const newConversation = await databases.createDocument(
                  'Butterfly-Database',
                  'Conversation',
                  ID.unique(),
                  {
                    clientId: clientData.$id,
                    psychotherapistId: psychotherapistId,
                    startDate: new Date().toISOString(),
                    endDate: null,
                  }
                );
                setConversationId(newConversation.$id);
              }
            }
          } else {
            // If no psychotherapist is assigned, set isPsychotherapistMissing to true
            setIsPsychotherapistMissing(true);
          }
        }
      } catch (error) {
        console.error('Error fetching psychotherapist:', error);
      }
    };
  
    fetchPsychotherapist();
  }, []);

  useEffect(() => {
    let isMounted = true;
  
    const fetchMeetLink = async () => {
      try {
        const user = await account.get();
        const clientId = user.$id;
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
  }, [])
  

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (messageInput.trim() && psychotherapist && conversationId) {
      try {
        const user = await account.get();
        const clientResponse = await databases.listDocuments(
          'Butterfly-Database',
          'Client',
          [Query.equal('userid', user.$id)]
        );

        if (clientResponse.documents.length === 0) {
          console.error('Client not found.');
          return;
        }

        const clientDocumentId = clientResponse.documents[0].$id;

        const newMessage = {
          senderId: clientDocumentId,
          receiverId: psychotherapist.id,
          content: messageInput,
          dateTime: new Date().toISOString(),
          status: 'sent',
          conversationId: conversationId,
        };

        const response = await databases.createDocument(
          'Butterfly-Database',
          'Messages',
          ID.unique(),
          newMessage
        );

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: response.$id,
            text: newMessage.content,
            sender: 'client',
            time: new Date(newMessage.dateTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);

        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Polling for messages in the conversation
  useEffect(() => {
    let fetchInterval: NodeJS.Timeout | null = null;

    const fetchMessages = async () => {
      if (!conversationId || !psychotherapist) return;

      try {
        const response = await databases.listDocuments(
          'Butterfly-Database',
          'Messages',
          [Query.equal('conversationId', conversationId), Query.orderAsc('dateTime')]
        );

        const messageData = response.documents.map((msg) => ({
          id: msg.$id,
          text: msg.content,
          sender: msg.senderId === psychotherapist.id ? 'psychotherapist' : 'client',
          time: new Date(msg.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        setMessages(messageData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (conversationId && psychotherapist) {
      fetchMessages();
      fetchInterval = setInterval(fetchMessages, 3000);
    }

    return () => {
      if (fetchInterval) {
        clearInterval(fetchInterval);
      }
    };
  }, [psychotherapist, conversationId, psychotherapist?.id]);

  const goToMeet = () => {
    if (typeof window !== 'undefined') {
      window.open(meetLink, '_blank');
    }
  };

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (authLoading) return <LoadingScreen />;

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex h-screen">
            {psychotherapist ? (
              <div className="w-full p-6 flex flex-col justify-between">
                <div className="flex items-center mb-4 justify-between">
                  <div className="flex items-center">
                    <Image
                      src={psychotherapist.imageUrl}
                      alt={psychotherapist.name}
                      width={48} // Replace with appropriate width
                      height={48} // Replace with appropriate height
                      className="w-12 h-12 rounded-full mr-4"
                      unoptimized
                    />
                    <h2 className="text-xl font-bold">{psychotherapist.name}</h2>
                  </div>
                  <div className="flex-1 flex justify-end items-center space-x-4">
                    <button
                      onClick={goToMeet}
                      className="p-2 bg-blue-200 text-white rounded-full hover:bg-blue-400"
                      aria-label="Start Video Call"
                    >
                      <Image src="/images/meet-logo.png" alt="Google Meet" width={30} height={30} className="rounded-full" />
                    </button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-4 rounded-lg shadow ${message.sender === 'client' ? 'bg-blue-100' : 'bg-gray-100'}`}>
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
                    className="ml-2 bg-blue-400 text-white px-4 py-2 rounded-full hover:bg-blue-500"
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : isPsychotherapistMissing ? (
              <div className="w-full p-6 flex items-center justify-center">
                <p className="text-6xl text-blue-400 font-paintbrush">Book Your First Session to talk to your chosen Psychotherapist!</p>
              </div>
            ) : (
              <div className="w-full p-6 flex items-center justify-center">
                <p>Loading your psychotherapist...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;