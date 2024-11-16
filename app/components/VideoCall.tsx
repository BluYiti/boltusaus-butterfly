// import React, { useEffect, useRef } from 'react';
// import { Client, Databases, ID, Query } from 'appwrite';

// const client = new Client();
// client
//   .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
//   .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

// const databases = new Databases(client);

// interface VideoCallProps {
//   callerId: string;
//   receiverId: string;
//   onEndCall: () => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({ callerId, receiverId, onEndCall }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const processedMessageIds = useRef<Set<string>>(new Set());
//   const isOfferCreated = useRef(false);
//   const candidateQueue: RTCIceCandidate[] = [];

//   const setupLocalStream = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const hasVideoInput = devices.some(device => device.kind === 'videoinput');
//     const hasAudioInput = devices.some(device => device.kind === 'audioinput');

//     if (!hasVideoInput && !hasAudioInput) throw new Error("No media devices found.");

//     return navigator.mediaDevices.getUserMedia({ video: hasVideoInput, audio: hasAudioInput });
//   };

//   useEffect(() => {

//     // Function to ensure we wait until the signaling state is 'have-local-offer'
// const waitForSignalingState = async (targetState: string, retries = 10, interval = 100) => {
//   let attempt = 0;
//   while (peerConnection.current?.signalingState !== targetState && attempt < retries) {
//     console.log(`Waiting for signaling state to be '${targetState}', current state: ${peerConnection.current?.signalingState}`);
//     await new Promise(resolve => setTimeout(resolve, interval));
//     attempt++;
//   }

//   if (peerConnection.current?.signalingState === targetState) {
//     console.log(`Signaling state successfully reached '${targetState}' after ${attempt} attempts.`);
//   } else {
//     console.warn(`Failed to reach signaling state '${targetState}' after ${retries} attempts, current state: ${peerConnection.current?.signalingState}`);
//   }
// };

// // Modified setupPeerConnection function to ensure signaling state changes properly
// const setupPeerConnection = async () => {
//   if (peerConnection.current || isOfferCreated.current) return;

//   try {
//     const localStream = await setupLocalStream();
//     if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

//     peerConnection.current = new RTCPeerConnection();
//     localStream.getTracks().forEach(track => peerConnection.current?.addTrack(track, localStream));

//     peerConnection.current.onicecandidate = event => {
//       if (event.candidate) {
//         console.log("Sending ICE candidate:", event.candidate);
//         sendSignalingMessage({
//           type: 'candidate',
//           from: callerId,
//           to: receiverId,
//           candidate: JSON.stringify(event.candidate),
//         });
//       }
//     };

//     peerConnection.current.ontrack = event => {
//       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
//       console.log("Received remote stream:", event.streams[0]);
//     };

//     peerConnection.current.oniceconnectionstatechange = () => {
//       console.log("ICE connection state changed:", peerConnection.current?.iceConnectionState);
//       if (peerConnection.current?.iceConnectionState === "connected") {
//         console.log("Peer connected!");
//       }
//     };

//     peerConnection.current.onsignalingstatechange = () => {
//       console.log("Signaling state changed:", peerConnection.current?.signalingState);
//     };

//     // Generate offer only if we are the caller and in a stable state
//     if (callerId !== receiverId && peerConnection.current.signalingState === 'stable' && !isOfferCreated.current) {
//       isOfferCreated.current = true;
//       const offer = await peerConnection.current.createOffer();

//       // Set local description and ensure signaling state transition to 'have-local-offer'
//       await peerConnection.current.setLocalDescription(offer);
//       console.log("Created and set local offer:", offer);

//       // Explicitly wait for the signaling state to become 'have-local-offer'
//       await waitForSignalingState("have-local-offer");

//       sendSignalingMessage({
//         type: 'offer',
//         from: callerId,
//         to: receiverId,
//         sdp: JSON.stringify(offer),
//       });
//     }
//   } catch (error) {
//     console.error("Error setting up call:", error);
//     onEndCall();
//   }
// };


    

