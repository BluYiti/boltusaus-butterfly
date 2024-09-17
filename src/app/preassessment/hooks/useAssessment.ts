'use client';

import { useState } from 'react';
import { Question } from '@/app/preassessment/data/questions';
import { databases, ID } from '@/app/appwrite'; 
import { useRouter } from 'next/navigation';

const DATABASE_ID = '66e8ed7900302986b2b6'
const COLLECTION_ID = '66e8f17d00267836388d'

export const useAssessment = (questions: Question[] = []) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(null));
  const router = useRouter();  // Use the router for redirection

  const handleSelectOption = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some((answer) => answer === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const confirmSubmit = confirm('Are you sure you want to submit?');
    if (confirmSubmit) {
      try {
       
        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            answers,
            submittedAt: new Date().toISOString(),
          }
        );

        console.log('Document created successfully:', response);

        alert('Your answers have been submitted successfully.');
        router.push('/login');

      } catch (error) {
        console.log('Submitting answers:', answers); 
        console.error('Error submitting answers:', error);
        alert(`There was an error submitting your answers. Error: ${error.message || error}`);
      }
    }
  };

  return {
    currentQuestionIndex,
    answers,
    handleSelectOption,
    handleNext,
    handleBack,
    handleSubmit,
    isAllAnswered: answers.every((answer) => answer !== null),
  };
};
