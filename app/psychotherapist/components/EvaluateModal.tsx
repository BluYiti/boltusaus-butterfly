import React, { useEffect, useState } from 'react';
import { Models, Query } from 'appwrite';
import { databases } from '@/appwrite';
import Image from 'next/image';
import AcceptClient from '../hooks/handleAcceptClient';
import ReferClient from '../hooks/handleReferClient';

interface ReviewPreAssModalProps {
  clientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewPreAssModal: React.FC<ReviewPreAssModalProps> = ({ clientId, isOpen, onClose }) => {
  const [clientData, setClientData] = useState<Models.Document | null>(null);
  const [preAssessmentAnswers, setPreAssessmentAnswers] = useState<{ question: string; answerStr: string; answerInt: number | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showReferModal, setShowReferModal] = useState(false);

  const fetchClientData = async (id: string) => {
    try {
      const clientData = await databases.getDocument('Butterfly-Database', 'Client', id);
      return clientData;
    } catch (err: unknown) {
      console.error("Error fetching client data:", err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Unknown error occurred");
    }
  };

  const fetchPreAssessment = async (id: string) => {
    try {
      const preAssessmentResponse = await databases.listDocuments('Butterfly-Database', 'Pre-Assessment', [
        Query.equal('userID', id),
      ]);
      return preAssessmentResponse.documents;
    } catch (err: unknown) {
      console.error("Error fetching pre-assessment data:", err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Unknown error occurred");
    }
  };

  useEffect(() => {
    if (!isOpen || !clientId) return;

    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await fetchClientData(clientId);
        setClientData(response);
      } catch (err) {
        setError("Error fetching client");
        console.error('Error fetching client data:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPreAssessmentAnswers = async () => {
      try {
        setLoading(true);
        const data = await fetchPreAssessment(clientId);
        
          // Check the number of documents
          if (data.length > 1) {
            setError("Multiple pre-assessment documents found");

            setTimeout(() => {
              window.location.reload();
            }, 3000);

            return; // Exit early
          }
        
        const allAnswers = data.flatMap((doc) => doc.answers || []);
        const parsedAnswers = allAnswers.map((answerString) => {
          const questionMatch = answerString.match(/Question: (.*?), Answer Int:/);
          const answerIntMatch = answerString.match(/Answer Int: (\d+), Answer:/);
          const answerStrMatch = answerString.match(/Answer: (.*)/);

          return {
            question: questionMatch ? questionMatch[1] : 'No question text available',
            answerInt: answerIntMatch ? parseInt(answerIntMatch[1], 10) : null,
            answerStr: answerStrMatch ? answerStrMatch[1] : 'No answer provided',
          };
        });

        setPreAssessmentAnswers(parsedAnswers);
        calculateTotalScore(parsedAnswers);
      } catch (err: unknown) {
        console.error("Error fetching pre-assessment data:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
    fetchPreAssessmentAnswers();
  }, [clientId, isOpen]);

  const calculateTotalScore = (answers: { question: string; answerStr: string; answerInt: number | null }[]) => {
    const totalScore = answers.reduce((acc, answer) => {
      return acc + (answer.answerInt || 0);
    }, 0);
    setScore(totalScore);
  };

  if (!isOpen) return null;

  const handleAccept = () => {
    setShowAcceptModal(true); // Show the AcceptClient modal
  };

  const handleRefer = async () => {
    setShowReferModal(true); // Show the AcceptClient modal
  };

  return (
    <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-20">
      {loading ? (
        <div className="bg-white rounded-xl p-6">
          <Image src={'/gifs/load.gif'} alt={'loading'} width={250} height={250} className='rounded-full' />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-xl w-3/6 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold font-poppins">
              {clientData?.firstname}&apos;s Answers
            </h2>
            <button onClick={onClose} className="text-blue-400 hover:text-blue-600">
              &#10005;
            </button>
          </div>

          <div className="flex border-t mt-2 border-blue-400">
            <div className="p-4 border-r border-blue-400">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Summary</h3>
              <ul>
                {preAssessmentAnswers.map((item, index) => (
                  <li key={index} className="grid grid-cols-2">
                    <span className="font-bold text-blue-400">Q{index + 1}:</span>
                    <span>{item.answerInt !== null ? item.answerInt : 'N/A'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Full Pre-Assessment Questionnaire</h3>
              <div className="max-h-[22rem] overflow-y-auto">
                {preAssessmentAnswers.length > 0 ? (
                  preAssessmentAnswers.map((item, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-l font-semibold text-black">Question {index + 1}:</label>
                      <p>{item.question || 'No question text available'}</p>
                      <p className="mt-1 font-semibold underline">Answer ({item.answerInt !== null ? item.answerInt : 'No integer answer provided'}): {item.answerStr || 'No answer provided'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No answers available.</p>
                )}
              </div>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700">Total Score:</label>
          <div className="mb-4 flex">
            <input
              type="number"
              value={score}
              readOnly
              className="mt-1 block w-[80%] px-3 py-2 border border-gray-300 rounded-md"
            />
            <button className="ml-2 px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-800" onClick={handleRefer}>
              Refer
            </button>
            <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={handleAccept}>
              Accept
            </button>
          </div>
        </div>
      )}

      {showAcceptModal && (
        <AcceptClient clientId={clientId} score={score} showModal={showAcceptModal} setShowModal={setShowAcceptModal} />
      )}
      {showReferModal && (
        <ReferClient clientId={clientId} score={score} showModal={showReferModal} setShowModal={setShowReferModal} />
      )}
    </div>
  );
};

export default ReviewPreAssModal;
