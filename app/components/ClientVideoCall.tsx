import React, { useEffect, useRef } from 'react';
import { Client, Databases, ID, Query } from 'appwrite';

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
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const isOfferCreated = useRef(false);
  const candidateQueue: RTCIceCandidate[] = [];

  const setupLocalStream = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some(device => device.kind === 'videoinput');
    const hasAudioInput = devices.some(device => device.kind === 'audioinput');

    if (!hasVideoInput && !hasAudioInput) throw new Error("No media devices found.");

    return navigator.mediaDevices.getUserMedia({ video: hasVideoInput, audio: hasAudioInput });
  };

  useEffect(() => {
    const setupPeerConnection = async () => {
      if (peerConnection.current || isOfferCreated.current) return;

      try {
        const localStream = await setupLocalStream();
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        peerConnection.current = new RTCPeerConnection();
        localStream.getTracks().forEach(track => peerConnection.current?.addTrack(track, localStream));

        peerConnection.current.onicecandidate = event => {
          if (event.candidate) {
            console.log("Sending ICE candidate:", event.candidate);
            sendSignalingMessage({
              type: 'candidate',
              from: receiverId,
              to: callerId,
              candidate: JSON.stringify(event.candidate),
            });
          }
        };

        peerConnection.current.ontrack = event => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
          console.log("Received remote stream:", event.streams[0]);
        };

        peerConnection.current.oniceconnectionstatechange = () => {
          console.log("ICE connection state changed:", peerConnection.current?.iceConnectionState);
          if (peerConnection.current?.iceConnectionState === "connected") {
            console.log("Peer connected!");
          }
        };

        peerConnection.current.onsignalingstatechange = () => {
          console.log("Signaling state changed:", peerConnection.current?.signalingState);
        };
      } catch (error) {
        console.error("Error setting up call:", error);
        onEndCall();
      }
    };

    setupPeerConnection();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      isOfferCreated.current = false;

      [localVideoRef, remoteVideoRef].forEach(ref => {
        (ref.current?.srcObject as MediaStream)?.getTracks().forEach(track => track.stop());
      });
    };
  }, [callerId, receiverId]);

  const sendSignalingMessage = async (message: any) => {
    const signalingData = {
      type: message.type,
      from: receiverId,
      to: callerId,
      timestamp: new Date().toISOString(),
      sdp: message.sdp,
      candidate: message.candidate,
    };
    console.log("Sending signaling message:", signalingData);
    try {
      await databases.createDocument(
        "Butterfly-Database",
        "SignalingMessages",
        ID.unique(),
        signalingData
      );
    } catch (error) {
      console.error("Error sending signaling message:", error);
    }
  };

  const pollForSignalingMessages = async () => {
    try {
      const response = await databases.listDocuments(
        "Butterfly-Database",
        "SignalingMessages",
        [Query.equal("to", receiverId)]
      );

      response.documents.forEach(message => {
        if (!processedMessageIds.current.has(message.$id)) {
          processedMessageIds.current.add(message.$id);
          console.log("Received signaling message:", message);
          handleSignalingMessage(message);
        }
      });
    } catch (error) {
      console.error("Error polling for signaling messages:", error);
    }
  };

  let remoteDescriptionSet = false; // Flag to track when remote description is set
  let answerQueue: any[] = []; // Queue to store answers received in the wrong state
  
  const handleSignalingMessage = async (message: any) => {
    const { type, sdp, candidate } = message;
    if (!peerConnection.current) {
      console.error("Peer connection is not initialized.");
      return;
    }
  
    try {
      if (type === 'offer' && sdp) {
        // Only set remote description if signaling state is "stable"
        if (peerConnection.current.signalingState === "stable") {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
          console.log("Set remote description for offer:", sdp);
  
          // Create and set a local answer
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          console.log("Created and set local answer:", answer);
  
          // Send the answer SDP back to the caller
          sendSignalingMessage({
            type: 'answer',
            from: receiverId,
            to: callerId,
            sdp: JSON.stringify(answer),
          });
  
          // Update flag after setting remote description
          remoteDescriptionSet = true;
  
          // Process any queued ICE candidates immediately
          processCandidateQueue();
  
          // Check if there were answers in the queue to be processed
          processAnswerQueue();
        } else {
          console.warn("Received 'offer' but signaling state is not 'stable'. Ignoring offer.");
        }
      } else if (type === 'answer' && sdp) {
        if (peerConnection.current.signalingState === "have-local-offer") {
          // If in the correct state, set the answer as the remote description
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
          console.log("Set remote description for answer:", sdp);
  
          // Update flag to allow ICE candidate processing
          remoteDescriptionSet = true;
  
          // Process any queued ICE candidates immediately
          processCandidateQueue();
        } else {
          // Queue the answer if we are not in the "have-local-offer" state
          answerQueue.push(message);
          console.warn("Received 'answer' but signaling state is not 'have-local-offer'. Queuing answer.");
        }
      } else if (type === 'candidate' && candidate) {
        const iceCandidate = new RTCIceCandidate(JSON.parse(candidate));
        if (remoteDescriptionSet) {
          // Add ICE candidate immediately if remote description is set
          try {
            await peerConnection.current.addIceCandidate(iceCandidate);
            console.log("Added ICE candidate:", iceCandidate);
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        } else {
          // Queue the ICE candidate until remote description is set
          candidateQueue.push(iceCandidate);
          console.log("Queuing ICE candidate as remote description is not set yet.");
        }
      }
    } catch (error: any) {
      console.error("Error handling signaling message:", error);
    }
  };
  
 // Updated processAnswerQueue function
const processAnswerQueue = async () => {
  // Check if signaling state is 'have-local-offer' before processing
  if (peerConnection.current?.signalingState === "have-local-offer" && answerQueue.length > 0) {
    while (answerQueue.length > 0) {
      const answerMessage = answerQueue.shift();
      if (answerMessage) {
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(answerMessage.sdp))
          );
          console.log("Processed queued answer:", answerMessage.sdp);

          // Update flag to allow ICE candidate processing
          remoteDescriptionSet = true;

          // Process any queued ICE candidates immediately
          processCandidateQueue();
        } catch (error) {
          console.error("Error processing queued answer:", error);
        }
      }
    }
  } else {
    console.log("Waiting for signaling state 'have-local-offer' to process answer queue...");
    // Optionally add a timeout or retry mechanism if necessary.
  }
};

  
  // Function to process queued ICE candidates once remote description is set
  const processCandidateQueue = async () => {
    while (candidateQueue.length > 0) {
      const candidate = candidateQueue.shift();
      if (candidate) {
        try {
          await peerConnection.current?.addIceCandidate(candidate);
          console.log("Added queued ICE candidate:", candidate);
        } catch (error) {
          console.error("Error adding queued ICE candidate:", error);
        }
      }
    }
  };
  
  useEffect(() => {
    const intervalId = setInterval(pollForSignalingMessages, 2000);
    return () => clearInterval(intervalId);
  }, []);

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
