'use client';

import { useState } from 'react';
import { Question } from '@/app/preassessment/data/questions';
import { databases, ID } from '@/app/appwrite'; 
import { useRouter } from 'next/navigation';

const DATABASE_ID = 'Butterfly-Database'; 
const COLLECTION_ID = 'Pre-Assessment'; 

export const useAssessment = (questions: Question[] = []) => {
  type Answer = {
    question: string;
    answerInt: number;
    answerStr: string;
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [email, setEmail] = useState<string>(''); 
  const router = useRouter(); 

  const handleSelectOption = (value: number) => {
    const selectedOption = questions[currentQuestionIndex].options.find(option => option.value === value);

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      question: questions[currentQuestionIndex].text,
      answerInt: value,
      answerStr: selectedOption ? selectedOption.label : '',
    };
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

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (email: string) => {
    if (answers.some((answer) => answer === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const confirmSubmit = confirm('Are you sure you want to submit?');
    if (confirmSubmit) {
      try {
        const serializedAnswers = JSON.stringify(answers);

        const response = await databases.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            email,
            answers: serializedAnswers,
            date: new Date().toISOString(), 
          }
        );

        console.log('Document created successfully:', response);
        alert('Your answers have been submitted successfully.');
        router.push('/register');
      } catch (error) {
        console.error('Error submitting answers:', error);
        alert(`There was an error submitting your answers. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return {
    currentQuestionIndex,
    answers,
    email,
    setEmail, 
    handleSelectOption,
    handleNext,
    handleBack,
    handleSubmit,
    isAllAnswered: answers.every((answer) => answer !== null),
  };
};