//     setupPeerConnection();

//     return () => {
//       if (peerConnection.current) {
//         peerConnection.current.close();
//         peerConnection.current = null;
//       }
//       isOfferCreated.current = false;

//       [localVideoRef, remoteVideoRef].forEach(ref => {
//         (ref.current?.srcObject as MediaStream)?.getTracks().forEach(track => track.stop());
//       });
//     };
//   }, [callerId, receiverId]);

//   const sendSignalingMessage = async (message: any) => {
//     const signalingData = {
//       type: message.type,
//       from: callerId,
//       to: receiverId,
//       timestamp: new Date().toISOString(),
//       sdp: message.sdp,
//       candidate: message.candidate,
//     };
//     console.log("Sending signaling message:", signalingData);
//     try {
//       await databases.createDocument(
//         "Butterfly-Database",
//         "SignalingMessages",
//         ID.unique(),
//         signalingData
//       );
//     } catch (error) {
//       console.error("Error sending signaling message:", error);
//     }
//   };

//   const pollForSignalingMessages = async () => {
//     try {
//       const response = await databases.listDocuments(
//         "Butterfly-Database",
//         "SignalingMessages",
//         [Query.equal("to", callerId)]
//       );

//       response.documents.forEach(message => {
//         if (!processedMessageIds.current.has(message.$id)) {
//           processedMessageIds.current.add(message.$id);
//           console.log("Received signaling message:", message);
//           handleSignalingMessage(message);
//         }
//       });
//     } catch (error) {
//       console.error("Error polling for signaling messages:", error);
//     }
//   };

//   let remoteDescriptionSet = false; // Flag to track when remote description is set
//   let answerQueue: any[] = []; // Queue to store answers received in the wrong state
  
//   const handleSignalingMessage = async (message: any) => {
//     const { type, sdp, candidate } = message;
//     if (!peerConnection.current) {
//       console.error("Peer connection is not initialized.");
//       return;
//     }
  
//     try {
//       if (type === 'offer' && sdp) {
//         // Only set remote description if signaling state is "stable"
//         if (peerConnection.current.signalingState === "stable") {
//           await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
//           console.log("Set remote description for offer:", sdp);
  
//           // Create and set a local answer
//           const answer = await peerConnection.current.createAnswer();
//           await peerConnection.current.setLocalDescription(answer);
//           console.log("Created and set local answer:", answer);
  
//           // Send the answer SDP back to the caller
//           sendSignalingMessage({
//             type: 'answer',
//             from: receiverId,
//             to: callerId,
//             sdp: JSON.stringify(answer),
//           });
  
//           // Update flag after setting remote description
//           remoteDescriptionSet = true;
  
//           // Process any queued ICE candidates immediately
//           processCandidateQueue();
  
//           // Check if there were answers in the queue to be processed
//           processAnswerQueue();
//         } else {
//           console.warn("Received 'offer' but signaling state is not 'stable'. Ignoring offer.");
//         }
//       } else if (type === 'answer' && sdp) {
//         if (peerConnection.current.signalingState === "have-local-offer") {
//           // If in the correct state, set the answer as the remote description
//           await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
//           console.log("Set remote description for answer:", sdp);
  
//           // Update flag to allow ICE candidate processing
//           remoteDescriptionSet = true;
  
//           // Process any queued ICE candidates immediately
//           processCandidateQueue();
//         } else {
//           // Queue the answer if we are not in the "have-local-offer" state
//           answerQueue.push(message);
//           console.log("Signaling state changed:", peerConnection.current?.signalingState);
//           console.warn("Received 'answer' but signaling state is not 'have-local-offer'. Queuing answer.");
//         }
//       } else if (type === 'candidate' && candidate) {
//         const iceCandidate = new RTCIceCandidate(JSON.parse(candidate));
//         if (remoteDescriptionSet) {
//           // Add ICE candidate immediately if remote description is set
//           try {
//             await peerConnection.current.addIceCandidate(iceCandidate);
//             console.log("Added ICE candidate:", iceCandidate);
//           } catch (error) {
//             console.error("Error adding ICE candidate:", error);
//           }
//         } else {
//           // Queue the ICE candidate until remote description is set
//           candidateQueue.push(iceCandidate);
//           console.log("Queuing ICE candidate as remote description is not set yet.");
//         }
//       }
//     } catch (error: any) {
//       console.error("Error handling signaling message:", error);
//     }
//   };
  
