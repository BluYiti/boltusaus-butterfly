'use client';

import { useState } from 'react';
import { Question } from '@/app/preassessment/data/questions';


export const useAssessment = (questions: Question[] = []) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(null));

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

  return {
    currentQuestionIndex,
    answers,
    handleSelectOption,
    handleNext,
    handleBack,
    isAllAnswered: answers.every((answer) => answer !== null), 
  };
};
