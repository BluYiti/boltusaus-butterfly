'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HealthCondition {
  name: string;
  label: string;
}

const healthConditions: HealthCondition[] = [
  { name: 'anxiety', label: 'Anxiety' },
  { name: 'depression', label: 'Depression' },
  { name: 'anger', label: 'Anger' },
  { name: 'concentration', label: 'Concentration' },
  { name: 'phobia', label: 'Phobia' },
  { name: 'communication', label: 'Communication' },
  { name: 'drugsAlcohol', label: 'Drugs/Alcohol' },
  { name: 'parents', label: 'Parents' },
  { name: 'violence', label: 'Violence' },
  { name: 'sleeping', label: 'Sleeping' },
  { name: 'children', label: 'Child/ren' },
  { name: 'sexualAbuse', label: 'Sexual Abuse' },
  { name: 'nightmares', label: 'Nightmares' },
  { name: 'abuse', label: 'Abuse' },
  { name: 'selfInflictedPain', label: 'Self-inflicted pain' },
  { name: 'financialProblems', label: 'Financial problems' },
  { name: 'headInjury', label: 'Head Injury' },
  { name: 'nausea', label: 'Nausea' },
  { name: 'attention', label: 'Attention' },
  { name: 'trustInOthers', label: 'Trust in others' },
  { name: 'death', label: 'Death' },
  { name: 'brokenBone', label: 'Broken bone' },
  { name: 'gastritis', label: 'Gastritis' },
  { name: 'hepatitis', label: 'Hepatitis' },
  { name: 'tuberculosis', label: 'Tuberculosis' },
  { name: 'hivAids', label: 'HIV/AIDS' },
  { name: 'diabetes', label: 'Diabetes' },
];

export default function HealthConditionsForm() {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const router = useRouter(); // Use the Next.js router

  const handleCheckboxChange = (condition: string) => {
    setSelectedConditions((prevSelected) =>
      prevSelected.includes(condition)
        ? prevSelected.filter((item) => item !== condition)
        : [...prevSelected, condition]
    );
  };

  const handleSubmit = () => {
    console.log('Selected Conditions:', selectedConditions);

    // Redirect to the therapist selection page
    router.push('/client/pages/therapist');
  };

  return (
    <div className="text-black flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-xl">
        <h2 className="text-lg font-bold mb-4">
          Please choose any of the following conditions you have had a health issue with:
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {healthConditions.map((condition) => (
            <label key={condition.name} className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                value={condition.name}
                checked={selectedConditions.includes(condition.name)}
                onChange={() => handleCheckboxChange(condition.name)}
              />
              <span className="ml-2">{condition.label}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="py-2 px-4 bg-blue-500 text-white rounded-lg"
            onClick={handleSubmit}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}
