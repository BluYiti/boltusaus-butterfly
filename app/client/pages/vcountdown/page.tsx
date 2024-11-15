'use client';
import { FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';

const Countdown: FC<{ seconds: number; onComplete: () => void }> = ({ seconds, onComplete }) => {
  
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          clearInterval(intervalId);
          onComplete(); // Call onComplete when the countdown reaches zero
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onComplete]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
  };

  return <span className="text-5xl font-bold">{formatTime(timeLeft)}</span>; // Increased font size
};

const Page: FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter(); // Initialize useRouter
  const { loading: authLoading } = useAuthCheck(['client']); // Call the useAuthCheck hook

  if (authLoading ) {
      return <LoadingScreen />; // Show the loading screen while the auth check or data loading is in progress
  }
  
  function handleCountdownComplete(): void {
    router.push('/client/pages/cmessage')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white flex items-center justify-between">
        <Link href="/psychotherapist/pages/pmessage" className="text-lg">
          &lt; Back
        </Link>
        <h1 className="text-lg font-semibold">Message</h1>
        <div></div> {/* Placeholder for future elements */}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        {/* Video container with smaller size */}
        <div className="w-[50%] h-[28.125vw] relative" style={{ aspectRatio: '16 / 9' }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        </div>
        <p className="mt-4 text-2xl">The call is about to start in...</p>
        <div className="mt-2">
          <Countdown seconds={5} onComplete={handleCountdownComplete} />
        </div>
      </main>
    </div>
  );
};

export default Page;