'use client';

import { useEffect, useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';

export default function VideoCall() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  useEffect(() => {
    // Function to start the video call
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
  }, []);

  // Function to toggle the microphone
  const toggleMic = () => {
    setMicEnabled((prev) => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => (track.enabled = !prev));
      return !prev;
    });
  };

  // Function to toggle the video
  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => (track.enabled = !prev));
      return !prev;
    });
  };

  // Function to end the call
  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white px-4 py-2 shadow">
        <div className="text-xl font-bold">Logo</div>
        <nav className="flex space-x-4">
          <a href="#" className="text-gray-600 hover:text-black">Dashboard</a>
          <a href="#" className="text-gray-600 hover:text-black">Client List</a>
          <a href="#" className="text-gray-600 hover:text-black">Reports</a>
          <a href="#" className="text-gray-600 hover:text-black">Recordings</a>
          <a href="#" className="text-gray-600 hover:text-black">Resources</a>
          <a href="#" className="text-gray-600 hover:text-black">About</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        {/* Video Call Area */}
        <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
          <div className="flex justify-end absolute top-2 right-2">
            <img src="avatar.png" alt="Avatar" className="w-20 h-20 object-cover rounded-full" />
          </div>
          <div className="flex items-center justify-center h-96">
            <video ref={videoRef} className="rounded-lg w-full h-full object-cover" autoPlay></video>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            >
              <i className="fas fa-phone-slash"></i>
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

          {/* Side Panels */}
          <div className="absolute top-4 left-4 space-y-4">
            <div className="bg-blue-500 text-white rounded-lg p-4 w-48 shadow-lg">
              <div className="font-bold">Assignments:</div>
              {/* Assignment Details Here */}
            </div>
            <div className="bg-blue-400 text-white rounded-lg p-4 w-48 shadow-lg">
              <div className="font-bold flex justify-between">
                Private Notes: <span><i className="fas fa-lock"></i></span>
              </div>
              {/* Private Notes Details Here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
