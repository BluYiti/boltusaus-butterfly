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
    isAllAnswered,
  } = useAssessment(questions || []);

  const handleFormSubmit = () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (!isValidEmail) {
      alert('Please enter a valid email address.');
      return;
    }

    handleSubmit(email);
  };

  const isReviewPage = currentQuestionIndex === questions.length;

  const nextButtonLabel = isReviewPage ? "Submit" : currentQuestionIndex === questions.length - 1 ? "Review Answers" : "Next";

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      {isReviewPage ? (
        <div className="text-center rounded-xl p-8 shadow-lg w-full max-w-3xl">
          <h3 className="text-xl mb-4 text-gray-800">Review Your Answers</h3>

          <ul className="text-left mb-4 space-y-4">
            {questions.map((question, index) => (
              <li key={index}>
                <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                  <p className="font-bold text-gray-900">{question.text}</p>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option: any, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-2 border rounded-md text-gray-600 ${answers[index]?.answerInt === optIndex ? 'bg-blue-300 border-blue-500' : 'border-gray-500'}`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-left">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm w-full text-black"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500"
              onClick={handleFormSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-100 text-center rounded-xl p-8 shadow-lg w-full max-w-3xl">
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

          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            showBack={currentQuestionIndex > 0}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
            nextButtonLabel={isReviewPage ? "Submit" : currentQuestionIndex === questions.length - 1 ? "Review Answers" : "Next"}
          />
        </div>
      )}

      <BubbleAnimation />
    </div>
  );
}
