'use client';

import React, { useState } from 'react';
import Question from '@/app/preassessment/components/Question';
import { useAssessment } from '@/app/preassessment/hooks/useAssessment';
import { questions } from '@/app/preassessment/data/questions';
import router from 'next/router';

export default function PreAssessmentPage() {
  const {
    currentQuestionIndex,
    answers,
    handleSelectOption,
    handleNext,
    handleBack,
    handleSubmit,
  } = useAssessment(questions || []);

  // Email state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // This function will now be called on button click and it uses the `email` from the state
  const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); // Prevent the default form action
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(''); // Clear the error if the email is valid
    handleSubmit(email); // Call handleSubmit from the hook, passing the email
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      {currentQuestionIndex < questions.length ? (
        <div className="bg-blue-100 text-center rounded-xl p-8 shadow-lg w-full max-w-lg">
          <div className="mb-4 text-left">
            <h2 className="text-sm text-gray-700">
              {currentQuestionIndex + 1}/{questions.length} Questions answered
            </h2>
          </div>
          <Question
            text={questions[currentQuestionIndex].text}
            options={questions[currentQuestionIndex].options}
            currentAnswer={answers[currentQuestionIndex]?.answerInt ?? null}
            handleSelectOption={handleSelectOption}
          />

          {/* Email input section */}
          {currentQuestionIndex === questions.length - 1 && (
            <div className="mt-4 text-left">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full"
                placeholder="Enter your email"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
          )}

          <div className="mt-6 flex justify-between gap-4">
            {currentQuestionIndex > 0 && (
              <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500"
                onClick={handleFormSubmit} // Updated to use handleFormSubmit
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-green-100 text-center rounded-xl p-8 shadow-lg w-full max-w-lg">
          <div className="mb-4">
            <div className="text-6xl text-green-600 mb-4">&#10004;</div>
            <h3 className="text-xl text-green-800">Thank you for submitting!</h3>
            <p className="text-gray-700 mt-2">Your assessment has been sent!</p>
          </div>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
            onClick={() => router.push('/login')}
          >
            HOME
          </button>
        </div>
      )}
    </div>
  );
}
