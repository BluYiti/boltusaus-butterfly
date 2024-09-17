import React from 'react';

interface Option {
  label: string;
  value: number;
}

interface QuestionProps {
  text: string;
  options: Option[];
  currentAnswer: number | null;
  handleSelectOption: (value: number) => void;
}

const Question: React.FC<QuestionProps> = ({ text, options, currentAnswer, handleSelectOption }) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl text-blue-900 mb-4">{text}</h3>
      <div className="flex flex-col items-center">
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full py-3 px-5 rounded-lg mb-3 transition-colors ease-in-out flex justify-between items-center 
                ${currentAnswer === option.value ? 'bg-blue-500 text-white' : 'bg-white text-blue-900 hover:bg-blue-900 hover:text-blue-500'} 
                focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-600`}              
            onClick={() => handleSelectOption(option.value)}
          >
            {option.label}
            <span className="font-bold bg-blue-300 text-teal-800 rounded-md py-1 px-3">
              {option.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
