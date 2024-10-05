import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
    const router = useRouter();

    return (
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 p-3 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
        aria-label="Go back"
      >
        <FaArrowLeft className="text-gray-700" />
      </button>
    );
};

export default BackButton;
