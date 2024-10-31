'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/preassessment/data/questions';
import { databases, account, ID, Query, client } from '@/appwrite';
import { useRouter } from 'next/navigation';

const DATABASE_ID = 'Butterfly-Database';
const COLLECTION_ID_PREASSESSMENT = 'Pre-Assessment';
const COLLECTION_ID_CLIENT = 'Client';

type Answer = {
  question: string;
  answerInt: number;
  answerStr: string;
};

export const useAssessment = (questions: Question[] = []) => {
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalType, setModalType] = useState<'confirmation' | 'error' | 'success'>('confirmation');
  const [isModalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [clientID, setClientID] = useState<string>('');
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserName(user.name);

        // Fetch the Client Collection document using the user ID
        const client = await databases.listDocuments('Butterfly-Database', 'Client', [
          Query.equal('userid', user.$id),
        ]);

        if (client.documents.length > 0) {
          // Assuming you want the first match
          const clientDocument = client.documents[0];
          setClientID(clientDocument.$id);
          console.log('This is the Client ID', setClientID)
        } else {
          console.log('No client document found for this user.');
        }
      } catch (error) {
        console.error('Error fetching user data or client document:', error);
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
      // Transform the answers array to include question, answer string, and answer integer
      const transformedAnswers = answers.map((answer) => 
        `Question: ${answer.question}, Answer Int: ${answer.answerInt}, Answer: ${answer.answerStr || answer.answerInt}`
      );
  
      // Store the transformed answers as an array of strings
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID_PREASSESSMENT,
        ID.unique(),
        {
          userID: clientID,
          userName,
          answers: transformedAnswers, // Pass the transformed array
          date: new Date().toISOString(),
        }
      );
  
      try {
        // Update the state attribute of the client document to "evaluate"
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTION_ID_CLIENT,
          clientID,
          { state: 'evaluate' }
        ); 
  
        setModalMessage('Your answers have been submitted successfully');
        setModalType('success');
        setModalOpen(true);
      } catch (error) {
        setModalMessage(`Error updating client state: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setModalType('error');
        setModalOpen(true);
      }
    } catch (error) {
      setModalMessage(`Error submitting answers: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setModalType('error');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    if (modalType === 'success') {
      setModalOpen(false);
      router.push('../../client');
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
