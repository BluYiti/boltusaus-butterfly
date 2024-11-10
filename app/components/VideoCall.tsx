import React, { useEffect, useRef, useState } from 'react';

interface VideoCallProps {
  onEndCall: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ onEndCall }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);

  const requestVideoCallPermissions = async () => {
    try {
      setErrorMessage(null); // Reset any previous error messages
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const remoteStream = new MediaStream(); // Placeholder, real remote stream requires WebRTC setup
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotFoundError") {
        console.error('Error accessing media devices. No devices found.');
        setErrorMessage("No camera or microphone found. Please connect them and allow permissions.");
      } else if (error instanceof DOMException && error.name === "NotAllowedError") {
        console.error('Permission to access media devices was denied.');
        setErrorMessage("Please allow camera and microphone permissions to start the video call.");
      } else {
        console.error('Unexpected error accessing media devices:', error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    // If permission was requested, then attempt to start the video call
    if (permissionRequested) {
      requestVideoCallPermissions();
    }

    // Cleanup media tracks when component unmounts
    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
        (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [permissionRequested]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl mb-4">Video Call</h2>
      {!permissionRequested && (
        <div className="flex flex-col items-center">
          <p className="mb-4">This call requires access to your camera and microphone.</p>
          <button
            onClick={() => setPermissionRequested(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Allow Access
          </button>
        </div>
      )}
      {permissionRequested && (
        <>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className="flex space-x-4">
            <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg border" />
            <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg border" />
          </div>
          <button onClick={onEndCall} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            End Call
          </button>
          <button onClick={requestVideoCallPermissions} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Retry
          </button>
        </>
      )}
    </div>
  );
};

export default VideoCall;
