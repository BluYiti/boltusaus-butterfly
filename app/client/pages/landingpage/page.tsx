'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleTherapyClick = () => {
    router.push('/therapy');
  };

  const handlePsychiatryClick = () => {
    router.push('/psychiatry');
  };

  return (
    <div className="min-h-screen bg-blue-100 p-10">
      <div className="text-center">
        <h1 className="text-teal-800 text-4xl font-bold mb-4">
          How therapy and psychiatry work together
        </h1>
        <p className="text-teal-600 mb-8">
          We make both types of mental health care convenient and affordable, with no outside referrals required.
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {/* Therapy Section */}
        <div 
          className="bg-white shadow-lg p-6 rounded-lg text-center cursor-pointer transition transform hover:scale-105" 
          onClick={handleTherapyClick}
        >
          <Image
            src="/images/therapist.png" // Replace this with the correct image path
            alt="Therapy"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">Therapy</h2>
          <p className="text-gray-700">
            Depending on your therapy goals, our therapist will help you process thoughts, understand your motivations, and develop coping strategies. You'll connect through live sessions or messaging.
          </p>
        </div>

        {/* Psychiatry Section */}
        <div 
          className="bg-white shadow-lg p-6 rounded-lg text-center cursor-pointer transition transform hover:scale-105" 
          onClick={handlePsychiatryClick}
        >
          <Image
            src="/images/psychiatrist.png" // Replace this with the correct image path
            alt="Psychiatry"
            width={200}
            height={200}
            className="rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">Psychiatry</h2>
          <p className="text-gray-700">
            Our psychiatrist can prescribe and manage medications to help you reach your goals, working alongside your therapist.
          </p>
        </div>
      </div>
    </div>
  );
}
