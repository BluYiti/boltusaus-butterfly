'use client'

import React, { useEffect, useRef } from 'react';
import SimplePeer from 'simple-peer';
import { Client, Databases, ID, Query } from 'appwrite';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);
const databases = new Databases(client);

interface ClientVideoCallProps {
  callerId: string;
  receiverId: string;
  onEndCall: () => void;
}

const ClientVideoCall: React.FC<ClientVideoCallProps> = ({ callerId, receiverId, onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const isOfferCreated = useRef(false); 
  let signalingInterval = null;

  const setupLocalStream = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some(device => device.kind === 'videoinput');
    const hasAudioInput = devices.some(device => device.kind === 'audioinput');

    if (!hasVideoInput && !hasAudioInput) {
      throw new Error("No camera or microphone found on this device.");
    }

    return navigator.mediaDevices.getUserMedia({
      video: hasVideoInput,
      audio: hasAudioInput,
    });
  };

  // Replace the incorrect useRef call with useEffect
  useEffect(() => {
    if (!callerId) {
      console.error("Caller ID is undefined. Ensure it is passed as a prop.");
      return;
    }

    const setupVideoCall = async () => {
      if (peerRef.current || isOfferCreated.current) return;

      try {
        const localStream = await setupLocalStream();
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        const isCaller = callerId !== receiverId;
        peerRef.current = new SimplePeer({
          initiator: isCaller,
          trickle: false,
          stream: localStream,
        });

        peerRef.current.on('signal', data => {
          console.log("Signaling data:", data);
          sendSignalingMessage({
            type: isCaller ? 'offer' : 'answer',
            from: callerId,
            to: receiverId,
            signalData: JSON.stringify(data),
          });
        });

        peerRef.current.on('connect', () => {
          console.log("Peer connection established!");
        });

        peerRef.current.on('error', err => {
          console.error("Peer connection error:", err);
        });

        peerRef.current.on('close', () => {
          console.log("Peer connection closed.");
        });

        peerRef.current.on('stream', remoteStream => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });

        signalingInterval = setInterval(pollForSignalingMessages, 2000);
      } catch (error) {
        console.error("Error setting up video call:", error);
        onEndCall();
      }
    };

    setupVideoCall();

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      peerRef.current = null;

      [localVideoRef, remoteVideoRef].forEach(ref => {
        (ref.current?.srcObject as MediaStream)?.getTracks().forEach(track => track.stop());
      });

      if (signalingInterval) clearInterval(signalingInterval);
      signalingInterval = null;
      isOfferCreated.current = false;
    };
  }, []); // Change useRef to useEffect

  const sendSignalingMessage = async (message) => {
    try {
      if (!message.from) {
        console.error("The 'from' field is empty. Check that callerId is correctly passed.");
        return;
      }

      const signalingData = {
        type: message.type,
        from: message.from,
        to: message.to,
        timestamp: new Date().toISOString(),
        sdp: message.signalData ? JSON.parse(message.signalData).sdp : undefined,
        candidate: message.candidate || (message.signalData ? JSON.parse(message.signalData).candidate : undefined),
      };

      console.log("Signaling message prepared:", signalingData);

      await databases.createDocument(
        "Butterfly-Database",
        "SignalingMessages",
        ID.unique(),
        signalingData
      );

      console.log("Signaling message sent to Appwrite:", signalingData);
    } catch (error) {
      console.error("Error sending signaling message:", error);
    }
  };

  const pollForSignalingMessages = async () => {
    try {
      const response = await databases.listDocuments(
        "Butterfly-Database",
        "SignalingMessages",
        [Query.equal("to", callerId)]
      );

      response.documents.forEach(message => {
        if (!processedMessageIds.current.has(message.$id)) {
          processedMessageIds.current.add(message.$id);
          handleSignalingMessage(message);
        }
      });
    } catch (error) {
      console.error("Error polling for signaling messages:", error);
    }
  };

  const handleSignalingMessage = (message) => {
    if (!peerRef.current) return;

    try {
      const parsedData = JSON.parse(message.signalData);
      peerRef.current.signal(parsedData);
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl mb-4">Video Call</h2>
      <div className="flex space-x-4">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg border" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg border" />
      </div>
      <button onClick={onEndCall} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        End Call
      </button>
    </div>
  );
};

export default ClientVideoCall;
