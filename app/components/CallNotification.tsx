// CallNotification.tsx
import React from 'react';

interface CallNotificationProps {
  caller: { name: string } | null;
  onAccept: () => void;
}

const CallNotification: React.FC<CallNotificationProps> = ({ caller, onAccept }) => {
  if (!caller) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-70">
      <div className="bg-white shadow-lg rounded-lg p-6 text-center w-3/4 h-1/2 max-w-lg flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">{caller.name} is calling...</h2>
        <div className="flex space-x-4">
          <button
            onClick={onAccept}
            className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
