'use client';
import { FC, useState, useRef, useEffect } from 'react';
import Layout from '@/components/Sidebar/Layout';
import items from '@/client/data/Links';
import { Client, Databases, Account, Query, ID } from 'appwrite';
import CallNotification from '@/components/CallNotification';
import ClientVideoCall from '@/components/ClientVideoCall';
import Image from 'next/image';

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
  const [psychotherapist, setPsychotherapist] = useState<Psychotherapist | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [call, setCall] = useState<Call>({ isActive: false, caller: null });
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [clientDocumentId, setClientDocumentId] = useState<string | null>(null);
  const [notificationDocumentId, setNotificationDocumentId] = useState<string | null>(null); // To store Call-Notification ID
  const [isPollingActive, setIsPollingActive] = useState(true);
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
              const psychotherapistResponse = await databases.getDocument(
                'Butterfly-Database',
                'Psychotherapist',
                psychotherapistId
              );

              setPsychotherapist({
                id: psychotherapistResponse.$id,
                name: `${psychotherapistResponse.firstName || 'Unknown'} ${psychotherapistResponse.lastName || 'Name'}`,
                imageUrl: psychotherapistResponse.imageUrl || '/default-avatar.jpg',
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
          }
        }
      } catch (error) {
        console.error('Error fetching psychotherapist:', error);
      }
    };

    fetchPsychotherapist();
  }, []);

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

  // Polling for Call Notification
  useEffect(() => {
    const pollForCallNotifications = async () => {
      if (!clientDocumentId || !isPollingActive) return;

      try {
        const response = await databases.listDocuments(
          'Butterfly-Database',
          'Call-Notification',
          [Query.equal('receiverId', clientDocumentId), Query.equal('isActive', true)]
        );

        if (response.documents.length > 0) {
          const notification = response.documents[0];
          if (notification.callerId === psychotherapist?.id) {
            setCall({ isActive: true, caller: psychotherapist });
            setNotificationDocumentId(notification.$id); // Capture Call-Notification ID for updating
          }
        } else {
          setCall({ isActive: false, caller: null });
        }
      } catch (error) {
        console.error("Error polling for call notifications:", error);
      }
    };

    const interval = setInterval(pollForCallNotifications, 3000);
    return () => clearInterval(interval);
  }, [clientDocumentId, psychotherapist, isPollingActive]);

  // Function to accept the call
  const handleAcceptCall = async () => {
    if (isVideoCallActive) return;
    setIsVideoCallActive(true);
    setCall({ isActive: false, caller: null });
    setIsPollingActive(false);

    if (notificationDocumentId) { // Use notificationDocumentId to update the correct Call-Notification document
      try {
        await databases.updateDocument(
          'Butterfly-Database',
          'Call-Notification',
          notificationDocumentId,
          { isActive: false }
        );
      } catch (error) {
        console.error('Error updating call notification:', error);
      }
    }
  };

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            ) : (
              <div className="w-full p-6 flex items-center justify-center">
                <p>Loading your psychotherapist...</p>
              </div>
            )}
          </div>
        </div>

        {call.isActive && (
          <CallNotification 
            caller={call.caller} 
            onAccept={handleAcceptCall} 
          />
        )}
        {isVideoCallActive && psychotherapist && clientDocumentId && (
          <ClientVideoCall 
            callerId={psychotherapist.id} 
            receiverId={clientDocumentId} 
            onEndCall={() => {
              setIsVideoCallActive(false);
              setIsPollingActive(true); // Resume polling after call ends
            }} 
          />
        )}
      </div>
    </Layout>
  );
};

export default ChatPage;