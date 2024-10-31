// ParentComponent.tsx
import React, { useState } from 'react';
import CountdownModal from './CountdownModal'; // Adjust import path as necessary
import CallModal from './CallModal'; // Adjust import path as necessary

const ParentComponent: React.FC = () => {
  const [isCountdownOpen, setCountdownOpen] = useState(true);
  const [isCallOpen, setCallOpen] = useState(false);

  const handleCountdownComplete = () => {
    setCountdownOpen(false);
    setCallOpen(true);
  };

  return (
    <div>
      <CountdownModal
        isOpen={isCountdownOpen}
        onClose={() => setCountdownOpen(false)}
        onComplete={handleCountdownComplete}
        seconds={5} // Set your countdown duration here
      />
      <CallModal
        isOpen={isCallOpen}
        onClose={() => setCallOpen(false)}
        clientName="John Doe" // Replace with the actual client name
      />
    </div>
  );
};

export default ParentComponent;
