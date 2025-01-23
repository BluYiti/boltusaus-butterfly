// import React, { useEffect, useRef, useCallback } from "react";
// import { Client, Databases, ID, Query } from "appwrite";

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

// const VideoCall: React.FC<VideoCallProps> = ({
//   callerId,
//   receiverId,
//   onEndCall,
// }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnection = useRef<RTCPeerConnection | null>(null);
//   const processedMessageIds = useRef<Set<string>>(new Set());
//   const isOfferCreated = useRef(false);
//   const candidateQueue: RTCIceCandidate[] = [];
//   const remoteDescriptionSet = useRef(false);

//   const setupLocalStream = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const hasVideoInput = devices.some(device => device.kind === 'videoinput');
//     const hasAudioInput = devices.some(device => device.kind === 'audioinput');
    
//     if (!hasVideoInput && !hasAudioInput) throw new Error("No media devices found.");

//     return navigator.mediaDevices.getUserMedia({ video: hasVideoInput, audio: hasAudioInput });
//   };

//   const sendSignalingMessage = useCallback(
//     async (message) => {
//       const signalingData = {
//         type: message.type,
//         from: callerId,
//         to: receiverId,
//         timestamp: new Date().toISOString(),
//         sdp: message.sdp,
//         candidate: message.candidate,
//       };

//       try {
//         await databases.createDocument(
//           "Butterfly-Database",
//           "SignalingMessages",
//           ID.unique(),
//           signalingData
//         );
//       } catch (error) {
//         console.error("Error sending signaling message:", error);
//       }
//     },
//     [callerId, receiverId]
//   );

//   const handleSignalingMessage = useCallback(
//     async (message) => {
//       const { type, sdp, candidate } = message;
//       if (!peerConnection.current) return;

//       try {
//         if (type === "offer" && sdp) {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(JSON.parse(sdp))
//           );
//           const answer = await peerConnection.current.createAnswer();
//           await peerConnection.current.setLocalDescription(answer);
//           sendSignalingMessage({
//             type: "answer",
//             from: callerId,
//             to: receiverId,
//             sdp: JSON.stringify(answer),
//           });
//         } else if (type === "answer" && sdp) {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(JSON.parse(sdp))
//           );
//         } else if (type === "candidate" && candidate) {
//           await peerConnection.current.addIceCandidate(
//             new RTCIceCandidate(JSON.parse(candidate))
//           );
//         }
//       } catch (error) {
//         console.error("Error handling signaling message:", error);
//       }
//     },
//     [sendSignalingMessage, callerId, receiverId]
//   );

//   const pollForSignalingMessages = useCallback(async () => {
//     try {
//       const response = await databases.listDocuments(
//         "Butterfly-Database",
//         "SignalingMessages",
//         [Query.equal("to", callerId)]
//       );

//       response.documents.forEach((message) => {
//         if (!processedMessageIds.current.has(message.$id)) {
//           processedMessageIds.current.add(message.$id);
//           handleSignalingMessage(message);
//         }
//       });
//     } catch (error) {
//       console.error("Error polling for signaling messages:", error);
//     }
//   }, [callerId, handleSignalingMessage]);

//   useEffect(() => {
//     const setupPeerConnection = async () => {
//       if (peerConnection.current || isOfferCreated.current) return;

//       try {
//         const localStream = await setupLocalStream();
//         if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

//         peerConnection.current = new RTCPeerConnection();
//         localStream.getTracks().forEach((track) =>
//           peerConnection.current?.addTrack(track, localStream)
//         );

//         peerConnection.current.onicecandidate = (event) => {
//           if (event.candidate) {
//             sendSignalingMessage({
//               type: "candidate",
//               from: callerId,
//               to: receiverId,
//               candidate: JSON.stringify(event.candidate),
//             });
//           }
//         };

//         peerConnection.current.ontrack = (event) => {
//           if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
//         };

//         if (callerId !== receiverId) {
//           const offer = await peerConnection.current.createOffer();
//           await peerConnection.current.setLocalDescription(offer);
//           sendSignalingMessage({
//             type: "offer",
//             from: callerId,
//             to: receiverId,
//             sdp: JSON.stringify(offer),
//           });
//           isOfferCreated.current = true;
//         }
//       } catch (error) {
//         console.error("Error setting up call:", error);
//         onEndCall();
//       }
//     };