//  // Updated processAnswerQueue function to handle signaling state retry mechanism
// const processAnswerQueue = async () => {
//   const retryInterval = 200; // ms
//   let retries = 10; // Set a retry limit to avoid infinite loops
  
//   while (answerQueue.length > 0 && retries > 0) {
//     // Check if signaling state is 'have-local-offer' before processing
//     if (peerConnection.current?.signalingState === "have-local-offer") {
//       const answerMessage = answerQueue.shift();
//       if (answerMessage) {
//         try {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(JSON.parse(answerMessage.sdp))
//           );
//           console.log("Processed queued answer:", answerMessage.sdp);

//           // Set flag to indicate remote description is now set
//           remoteDescriptionSet = true;

//           // Process any queued ICE candidates immediately
//           processCandidateQueue();
//           break; // Exit loop if answer is set successfully
//         } catch (error) {
//           console.error("Error processing queued answer:", error);
//         }
//       }
//     } else {
//       // Wait and retry if signaling state is not yet 'have-local-offer'
//       console.log("Waiting for signaling state 'have-local-offer' to process answer queue...");
//       await new Promise(resolve => setTimeout(resolve, retryInterval));
//       retries--;
//     }
//   }

//   if (retries === 0 && answerQueue.length > 0) {
//     console.warn("Failed to set answer after multiple retries; check signaling synchronization.");
//   }
// };


//   // Function to process queued ICE candidates once remote description is set
//   const processCandidateQueue = async () => {
//     while (candidateQueue.length > 0) {
//       const candidate = candidateQueue.shift();
//       if (candidate) {
//         try {
//           await peerConnection.current?.addIceCandidate(candidate);
//           console.log("Added queued ICE candidate:", candidate);
//         } catch (error) {
//           console.error("Error adding queued ICE candidate:", error);
//         }
//       }
//     }
//   };
  

  
  
//   useEffect(() => {
//     const intervalId = setInterval(pollForSignalingMessages, 2000);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center h-full">
//       <h2 className="text-xl mb-4">Video Call</h2>
//       <div className="flex space-x-4">
//         <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg border" />
//         <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg border" />
//       </div>
//       <button onClick={onEndCall} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
//         End Call
//       </button>
//     </div>
//   );
// };

// export default VideoCall;

import React, { useEffect, useRef } from "react";
import { Client, Databases, ID, Query } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID as string);

const databases = new Databases(client);

interface VideoCallProps {
  callerId: string;
  receiverId: string;
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ callerId, receiverId, onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const processedMessageIds = useRef<Set<string>>(new Set());
  const isOfferCreated = useRef(false);
  const candidateQueue: RTCIceCandidate[] = [];
  const remoteDescriptionSet = useRef(false);

  const setupLocalStream = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideoInput = devices.some(device => device.kind === "videoinput");
    const hasAudioInput = devices.some(device => device.kind === "audioinput");

    if (!hasVideoInput && !hasAudioInput) throw new Error("No media devices found.");

