'use client';

import React, { useState } from 'react';
import Question from '@/preassessment/components/Question';
import NavigationButtons from '@/preassessment/components/NavigationButtons';
import { useAssessment } from '@/preassessment/hooks/useAssessment';
import { questions } from '@/preassessment/data/questions';
import BubbleAnimation from '@/../components/BubbleAnimation';
import SubmissionModal from '@/preassessment/components/Submission';

export default function PreAssessmentPage() {
  const {
    currentQuestionIndex,
    answers,
    handleSelectOption,
    handleNext,
    handleBack,
    handleFormSubmit, // Trigger the modal flow
    confirmSubmit, // Actual submission after confirmation
    isModalOpen, // Controls modal visibility
    modalMessage, // The message to display in the modal
    modalType, // The type of modal (confirmation, error, success)
    closeModal, // Close modal handler
    isAllAnswered,
  } = useAssessment(questions || []);

  const isReviewPage = currentQuestionIndex === questions.length;

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-500">
      {isReviewPage ? (
        <div className="text-center rounded-xl p-8 shadow-lg w-full max-w-3xl">
          <h3 className="text-xl mb-4 text-gray-800">Review Your Answers</h3>

          <ul className="text-left mb-4 space-y-4">
            {questions.map((question, index) => (
              <li key={index}>
                <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
                  <p className="font-bold text-gray-900">{question.text}</p>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option, optIndex) => (
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

          <div className="flex justify-between gap-4 mt-6">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500"
              onClick={handleFormSubmit} // Opens the confirmation modal
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
      
      <SubmissionModal
        isOpen={isModalOpen}
        modalType={modalType}
        message={modalMessage}
        onClose={closeModal}
        onConfirm={modalType === 'confirmation' ? confirmSubmit : undefined}
      />
    </div>
  );
}
