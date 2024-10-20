import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';

const CallModal = ({ isOpen, onClose, clientName }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const startVideoCall = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing media devices.', err);
        }
      };

      startVideoCall();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
        }
      };
    }
  }, [isOpen]);

  const toggleMic = () => {
    setMicEnabled((prev) => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = !prev));
      return !prev;
    });
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = !prev));
      return !prev;
    });
  };

  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
  <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-6xl"> {/* Increased max width to 6xl */}
    <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Video Call with {clientName}</h2>
    <div className="flex items-center justify-center mb-4 h-[70vh]"> {/* Set height to 80% of viewport height */}
      <video 
        ref={videoRef} 
        className="rounded-lg w-full h-full object-cover border-4 border-gray-300" 
        autoPlay
        playsInline // Ensures video plays inline on mobile devices
      ></video>
    </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-200"
            title="End Call"
          >
            <FaPhoneSlash />
          </button>
          <button
            onClick={toggleMic}
            className={`text-white font-bold py-2 px-4 rounded-full transition duration-200 ${micEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-500'}`}
            title={micEnabled ? "Mute" : "Unmute"}
          >
            {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button
            onClick={toggleVideo}
            className={`text-white font-bold py-2 px-4 rounded-full transition duration-200 ${videoEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'}`}
            title={videoEnabled ? "Turn off video" : "Turn on video"}
          >
            {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
