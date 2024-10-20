// VideoCall.tsx
import React, { useEffect, useRef } from 'react';

interface VideoCallProps {
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideoCall = async () => {
      try {
        // Get local video stream
        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Here you would typically set up the signaling for remote stream, using WebRTC, etc.
        // For this example, we just simulate receiving a remote stream.
        const remoteStream = new MediaStream();
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }

        // This is where you'd handle adding tracks to the remote stream based on your signaling logic
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startVideoCall();

    return () => {
      // Clean up on component unmount
      if (localVideoRef.current) {
        localVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

export default VideoCall;
