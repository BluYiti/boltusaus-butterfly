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
  const [email, setEmail] = useState<string>(''); // Collect email
  const [modalMessage, setModalMessage] = useState<string>(''); // Message to display in modal
  const [modalType, setModalType] = useState<'confirmation' | 'error' | 'success'>('confirmation'); // Modal type
  const [isModalOpen, setModalOpen] = useState(false); // Control modal open/close state
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
    if (currentQuestionIndex === questions.length) {
      return;
    } else if (currentQuestionIndex < questions.length) {
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

  const handleFormSubmit = () => {
    // Validate all questions and email
    if (answers.some((answer) => answer === null)) {
      setModalMessage('Please answer all questions before submitting.');
      setModalType('error');
      setModalOpen(true);
      return;
    }

    if (!validateEmail(email)) {
      setModalMessage('Please enter a valid email address.');
      setModalType('error');
      setModalOpen(true);
      return;
    }

    // Open confirmation modal
    setModalMessage('Are you sure you want to submit your answers?');
    setModalType('confirmation');
    setModalOpen(true);
  };

  const confirmSubmit = async () => {
    try {
      const serializedAnswers = JSON.stringify(answers);

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          email,
          answers: serializedAnswers,
          date: new Date().toISOString(),
        }
      );

      setModalMessage('Your answers have been submitted successfully.');
      setModalType('success');
      setModalOpen(true);
    } catch (error) {
      setModalMessage(`Error submitting answers: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setModalType('error');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    if (modalType === 'success') {
      setModalOpen(false);
      router.push('/register');
    } else {
      setModalOpen(false);
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
    handleFormSubmit,
    confirmSubmit,
    isModalOpen,
    modalMessage,
    modalType,
    closeModal,
    isAllAnswered: answers.every((answer) => answer !== null),
  };
};
