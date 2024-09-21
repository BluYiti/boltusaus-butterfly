'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/app/preassessment/data/questions';
import { databases, account, ID } from '@/app/appwrite';
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
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalType, setModalType] = useState<'confirmation' | 'error' | 'success'>('confirmation');
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>(''); // Store the user's name
  const [userID, setUserID] = useState<string>(''); // Store the user's ID
  const router = useRouter();

  // Fetch the current authenticated user's name and ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get(); // Get the logged-in user
        setUserName(user.name); // Save the user's name
        setUserID(user.$id); // Save the user's ID (correct field name)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

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

  const handleFormSubmit = () => {
    if (answers.some((answer) => answer === null)) {
      setModalMessage('Please answer all questions before submitting.');
      setModalType('error');
      setModalOpen(true);
      return;
    }

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
          userID, // Ensure that "userID" is passed correctly
          userName, // Ensure that "userName" is passed correctly
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
      router.push('/auth/login');
    } else {
      setModalOpen(false);
    }
  };

  return {
    currentQuestionIndex,
    answers,
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
