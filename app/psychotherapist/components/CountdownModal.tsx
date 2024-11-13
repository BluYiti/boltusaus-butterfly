import { FC, useEffect, useState } from 'react';

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

  return (
    <span className="text-5xl font-bold text-black">
      {formatTime(timeLeft)}
    </span>
  );
};

const CountdownModal: FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void; seconds: number }> = ({
  isOpen,
  onClose,
  onComplete,
  seconds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md">
        <h1 className="text-lg font-semibold text-center text-gray-800">The call will start in...</h1>
        <div className="flex justify-center mt-4">
          <Countdown seconds={seconds} onComplete={onComplete} />
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-blue-500 text-white font-bold py-2 rounded-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CountdownModal;
