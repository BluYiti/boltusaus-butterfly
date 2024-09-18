'use client';

import React from 'react';
import Question from '@/app/preassessment/components/Question';
import NavigationButtons from '@/app/preassessment/components/NavigationButtons';
import { useAssessment } from '@/app/preassessment/hooks/useAssessment';
import { questions } from '@/app/preassessment/data/questions';
import BubbleAnimation from '@/app/preassessment/components/BubbleAnimation';
import '@/app/login/styles/login.css';
import router from 'next/router';

export default function PreAssessmentPage() {
  const {
    currentQuestionIndex,
    answers,
    email,
    setEmail,
    handleSelectOption,
    handleNext,
    handleBack,
    handleSubmit,
  } = useAssessment(questions || []);

  const handleFormSubmit = () => {
    handleSubmit(email);
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
                className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full text-black"
                placeholder="Enter your email"
              />
            </div>
          )}


          <NavigationButtons
            onBack={handleBack}
            onNext={currentQuestionIndex < questions.length - 1 ? handleNext : handleFormSubmit}
            showBack={currentQuestionIndex > 0}
          />
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
            onClick={() => router.push('/register')}
          >
            HOME
          </button>
        </div>
      )}

      <BubbleAnimation />
    </div>
  );
}