//     setupPeerConnection();

//     return () => {
//       peerConnection.current?.close();
//       [localVideoRef, remoteVideoRef].forEach((ref) => {
//         (ref.current?.srcObject as MediaStream)?.getTracks().forEach((track) => track.stop());
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

//       try {
//         await databases.createDocument(
//           "Butterfly-Database",
//           "SignalingMessages",
//           ID.unique(),
//           signalingData
//         );
//       } catch (error) {
//         console.error("Error sending signaling message:", error);
//       }
//     },
//     [callerId, receiverId]
//   );

//   const handleSignalingMessage = useCallback(
//     async (message) => {
//       const { type, sdp, candidate } = message;
//       if (!peerConnection.current) return;

//       try {
//         if (type === "offer" && sdp) {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(JSON.parse(sdp))
//           );
//           const answer = await peerConnection.current.createAnswer();
//           await peerConnection.current.setLocalDescription(answer);
//           sendSignalingMessage({
//             type: "answer",
//             from: callerId,
//             to: receiverId,
//             sdp: JSON.stringify(answer),
//           });
//         } else if (type === "answer" && sdp) {
//           await peerConnection.current.setRemoteDescription(
//             new RTCSessionDescription(JSON.parse(sdp))
//           );
//         } else if (type === "candidate" && candidate) {
//           await peerConnection.current.addIceCandidate(
//             new RTCIceCandidate(JSON.parse(candidate))
//           );
//         }
//       } catch (error) {
//         console.error("Error handling signaling message:", error);
//       }
//     },
//     [sendSignalingMessage, callerId, receiverId]
//   );

//   const pollForSignalingMessages = useCallback(async () => {
//     try {
//       const response = await databases.listDocuments(
//         "Butterfly-Database",
//         "SignalingMessages",
//         [Query.equal("to", callerId)]
//       );

//       response.documents.forEach((message) => {
//         if (!processedMessageIds.current.has(message.$id)) {
//           processedMessageIds.current.add(message.$id);
//           handleSignalingMessage(message);
//         }
//       });
//     } catch (error) {
//       console.error("Error polling for signaling messages:", error);
//     }
//   }, [callerId, handleSignalingMessage]);

//   useEffect(() => {
//     const setupPeerConnection = async () => {
//       if (peerConnection.current || isOfferCreated.current) return;

//       try {
//         console.log("Initializing peer connection...");
//         const localStream = await setupLocalStream();
//         if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

//         peerConnection.current = new RTCPeerConnection();
//         localStream.getTracks().forEach((track) =>
//           peerConnection.current?.addTrack(track, localStream)
//         );

//         peerConnection.current.onicecandidate = (event) => {
//           if (event.candidate) {
//             console.log("Generated ICE candidate:", event.candidate);
//             sendSignalingMessage({
//               type: "candidate",
//               from: callerId,
//               to: receiverId,
//               candidate: JSON.stringify(event.candidate),
//             });
//           }
//         };

//         peerConnection.current.ontrack = (event) => {
//           if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
//           console.log("Received remote stream:", event.streams[0]);
//         };

//         if (callerId !== receiverId) {
//           const offer = await peerConnection.current.createOffer();
//           await peerConnection.current.setLocalDescription(offer);
//           console.log("Created and set local offer:", offer);

//           sendSignalingMessage({
//             type: "offer",
//             from: callerId,
//             to: receiverId,
//             sdp: JSON.stringify(offer),
//           });
//         }
//       } catch (error) {
//         console.error("Error setting up call:", error);
//         onEndCall();
//       }
//     };

//     setupPeerConnection();

//     return () => {
//       peerConnection.current?.close();
//       [localVideoRef, remoteVideoRef].forEach((ref) => {
//         (ref.current?.srcObject as MediaStream)?.getTracks().forEach((track) => track.stop());
//       });
//     };
//   }, [callerId, receiverId, onEndCall, sendSignalingMessage]);

//   const processCandidateQueue = async () => {
//     while (candidateQueue.length > 0) {
//       const candidate = candidateQueue.shift();
//       if (candidate) {
//         await peerConnection.current?.addIceCandidate(candidate);
//         console.log("Processed queued ICE candidate:", candidate);
//       }
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(pollForSignalingMessages, 2000);
//     return () => clearInterval(intervalId);
//   }, [pollForSignalingMessages]);

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

