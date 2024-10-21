import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Models, Query } from 'appwrite';
import { databases } from '@/appwrite';
import Image from 'next/image';

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
      // Query the Pre-Assessment collection by userID
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
        // Extract all answers from preAssessment documents and combine them into a single array
        const allAnswers = data.flatMap((doc) => doc.answers || []);
  
        // Parse each string into an object with properties
        const parsedAnswers = allAnswers.map((answerString) => {
          // Assuming the string is formatted like: "Question: ..., Answer Int: ..., Answer: ..."
          const questionMatch = answerString.match(/Question: (.*?), Answer Int:/);
          const answerIntMatch = answerString.match(/Answer Int: (\d+), Answer:/);
          const answerStrMatch = answerString.match(/Answer: (.*)/);
  
          return {
            question: questionMatch ? questionMatch[1] : 'No question text available',
            answerInt: answerIntMatch ? parseInt(answerIntMatch[1], 10) : null,
            answerStr: answerStrMatch ? answerStrMatch[1] : 'No answer provided',
          };
        });
  
        console.log("Parsed pre-assessment answers:", parsedAnswers);
        setPreAssessmentAnswers(parsedAnswers);
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
  

  if (!isOpen) return null;

  const handleAccept = async () => {
    try {
      await axios.post('/api/accept', { clientId, score });
      alert('Client accepted');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefer = async () => {
    try {
      await axios.post('/api/refer', { clientId });
      alert('Client referred');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-600 bg-opacity-50 flex justify-center items-center z-50">
      {loading ? (
        <div className="bg-white rounded-full p-6">
          <Image src={'/gifs/load.gif'} alt={'loading'} width={250} height={250} className='rounded-full' />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg w-[600px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {clientData?.firstname}'s Answers
            </h2>
            <button onClick={onClose} className="text-blue-400 hover:text-blue-600">
              &#10005;
            </button>
          </div>

          {/* Scrollable container for questions and answers */}
          <div className="max-h-80 overflow-y-auto mb-4">
            {preAssessmentAnswers.length > 0 ? (
              preAssessmentAnswers.map((item, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Question {index + 1}:</label>
                  <p className="mt-1 text-gray-500">{item.question || 'No question text available'}</p>
                  <p className="mt-1 text-gray-500 font-semibold">Answer (Int) {item.answerInt !== null ? item.answerInt : 'No integer answer provided'}: {item.answerStr || 'No answer provided'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No answers available.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-800" onClick={handleRefer}>
              Refer
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={handleAccept}>
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPreAssModal;
