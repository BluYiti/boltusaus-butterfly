import React from 'react';

interface ResourceCardProps {
  category: string;
  resources: {
    title: string;
    duration: string;
    description: string;
    imageSrc: string;
    isUploaded?: boolean;
  }[];
}

const ResourceCard: React.FC<ResourceCardProps> = ({ category, resources }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="relative bg-gray-100 rounded-lg shadow-md p-4">
            {/* Image */}
            <div className="relative">
              {resource.isUploaded ? (
                <div className="bg-gray-200 flex items-center justify-center h-32 rounded-lg">
                  <button className="bg-gray-500 text-white rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16m-7 7l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <img src={resource.imageSrc} alt={resource.title} className="w-full h-32 rounded-lg object-cover" />
              )}
              {/* Like Icon */}
              <div className="absolute top-2 right-2">
                <button className="bg-white p-1 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Resource Information */}
            <div className="mt-4">
              <h3 className="text-md font-semibold">{resource.title}</h3>
              <p className="text-sm text-gray-600">{resource.duration}</p>
              <p className="text-sm text-gray-500">{resource.description}</p>
            </div>
            {/* Trash Icon */}
            <div className="absolute bottom-2 right-2">
              <button className="bg-gray-500 text-white p-2 rounded-full shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResourceList: React.FC = () => {
  const wellnessResources = [
    { title: 'Yoga', duration: '10 mins', description: 'Find balance, strength, and serenity on the mat.', imageSrc: '/images/yoga.jpg' },
    { title: 'Journaling', duration: '10 mins', description: 'Journal your journey.', imageSrc: '/images/journaling.jpg' },
    { title: 'Workout', duration: '10 mins', description: 'Stay fit and healthy.', imageSrc: '/images/workout.jpg' },
    { title: 'Upload resource', duration: '', description: '', imageSrc: '', isUploaded: true },
  ];

  const worklifeResources = [
    { title: 'Reading', duration: '5 mins', description: 'Mental Health at work: How to improve it?', imageSrc: '/images/reading.jpg' },
    { title: 'Drawing', duration: '3 mins', description: 'Express yourself with art.', imageSrc: '/images/drawing.jpg' },
    { title: 'Take time off', duration: '5 mins', description: 'It is okay to rest.', imageSrc: '/images/takeoff.jpg' },
    { title: 'Upload resource', duration: '', description: '', imageSrc: '', isUploaded: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ResourceCard category="Wellness" resources={wellnessResources} />
      <ResourceCard category="Worklife" resources={worklifeResources} />
    </div>
  );
};

export default ResourceList;
