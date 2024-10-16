'use client'

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import BackToTopButton from './components/BackToTop';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaMap } from 'react-icons/fa';

const navItems = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact Us", href: "#contacts" },
];

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1 },
  }),
};

const aboutVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const bookingSteps = [
  "Click on the 'Book an Appointment' button and follow the steps to register a new account. Make sure to fill out all required fields to complete the registration process.",
  "Once registered, log in with your credentials to access your account and continue the booking process.",
  "Begin the pre-assessment by answering the necessary questions. This will help us better understand your needs and assign the appropriate service.",
  "Wait for your pre-assessment result, which will be available within 1 business day. Once approved, you'll be able to book an appointment with us at your preferred time."
];

const HomePage: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contentType, setContentType] = useState<'terms' | 'privacy'>('terms');

  const openModal = (type: 'terms' | 'privacy') => {
    setContentType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const aboutRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleScroll = () => {
    if (aboutRef.current && !hasAnimated) {
      const rect = aboutRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (isVisible) {
        setHasAnimated(true); // Set to true to trigger the animation
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasAnimated]); // Depend on hasAnimated to avoid unnecessary re-renders

  return (
    <div className='overflow-x-hidden'>
      <BackToTopButton />
      
      {/* Top Section */}
      <section className="relative h-screen flex flex-col justify-center items-start bg-cover bg-center px-4 md:px-8" style={{ backgroundImage: `url('/images/landingbg.png')` }}>
        
        <motion.div
          className="relative z-10 text-left text-white max-w-md ml-4 md:ml-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-paintbrush whitespace-nowrap">Start your Journey</h1>
          <p className="mt-4 text-base md:text-lg">
            We believe that mental health is a collaborative effort. Together, we can navigate the path towards emotional well-being and strength.
          </p>
          <Link href={'/register'}>
            <button className="mt-6 w-full md:w-auto bg-[#2081c3] text-white font-bold py-3 px-6 rounded-full border-2 border-transparent hover:border-[#2081c3] hover:bg-transparent transform hover:scale-110 transition-all duration-300">
              Book an Appointment
            </button>
          </Link>
        </motion.div>

        {/* Butterfly GIF */}
        <motion.img
        src="/gifs/butterfly.gif" 
        alt="Butterfly Animation"
        className="absolute z-20 w-[35rem] h-[35rem] 2xl:right-[14rem] 3xl:right-[22rem]" 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Centered Navbar */}
        <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-white">
          {navItems.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="hover:text-gray-400"
              initial="hidden"
              animate="visible"
              variants={navVariants}
              custom={index}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        {/* Right Side Butterfly Header */}
        <h2 className="absolute top-4 left-4 text-white text-2xl md:text-3xl font-bold">Butterfly</h2>

        {/* Adjusted Login Button */}
        <div className="absolute top-4 right-4">
          <Link href={"/login"}>
            <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700'>
              Login
            </button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-8 md:py-32 bg-white text-center md:text-left h-[80vh]">
        <motion.div
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
          variants={aboutVariants}
        >
          <div className="flex flex-col md:flex-row md:items-center max-w-4xl mx-auto">
            <div className="md:w-2/3 px-2">
              <h1 className="text-7xl ml-24 font-paintbrush text-blue-800 mb-4 md:mb-8">
                What is Butterfly?
              </h1>
              <p className="text-base text-center md:text-lg mb-8">
                Butterfly is a psychological wellness web application of A.M. Peralta Psychological Services that offers the features: enhanced appointment system with an automated interactive SMS service, refined remote psychotherapy counseling, and a comprehensive client monitoring and management. These integrated services will allow clients to book appointments and communicate remotely with psychotherapists at any time even in the comfort of their homes. Butterfly aims to deliver more efficient, effective, and reliable mental healthcare digital service.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-right md:justify-end md:ml-2">
              <img src="/images/amperalta.jpg" alt="A.M. Peralta Psychological Services" className="w-72 h-72 rounded-full" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Booking Section */}
      <section className="bg-[#c2dffd]">
        <div className="absolute mt-16 right-0 w-1/2 h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url('/images/booksession.png')` }}></div>
        <div className="relative z-10 max-w-5xl py-16 px-4 md:px-8 ml-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-paintbrush mb-8 text-left text-blue-800">
            How to Book a Session
          </h2>
          <p className="mb-8 text-base md:text-lg text-left max-w-2xl">
          A.M. Peralta Psychological Services' web application is designed to help you easily book an appointment in just a few simple steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <ol className="space-y-4">
                {bookingSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`text-6xl font-paintbrush text-gray-${500 + index * 100} w-10 text-center mr-4`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-left">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative flex flex-col justify-center items-end h-screen bg-white">
        <div className="absolute right-40 w-full h-full bg-contain bg-no-repeat" style={{ backgroundImage: `url('/images/cloud.png')`, backgroundPosition: 'right center' }}></div>
        <div className="absolute bottom-0 left-20 w-screen h-3/5 bg-contain bg-no-repeat" style={{ backgroundImage: `url('/images/services.png')`, backgroundPosition: 'left bottom' }}></div>

        <h1 className="absolute top-16 left-48 text-8xl z-10 font-paintbrush text-blue-800">
          Butterfly Offers
        </h1>

        <div className="relative z-10 flex flex-col items-end justify-center right-48 font-montserrat">
          <ServiceItem 
            title="Counseling and Psychotherapy" 
            description="Counseling and psychotherapy involve talking with a trained professional to address mental health challenges. Counseling focuses on specific issues for guidance, while psychotherapy explores deeper emotional and psychological aspects for overall healing and personal growth." 
          />
          <ServiceItem 
            title="Reading Modules" 
            description="Reading modules are structured educational units that provide curated texts and resources on counseling and psychotherapy. They enhance understanding of theories and practices through case studies, exercises, and reflective questions." 
          />
          <ServiceItem 
            title="Goals and Mood Tracking" 
            description="Goals and mood tracking is a practice that helps individuals set personal goals while monitoring their emotional states. It fosters self-awareness and accountability, enabling clients to identify mood patterns and assess the impact of their actions on mental health." 
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-4 md:px-8 py-8 md:py-32 bg-[#c2dffd] text-center md:text-left">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-paintbrush mb-8 text-blue-800">Frequently Asked Questions</h1>
          <div className="space-y-4 md:space-y-8">
            {faqItems.map((faq, index) => (
              <div key={index} className="space-y-2">
                <button
                  onClick={() => toggleOpen(index)}
                  className="flex justify-between items-center w-full text-left text-lg md:text-xl font-semibold"
                >
                  {faq.question}
                  <span>{open === index ? '-' : '+'}</span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${open === index ? 'max-h-40' : 'max-h-0'}`}
                >
                  <p className="text-base md:text-lg mt-2">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-8 md:py-32 bg-[#c2dffd]">
        <div className="max-w-4xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-paintbrush mb-8 text-blue-800">Get in Touch</h1>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <ContactInfo 
              Icon={FaMapMarkerAlt} 
              title="Visit Us" 
              description="Our Clinic is located at Unit 303 Sam-son's Building, Lower Mabini St., Baguio City" 
            />
            <ContactInfo 
              Icon={FaEnvelope} 
              title="Email Us" 
              description="Feel free to send us an email at amperaltapsychservices@gmail.com" 
            />
            <ContactInfo 
              Icon={FaPhone} 
              title="Call Us" 
              description="You can reach us at +63 9266 696 242" 
            />
          </div>
          <div className="text-center my-10">
            <a href="https://maps.app.goo.gl/yiV8BHgQP4zqpPta8" className="relative inline-block hover:transition-colors duration-300 group mr-4" target="_blank" rel="noopener noreferrer">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                <FaMap className="text-blue-800 text-3xl" />
              </div>
              <span className="absolute inset-0 bg-blue-300 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-50"></span>
            </a>
            <a href="https://www.facebook.com/amperaltapsychservices" className="relative inline-block hover:transition-colors duration-300 group" target="_blank" rel="noopener noreferrer">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full">
                <FaFacebookF className="text-blue-800 text-3xl" />
              </div>
              <span className="absolute inset-0 bg-blue-300 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-50"></span>
            </a>
          </div>
        </div>


  <div className="text-left mt-4 ml-36 flex justify-between items-center">
    <div>
      <a href="#" className="text-sm">Terms and Conditions</a> | <a href="#" className="text-sm">Privacy Policy</a>
    </div>

  </div>
      </section>
    </div>
  );
};

// ServiceItem Component
interface ServiceItemProps {
  title: string;
  description: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ title, description }) => (
  <div className="rounded-xl p-6 w-2/6">
    <h3 className="text-2xl mb-4 font-bold text-gray-800">{title}</h3>
    <p>{description}</p>
  </div>
);

// ContactInfo Component
interface ContactInfoProps {
  Icon: React.ComponentType<{ className?: string; size?: number | string }>;
  title: string;
  description: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ Icon, title, description }) => (
  <div className="flex items-start space-x-4">
    <Icon size={32} className="text-blue-800" />
    <div>
      <h4 className="text-lg font-bold">{title}</h4>
      <p className="text-base">{description}</p>
    </div>
  </div>
);

// FAQ Data
const faqItems = [
  {
    question: "How can I book an appointment?",
    answer: "You can book an appointment through our website by clicking on the 'Book an Appointment' button and filling out the necessary information.",
  },
  {
    question: "What services do you offer?",
    answer: "We offer counseling and psychotherapy, reading modules, and goals and mood tracking to support your mental health journey.",
  },
  {
    question: "How can I contact you?",
    answer: "You can reach us via email at contact@butterfly.com or call us at +639171234567.",
  },
  {
    question: "Where is your clinic located?",
    answer: "Our clinic is located at Room 304 Sam-sons Building, Lower Mabini St, Baguio, Benguet.",
  },
  {
    question: "How much is your sevices?",
    answer: "Our rate is ₱1,000 per session.",
  },
];

export default HomePage;