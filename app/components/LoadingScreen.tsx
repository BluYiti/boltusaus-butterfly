// app/components/LoadingScreen.tsx
import Image from "next/image"; // Import Next.js Image component

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <Image
        src="/gifs/load.gif"
        alt="loadfly"
        width={400} // Increase the width for a larger GIF
        height={400} // Increase the height for a larger GIF
      />
      <h1 className="text-3xl font-bold text-gray-700 mt-4">Loading...</h1>
    </div>
  </div>
);

export default LoadingScreen; // Export the LoadingScreen component