    console.log("Setting up local stream with video:", hasVideoInput, "audio:", hasAudioInput);
    return navigator.mediaDevices.getUserMedia({ video: hasVideoInput, audio: hasAudioInput });
  };

  useEffect(() => {
    const setupPeerConnection = async () => {
      if (peerConnection.current || isOfferCreated.current) return;

      try {
        console.log("Initializing peer connection...");
        const localStream = await setupLocalStream();
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

        peerConnection.current = new RTCPeerConnection();
        localStream.getTracks().forEach(track => peerConnection.current?.addTrack(track, localStream));

        peerConnection.current.onicecandidate = event => {
          if (event.candidate) {
            console.log("Generated ICE candidate:", event.candidate);
            sendSignalingMessage({
              type: "candidate",
              from: callerId,
              to: receiverId,
              candidate: JSON.stringify(event.candidate),
            });
          }
        };

        peerConnection.current.ontrack = event => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
          console.log("Received remote stream:", event.streams[0]);
        };

        peerConnection.current.oniceconnectionstatechange = () => {
          console.log("ICE connection state changed to:", peerConnection.current?.iceConnectionState);
          if (peerConnection.current?.iceConnectionState === "connected") {
            console.log("Peer connected!");
          }
        };

        // Create offer if we are the caller
        if (callerId !== receiverId && peerConnection.current.signalingState === "stable" && !isOfferCreated.current) {
          console.log("Creating offer...");
          isOfferCreated.current = true;
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          console.log("Created and set local offer:", offer);

          sendSignalingMessage({
            type: "offer",
            from: callerId,
            to: receiverId,
            sdp: JSON.stringify(offer),
          });
        }
      } catch (error) {
        console.error("Error setting up call:", error);
        onEndCall();
      }
    };

    setupPeerConnection();

    return () => {
      console.log("Cleaning up peer connection...");
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
      from: callerId,
      to: receiverId,
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
        [Query.equal("to", callerId)]
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

  const handleSignalingMessage = async (message: any) => {
    const { type, sdp, candidate } = message;

    if (!peerConnection.current) {
      console.error("Peer connection is not initialized.");
      return;
    }

    try {
      // Log signaling state before handling offer/answer
      console.log("Current signaling state before handling:", peerConnection.current.signalingState);

      if (type === "offer" && sdp) {
        console.log("Handling offer...");
        if (peerConnection.current.signalingState === "stable") {
          // Set remote description for offer
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
          console.log("Set remote description for offer.");

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          console.log("Created and set local answer.");

          sendSignalingMessage({
            type: "answer",
            from: receiverId,
            to: callerId,
            sdp: JSON.stringify(answer),
          });

          remoteDescriptionSet.current = true;
          processCandidateQueue();
        } else {
          console.warn("Received 'offer' but signaling state is not 'stable'.");
        }
      } else if (type === "answer" && sdp) {
        console.log("Handling answer...");

        // Here, we expect the signaling state to be either "have-local-offer" or "have-remote-offer" before processing the answer
        const state = peerConnection.current.signalingState;
        console.log("Signaling state before setting answer:", state);

        if (
          state === "have-local-offer" || // Local peer has made an offer
          state === "have-remote-offer" || // Remote peer has made an offer
          state === "have-local-pranswer" // We've already created a provisional answer
        ) {
          // Proceed with setting the remote description for the answer
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sdp)));
          console.log("Set remote description for answer.");

          // Log the signaling state after setting the remote description
          console.log("Signaling state after setting remote description:", peerConnection.current.signalingState);

          remoteDescriptionSet.current = true;
          processCandidateQueue();
        } else {
          console.warn("Received 'answer' but signaling state is not valid for setting remote description. State:", state);
        }
      } else if (type === "candidate" && candidate) {
        const iceCandidate = new RTCIceCandidate(JSON.parse(candidate));
        if (remoteDescriptionSet.current) {
          await peerConnection.current.addIceCandidate(iceCandidate);
          console.log("Added ICE candidate:", iceCandidate);
        } else {
          candidateQueue.push(iceCandidate);
          console.log("Queued ICE candidate.");
        }
      }
    } catch (error) {
      console.error("Error handling signaling message:", error);
    }
  };

  const processCandidateQueue = async () => {
    while (candidateQueue.length > 0) {
      const candidate = candidateQueue.shift();
      if (candidate) {
        await peerConnection.current?.addIceCandidate(candidate);
        console.log("Processed queued ICE candidate:", candidate);
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

export default VideoCall;

