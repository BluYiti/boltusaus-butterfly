"use client"

import React from "react";
import BubbleAnimation from '@/../components/BubbleAnimation';
import { useRouter } from 'next/navigation';

const App: React.FC = () => {

  const router = useRouter();
  
  return (
    <div className="text-black min-h-screen bg-blue-500">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-white shadow z-50">
        <div className="text-2xl font-bold">Butterfly</div>
        <ul className="flex space-x-10">
          <li>
            <a
              href="#about"
              className="text-[#20206b] font-bold relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
              onClick={() => router.push('/About')}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#blog"
              className="text-[#20206b] font-bold relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
              onClick={() => router.push('/Frequently Asked Questions')}
            >
              Frequently Asked Questions
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-[#20206b] font-bold relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
              onClick={() => router.push('/Contact Us')}
            >
              Contact Us
            </a>
          </li>
        </ul>
        <button className="relative inline-flex items-center justify-start overflow-hidden font-medium transition-all bg-blue-600 text-white rounded py-2 px-4 group"
        onClick={() => router.push('/auth/login')}
        >
        <span className="absolute inset-0 w-full h-full bg-blue-500 transform translate-x-full transition duration-300 ease-out group-hover:translate-x-0"></span>
        <span className="relative w-full text-left transition-colors duration-300 ease-in-out group-hover:text-white">Login</span>
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-cover bg-center h-96 mt-16" style={{ backgroundImage: `url('/images/background.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">We Help You To Heal Yourself</h1>
            <p className="mt-4">Discover pathways to mental well-being and personal growth.</p>
            <button className="relative inline-block font-medium group mt-6"
            onClick={() => router.push('/auth/register')}
            >
              <span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 bg-blue-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full bg-white border-[#38B6FF] group-hover:bg-[#87CEFA]"></span>
              <span className="relative font-bold text-[#000000] px-6 py-3 rounded">Get Started</span>
            </button>
          </div>
        </div>
      </header>

{/* Services Section */}
<section id="services" className="py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        { title: 'Counseling and Psychotherapy', description: 'Professional guidance to navigate personal challenges.' },
        { title: 'Forensic Purposes', description: 'Abuse, Adoption, and Annulment cases.' },
        { title: 'Clinical Purposes', description: 'Depression, Anxiety, and other diagnoses.' },
        { title: 'Industrial Purposes', description: 'Pre-employment and Promotion.' },
        { title: 'Academic Purposes', description: 'Neurodevelopmental disorders, and Learning Disabilities.' },
        { title: 'Training, Research and Consultancy', description: 'Seminars, workshops, and program development and test administration.' }
      ].map((service, index) => (
        <div
          key={index}
          className="bg-gradient-to-r from-[#38B6FF] to-[#87CEFA] p-6 shadow rounded transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-[#87CEFA] hover:to-[#38B6FF]"
        >
          <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
          <p className="text-white">{service.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  {/* Team Section */}
     <section id="team" className="py-12 bg-gray-100">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
    <div className="border bg-blue-50 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { name: 'Maam Angelica Peralta', title: 'Senior Psychotherapist', specialty: 'Specializes in counseling and psychotherapy.' },
          { name: 'Maam Name of Junior Psych', title: 'Junior Psychotherapist', specialty: 'Assists on counseling and therapy.' },
          { name: 'Maam Name of Associate', title: 'Clinic Associate', specialty: 'Works on the appointment scheduling and client management.' },
          { name: 'Maam Name of Associate 2', title: 'Clinic Associate', specialty: 'Handles the social media page and reports.' }
        ].map((teamMember, index) => (
          <div 
            key={index} 
            className="bg-white p-6 shadow rounded transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-2">{teamMember.name}</h3>
            <p className="text-gray-500">{teamMember.title}</p>
            <p className="text-gray-600 mt-2">{teamMember.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

 {/* Info Section */}
      <section id="insights" className="py-12">
        <div className="container mx-auto px-4">
          {/* Title with a border line */}
          <h2 className="text-3xl font-bold text-center mb-8 border-b-4 border-[#B3EBF2] inline-block pb-2">
            How does Butterfly work?
          </h2>

        {/* Info list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Create your Account', description: 'Login or register to access our services.' },
              { title: 'Answer the Pre-assessment Form', description: 'Choose your answers to determine your suitability for our services.' },
              { title: 'Wait for your Evaluation Result', description: 'The psychotherapist will evaluate your pre-assessment form before you get accepted or referred to other services.' },
              { title: 'Set your Appointment', description: 'Choose your preferred Psychotherapist, and date and time for your consultation.' },
              { title: 'Pay your Session Fee', description: 'Choose your payment method and pay for your upcoming session.' },
              { title: 'Start with Therapy', description: 'Explore effective self-care strategies, and communicate with our experts to enhance your well-being.' }
            ].map((insight, index) => (
              <div 
                key={index} 
                className="bg-white p-6 shadow rounded transition-all duration-300 relative overflow-hidden group"
              >
                  <div className="absolute inset-0 bg-[#B3EBF2] transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></div>
                  <div className="relative z-10">
                    {/* Subtitle with a border line */}
                    <h3 className="text-xl font-semibold mb-2 border-b-2 border-white pb-1">{insight.title}</h3>
                    <p className="text-gray-600 mt-2">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>

  {/* Schedule Visit Section */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Schedule Your Appointment</h2>
          <p className="text-gray-600 mb-6">Take the first step towards better mental health. Book your appointment with our experts today.</p>
        </div>
      </section>

   {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>&copy; 2024 Butterfly: AM Peralta Psychological Wellness System</p>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Privacy</a></li>
            <li><a href="#" className="hover:underline">Terms</a></li>
          </ul>
        </div>
      </footer>
      <BubbleAnimation />
    </div>
  );
};

export default App;
