import React, { useEffect, useRef, useState } from 'react';

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
        // Cleanup the video stream on component unmount
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Video Call with {clientName}</h2>
        <div className="flex items-center justify-center h-96">
          <video ref={videoRef} className="rounded-lg w-full h-full object-cover" autoPlay></video>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            End Call
          </button>
          <button
            onClick={toggleMic}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <i className={`fas ${micEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
          </button>
          <button
            onClick={toggleVideo}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <i className={`fas ${videoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
