import React, { useEffect, useState } from 'react';
import { databases } from '@/app/appwrite';
import { Query } from 'appwrite';

interface FetchPreAssessmentDetailsProps {
  userID: string;
}

interface Answer {
  question: string;
  answerInt: number;
  answerStr: string;
}

const FetchPreAssessmentDetails: React.FC<FetchPreAssessmentDetailsProps> = ({ userID }) => {
  const [preAssessmentData, setPreAssessmentData] = useState<Answer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreAssessment = async () => {
      try {
        // Check if userID exists and is valid
        if (!userID || userID.trim() === '') {
          throw new Error('Invalid userID');
        }
    
        // API request to fetch pre-assessment data
        const response = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID!,
          process.env.NEXT_PUBLIC_COLLECTION_ID!,
          [Query.equal('userID', userID)]
        );
    
        if (response.documents.length > 0) {
          const serializedAnswers = response.documents[0]?.answers;
          if (serializedAnswers) {
            const deserializedAnswers = JSON.parse(serializedAnswers);
            setPreAssessmentData(deserializedAnswers);
          } else {
            setError('No answers found.');
          }
        } else {
          setError('No documents found for this user.');
        }
      } catch (err) {
        console.error('Error fetching pre-assessment:', err);
        setError('Failed to fetch pre-assessment data.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchPreAssessment();
  }, [userID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Pre-Assessment Answers for {userID}</h2>
      <ul>
        {preAssessmentData.map((answer, index) => (
          <li key={index}>
            <strong>{answer.question}</strong>: {answer.answerStr} (Score: {answer.answerInt})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchPreAssessmentDetails;
