import React, { useEffect, useRef, useState, useCallback } from "react";
import { Client, Databases, ID, Query } from "appwrite";

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

// const databases = new Databases(client);

// interface VideoCallProps {
//   callerId: string;
//   receiverId: string;
//   onEndCall: () => void;
// }

const VideoCall: React.FC<VideoCallProps> = ({
  callerId,
  receiverId,
  onEndCall,
}) => {
  const [isCalling, setIsCalling] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set()); // Track processed message IDs
  const isOfferCreated = useRef(false); // Track if offer is already created

  const setupLocalStream = async () => {
    try {
      console.log("Initializing local stream...");
    
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Detected devices:", devices);
  
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true, // Request video
        audio: true, // Request audio
      });
  
      console.log("Obtained local stream:", localStream);
  
      if (localStream) {
        // Attach the stream to the video element if it's valid
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          console.log("Local stream assigned to video element");
        } else {
          console.error("Local video element reference is not found.");
        }
      } else {
        console.error("No local stream could be established.");
      }
  
      // Ensure video tracks are working
      localStream.getVideoTracks().forEach(track => {
        console.log("Video track found:", track);
        if (track.readyState === "live") {
          console.log("Track is live.");
        }
      });
  
      return localStream;
    } catch (error) {
      console.error("Error setting up local stream:", error);
      alert(
        "Unable to access your camera. Please ensure permissions are granted and no other application is using it."
      );
      throw error;
    }
  };
  
  // Updated signaling message structure in sendSignalingMessage
  const sendSignalingMessage = useCallback(
    async (message) => {
      const messageId = `${message.type}-${message.from}-${message.to}-${message.sdp || message.candidate}`;

      // Skip duplicate signaling messages
      if (processedMessageIds.current.has(messageId)) {
        console.log("Duplicate signaling message skipped:", messageId);
        return;
      }

      processedMessageIds.current.add(messageId);

      const signalingData = {
        type: message.type,
        from: callerId,
        to: receiverId,
        timestamp: new Date().toISOString(),
        sdp: message.sdp ? JSON.stringify(message.sdp) : undefined, // Ensure SDP is stringified
        candidate: message.candidate ? JSON.stringify(message.candidate) : undefined, // Ensure ICE candidate is stringified
      };

      console.log("Sending signaling message:", signalingData); // Debug log
      try {
        await databases.createDocument(
          "Butterfly-Database",
          "SignalingMessages",
          ID.unique(),
          signalingData
        );
        console.log("Signaling message sent successfully");
      } catch (error) {
        console.error("Error sending signaling message:", error);
      }
    },
    [callerId, receiverId]
  );

  // Updated handleSignalingMessage with improved error handling
  const handleSignalingMessage = useCallback(
    async (message) => {
      const { type, sdp, candidate } = message;

      if (!peerConnection.current) {
        console.warn("PeerConnection not initialized.");
        return;
      }

      try {
        console.log("Processing signaling message:", message);
        if (type === "offer" && sdp) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(sdp))
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          sendSignalingMessage({
            type: "answer",
            from: callerId,
            to: receiverId,
            sdp: JSON.stringify(answer),
          });
          setIsCalling(false);
        } else if (type === "answer" && sdp) {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(sdp))
          );
          setIsCalling(false);
        } else if (type === "candidate" && candidate) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(JSON.parse(candidate))
          );
        }
      } catch (error) {
        console.error("Error processing signaling message:", error);
      }
    },
    [sendSignalingMessage, callerId, receiverId]
  );

//   const pollForSignalingMessages = useCallback(async () => {
//     try {
//       const response = await databases.listDocuments(
//         "Butterfly-Database",
//         "SignalingMessages",
//         [Query.equal("to", callerId)]
//       );

      response.documents.forEach((message) => {
        // Skip already processed messages
        if (!processedMessageIds.current.has(message.$id)) {
          processedMessageIds.current.add(message.$id); // Mark the message as processed
          handleSignalingMessage(message); // Handle the new message
        }
      });
    } catch (error) {
      console.error("Error polling for signaling messages:", error);
    }
  }, [callerId, handleSignalingMessage]);

  // Cleaned up PeerConnection setup logic
  useEffect(() => {
    const setupPeerConnection = async () => {
      if (peerConnection.current || isOfferCreated.current) return;

      try {
        const localStream = await setupLocalStream();

        peerConnection.current = new RTCPeerConnection();

        localStream.getTracks().forEach(track => {
          console.log("Adding track to peer connection:", track);
          peerConnection.current?.addTrack(track, localStream);
        });

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("ICE candidate generated:", event.candidate);
            sendSignalingMessage({
              type: "candidate",
              from: callerId,
              to: receiverId,
              candidate: JSON.stringify(event.candidate),
            });
          }
        };

        peerConnection.current.ontrack = (event) => {
          console.log("Received remote track event:", event);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          } else {
            console.error("Remote video element not found.");
          }
        };

        if (callerId !== receiverId && !isOfferCreated.current) {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          sendSignalingMessage({
            type: "offer",
            from: callerId,
            to: receiverId,
            sdp: JSON.stringify(offer),
          });
          isOfferCreated.current = true; // Mark offer as created
        }
      } catch (error) {
        console.error("Error setting up peer connection:", error);
        onEndCall();
      }
    };

//     setupPeerConnection();

    return () => {
      console.log("Cleaning up PeerConnection.");
      peerConnection.current?.close();
      [localVideoRef, remoteVideoRef].forEach((ref) => {
        if (ref.current?.srcObject) {
          (ref.current.srcObject as MediaStream)?.getTracks().forEach((track) => track.stop());
        }
      });
    };
  }, [callerId, receiverId, onEndCall, sendSignalingMessage]);

  // Increased polling interval and improved efficiency
  useEffect(() => {
    const intervalId = setInterval(pollForSignalingMessages, 5000);
    return () => clearInterval(intervalId);
  }, [pollForSignalingMessages]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl mb-4">Video Call</h2>
      <div className="flex space-x-4">
        <video ref={localVideoRef} autoPlay className="w-1/2 rounded-lg border" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg border" />
      </div>
      <button onClick={onEndCall} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        End Call
      </button>
    </div>
  );
};

// export default VideoCall;

