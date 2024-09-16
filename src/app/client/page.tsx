import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center bg-blue-500 p-4 rounded-lg">
        <h1 className="text-white text-xl">Home</h1>
        <button className="text-white text-2xl">&#9776;</button>
      </header>

      <section className="my-4">
        <h2 className="text-lg font-bold text-black">Good Morning, Raianna!</h2>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upcoming Sessions */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold mb-4 text-black">Upcoming Sessions</h3>
          <div className="flex items-center mb-4">
            <div className="w-4 h-4 bg-green-400 rounded-full mr-4"></div>
            <div>
              <p className="font-bold text-black">April 25, 2024</p>
              <p className="text-sm text-gray-600">8:00 AM</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-4 h-4 bg-red-400 rounded-full mr-4"></div>
            <div>
              <p className="font-bold text-black">May 2, 2024</p>
              <p className="text-sm text-gray-600">10:00 AM</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full mr-4"></div>
            <div>
              <p className="font-bold text-black">May 9, 2024</p>
              <p className="text-sm text-gray-600">1:00 PM</p>
            </div>
          </div>
        </div>

        {/* Weekly Check-up */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold mb-4 text-black">Weekly Check-up</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="public\images\wellbeing.png" // Replace with the correct image path
                alt="Weekly Check-up"
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <p className="font-bold text-black">Weekly well-being check up</p>
              </div>
            </div>
            <button className="py-2 px-4 bg-blue-500 text-white rounded-lg">
              START
            </button>
          </div>
        </div>

        {/* Journal */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-bold mb-4 text-black">Journal</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="path_to_your_image" // Replace with the correct image path
                alt="Journal"
                className="h-12 w-12 rounded-full"
              />
              <div className="ml-4">
                <p className="font-bold text-black">Raianna’s Journal</p>
              </div>
            </div>
            <button className="py-2 px-4 bg-blue-500 text-white rounded-lg">
              TRACK
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-blue-500 p-4 flex justify-around">
        <button className="text-white text-2xl">&#x1F3E0;</button>
        <button className="text-white text-2xl">&#128104;&#8205;&#x1F4BB;</button>
        <button className="text-white text-2xl">&#128081;</button>
        <button className="text-white text-2xl">&#x1F4C8;</button>
      </footer>
    </div>
  );
}
