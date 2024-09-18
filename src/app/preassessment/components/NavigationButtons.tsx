'use client';

import React from 'react';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  showBack: boolean;
  isLastQuestion: boolean;
  nextButtonLabel: string; // Add this new prop
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  showBack,
  isLastQuestion,
  nextButtonLabel, // Receive this prop
}) => {
  return (
    <div className="mt-6 flex justify-between gap-4">
      {showBack && (
        <button
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
          onClick={onBack}
        >
          Back
        </button>
      )}
      <button
        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
        onClick={onNext}
      >
        {nextButtonLabel} {/* Use the dynamic label */}
      </button>
    </div>
  );
};

export default NavigationButtons;
