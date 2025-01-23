'use client';

import React, { useState, useEffect } from 'react';
import Question from '@/preassessment/components/Question';
import NavigationButtons from '@/preassessment/components/NavigationButtons';
import { useAssessment } from '@/preassessment/hooks/useAssessment';
import { questions } from '@/preassessment/data/questions';
import BubbleAnimation from '@/components/BubbleAnimation';
import SubmissionModal from '@/preassessment/components/Submission';
import useAuthCheck from '@/auth/page';
import LoadingScreen from '@/components/LoadingScreen';
import { account } from '@/appwrite';
import { fetchClientId, hasPreAssessment } from '@/hooks/userService';

export default function PreAssessmentPage() {
  const authLoading = useAuthCheck(['client']); // Call the useAuthCheck hook
  const [dataLoading, setDataLoading] = useState(true); // State to track if data is still loading
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
  } = useAssessment(questions || []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReviewPage = currentQuestionIndex === questions.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get(); // Get user information
        const hasPreAssessmentResult = await hasPreAssessment(await fetchClientId(user.$id));
        
        // If pre-assessment exists, redirect
        if (hasPreAssessmentResult) {
          window.location.replace("/client");
          return; // Ensure that no further code executes after redirect
        } else {
          setDataLoading(false); // Data is loaded, proceed to render the assessment
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setDataLoading(false); // In case of error, set dataLoading to false to allow rendering
      }
    };
  
    fetchData();
  }, []); // Empty dependency array ensures this runs only on component mount  

  const handleBackButton = () => {
    setIsSubmitting(false);
    handleBack();
  }

  const handleSubmit = () => {
    setIsSubmitting(true);
    handleFormSubmit(); // Proceed with the existing form submission logic
  };

  if (authLoading || dataLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-500">
      {isReviewPage ? (
        <div className="text-center rounded-xl p-8 w-full max-w-3xl">
          <h3 className="text-4xl font-extrabold mb-4 text-white">Review Your Answers</h3>

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
              className="flex-1 bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-800"
              onClick={handleBackButton}
            >
              Back
            </button>
            <button
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700"
              onClick={handleSubmit} // Now this triggers the submission logic
              disabled={isSubmitting} // Disable the button while submitting
            >
              {isSubmitting ? "Submitting..." : "Submit"}
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
