import React from 'react';
import { FaUserCircle, FaBars, FaHeart } from 'react-icons/fa';

const categories = [
  {
    title: "Wellness",
    items: [
      { name: "Yoga", time: "10 mins", description: "Find balance, strength, and serenity on the mat.", img: "/images/reading1.jpg" },
      { name: "Goals", time: "10 mins", description: "Track your goals.", img: "/images/reading3.jpg" },
      { name: "Workout", time: "10 mins", description: "Stay fit and healthy.", img: "/images/reading3.jpg" },
      { name: "Swimming", time: "10 mins", description: "Flow with the water.", img: "/images/reading1.jpg" },
    ]
  },
  {
    title: "Worklife",
    items: [
      { name: "Reading", time: "5 mins", description: "Mental Health at work: How to improve it?", img: "/images/reading1.jpg" },
      { name: "Drawing", time: "3 mins", description: "Express yourself with art.", img: "/images/reading3.jpg" },
      { name: "Take time off", time: "5 mins", description: "It is okay to rest.", img: "/images/reading3.jpg" },
      { name: "Contemplate", time: "3 mins", description: "Reflect and learn.", img: "/images/reading1.jpg" }
    ]
  },
];

const App = () => {
  return (
    <div className="text-black min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <FaUserCircle size={30} />
        <h1 className="text-lg font-bold">Home</h1>
        <FaBars size={25} />
      </header>

      {/* Content */}
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Explore</h2>

        {categories.map((category) => (
          <section key={category.title}>
            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {category.items.map((item) => (
                <div key={item.name} className="relative bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                  <img src={item.img} alt={item.name} className="w-full h-32 object-cover rounded-t-lg" />
                  <div className="p-3">
                    <h4 className="text-md font-bold">{item.name}</h4>
                    <p className="text-sm">{item.time}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <button className="absolute top-2 right-2 p-1 bg-white rounded-full">
                    <FaHeart className="text-gray-500 hover:text-red-500 transition-colors duration-200" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default App;
