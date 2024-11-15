'use client'

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import BackToTopButton from './components/BackToTop';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaMap } from 'react-icons/fa';
import Image from 'next/image';
import termsContent from '@/constants/terms';
import privacyContent from '@/constants/privacy';
import TermsAndPrivacy from "./components/TermsAndPrivacy";


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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContentType, setModalContentType] = React.useState<'terms' | 'privacy'>('terms');

  const toggleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };
<<<<<<< HEAD
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contentType, setContentType] = useState<'terms' | 'privacy'>('terms');

  const openModal = (type: 'terms' | 'privacy') => {
    setContentType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
=======

>>>>>>> origin/jc
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (aboutRef.current && !hasAnimated) {
        const rect = aboutRef.current.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
        if (isVisible) {
          setHasAnimated(true); // Set to true to trigger the animation
        }
      }
    };

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
        className="absolute z-20 w-[35rem] h-[35rem] sm:right-[14rem] 2xl:right-[14rem] 3xl:right-[22rem]" 
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

      {/* Modal Section */}
{isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div className="bg-white p-8 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto text-center relative">
      <h2 className="text-2xl font-bold mb-4">
        {contentType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
      </h2>
      <div className="text-sm text-left max-h-[60vh] overflow-y-auto px-4 text-justify">
        {contentType === 'terms' ? (
          <p>AGREEMENT TO OUR LEGAL TERMS <br />
          We are A.M Peralta Psychological Services ("Company," "we," "us,"
          "our"), a company registered in the Philippines at Unit 303 Sam-son's Building, Lower Mabini St., Baguio City, Benguet 2600.
          We operate the website http://www.amperalta.com (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          Butterfly is a psychological wellness web application of A.M. Peralta Psychological Services that offers the features: enhanced appointment system with an automated interactive SMS service, refined remote psychotherapy counseling, and a comprehensive client monitoring and management. These integrated services will allow clients and psychotherapists to book appointments and communicate remotely at any time. Butterfly aims to deliver more efficient, effective, and reliable mental healthcare digital service.
          You can contact us by phone at 09266696242, email at amperaltapsychservices@yahoo.com, or by mail to Unit 303 Sam-son's Building, Lower Mabini St., Baguio City, Benguet 2600, Philippines.
          These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and A.M Peralta Psychological Services, concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          We will provide you with prior notice of any scheduled changes to the Services you are using. Changes to Legal Terms will become effective seven (7) days after the notice is given, except if the changes apply to new functionality, security updates, and bug fixes, in which case the changes will be effective immediately. By continuing to use the Services after the effective date of any changes, you agree to be bound by the modified terms. If you disagree with such changes, you may terminate Services as per the section "TERM AND TERMINATION."
          All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.
          We recommend that you print a copy of these Legal Terms for your records.
          <br />
          <br />
          TABLE OF CONTENTS
          <br />
          1. OUR SERVICES
          <br />
          2. INTELLECTUAL PROPERTY RIGHTS
          <br />
          3. USER REPRESENTATIONS
          <br />
          4. USER REGISTRATION
          <br />
          5. PROHIBITED ACTIVITIES
          <br />
          6. USER GENERATED CONTRIBUTIONS
          <br />
          7. CONTRIBUTION LICENSE
          <br />
          8. GUIDELINES FOR REVIEWS
          <br />
          9. SERVICES MANAGEMENT
          <br />
          10. COPYRIGHT INFRINGEMENTS
          <br />
          11. TERM AND TERMINATION
          <br />
          12. MODIFICATIONS AND INTERRUPTIONS
          <br />
          13. GOVERNING LAW
          <br />
          14. DISPUTE RESOLUTION
          <br />
          15. CORRECTIONS
          <br />
          16. DISCLAIMER
          <br />
          17. LIMITATIONS OF LIABILITY
          <br />
          18. INDEMNIFICATION
          <br />
          19. USER DATA
          <br />
          20. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES
          <br />
          21. SMS TEXT MESSAGING
          <br />
          22. MISCELLANEOUS
          <br />
          23. CONTACT US
          <br />
          <br />
          
          1. OUR SERVICES <br />
          The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
          <br /><br />
          2. INTELLECTUAL PROPERTY RIGHTS<br />
          Our intellectual property
          We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video,and photographs in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
          Some Images, graphics, and elements used are from CANVA.
          Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in the Philippines and around the world.
          The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.
          <br /><br />
          Your use of our Services<br />
          Subject to your compliance with these Legal Terms, including the
          "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
          • access the Services: and
          • download or print a copy of any portion of the Content to which you have properly gained access.
          solely for your personal, non-commercial use or internal business purpose.
          Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: amperaltapsychservices@yahoo.com. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.
          We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.
          Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.
          <br /><br />
          Your submissions and contributions<br />
          Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.
          Submissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission.
          You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
          Contributions: The Services may invite you to chat, contribute to, message Psychotherapists, and other functionality during which you may create, submit, post, display, transmit, publish, distribute to us or through the Services, including but not limited to text, writings, video, audio, photographs, music, graphics, comments, reviews, rating suggestions, personal information, or other material ("Contributions"). Any Submission that is publicly posted shall also be treated as a Contribution.
          You understand that Contributions may be viewable by other users of the Services.
          When you post Contributions, you grant us a license (including use of your name, trademarks, and logos): By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions (including, without limitation, your image, name, and voice) for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicense the licenses granted in this section.
          Our use and distribution may occur in any media formats and through any media channels.
          This license includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide.
          You are responsible for what you post or upload: By sending us
          Submissions and/or posting Contributions through any part of the Services or making Contributions accessible through the Services by linking your account through the Services to any of your social networking accounts, you:
          <br />• confirm that you have read and agree with our "PROHIBITED ACTIVITIES" and will not post, send, publish, upload, or transmit through the Services any Submission nor post any Contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;
          <br />• to the extent permissible by applicable law, waive any and all moral rights to any such Submission and/or Contribution;
          <br />• warrant that any such Submission and/or Contributions are original to you or that you have the necessary rights and licenses to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions; and
          <br />• warrant and represent that your Submissions and/or Contributions do not constitute confidential information.
          You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.
          <br /><br />
          We may remove or edit your Content: Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities.
          Copyright infringement
          We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately refer to the "COPYRIGHT INFRINGEMENTS" section below.
          <br /><br />
          3. USER REPRESENTATIONS<br />
          By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services; (5) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (6) you will not use the Services for any illegal or unauthorized purpose; (7) your use of the Services will not violate any applicable law or regulation; (8) Camera & Audio should be turned on when having a session with the Psychotherapist; (9) refunds will be done by messaging the psychotherapist; (10) missed sessions will be rescheduled; (11) chosen psychotherapist is permanent; (12) psychotherapists can approve face to face psychotherapy or online psychotherapy; and (13) psychotherapists can view client’s data excluding account information
          If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof). 
          <br /><br />
          4. USER REGISTRATION<br />
          You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          <br /><br />
          5. PROHIBITED ACTIVITIES<br />
          You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          As a user of the Services, you agree not to:
          <br />• Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.
          <br />• Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.
          <br />• Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.
          <br />• Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
          <br />• Use any information obtained from the Services in order to harass, abuse, or harm another person.
          <br />• Make improper use of our support services or submit false reports of abuse or misconduct.
          <br />• Use the Services in a manner inconsistent with any applicable laws
          or regulations.
          <br />• Engage in unauthorized framing of or linking to the Services.
          <br />• Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.
          <br />• Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.
          <br />• Delete the copyright or other proprietary rights notice from any
          Content.
          <br />• Attempt to impersonate another user or person or use the username of another user.
          <br />• Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").
          <br />• Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.
          <br />• Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.
          <br />• Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.
          <br />• Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.
          <br />• Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.
          <br />• Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or use or launch any unauthorized script or other software.
          <br />• Use a buying agent or purchasing agent to make purchases on the Services.
          <br />• Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.
          <br />• Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.
          <br />• Sell or otherwise transfer your profile.
          <br /><br />
          6. USER GENERATED CONTRIBUTIONS<br />
          The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:
          se Policy
          <br />• The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.
          <br />• You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms.
          <br />• You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms.
          <br />• Your Contributions are not false, inaccurate, or misleading.
          <br />• Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.
          <br />• Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).
          <br />• Your Contributions do not ridicule, mock, disparage, intimidate, or
          abuse anyone.
          <br />• Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.
          <br />• Your Contributions do not violate any applicable law, regulation, or rule.
          <br />• Your Contributions do not violate the privacy or publicity rights of any third party.
          <br />• Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or wellbeing of minors.
          <br />• Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.
          <br />• Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation.
          Any use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services.
          <br /><br />
          7. CONTRIBUTION LICENSE<br />
          By posting your Contributions to any part of the Services, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.
          This license will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.
          We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.
          We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2) to re-categorize any Contributions to place them in more appropriate locations on the Services; and (3) to pre-screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.
          <br /><br />
          8. GUIDELINES FOR REVIEWS<br />
          We may provide you areas on the Services to leave reviews or ratings.
          When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language; (3) your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability; (4) your reviews should not contain references to illegal activity; (5) you should not be affiliated with competitors if posting negative reviews; (6) you should not make any conclusions as to the legality of conduct; (7) you may not post any false or misleading statements; and (8) you may not organize a campaign encouraging others to post reviews, whether positive or negative.
          We may accept, reject, or remove reviews in our sole discretion. We have absolutely no obligation to screen reviews or to delete reviews, even if anyone considers reviews objectionable or inaccurate. Reviews are not endorsed by us, and do not necessarily represent our opinions or the views of any of our affiliates or partners. We do not assume liability for any review or for any claims, liabilities, or losses resulting from any review. By posting a review, you hereby grant to us a perpetual, non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable right and license to reproduce, modify, translate, transmit by any means, display, perform, and/or distribute all content relating to review.
          <br /><br />
          9. SERVICES MANAGEMENT<br />
          We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.
          <br /><br />
          10. COPYRIGHT INFRINGEMENTS<br />
          We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below (a "Notification"). A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification. Please be advised that pursuant to applicable law you may be held liable for damages if you make material misrepresentations in a Notification. Thus, if you are not sure that material located on or linked to by the Services infringes your copyright, you should consider first contacting an attorney.
          <br /><br />
          11. TERM AND TERMINATION<br />
          These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
          If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
          <br /><br />
          12. MODIFICATIONS AND INTERRUPTIONS<br />
          We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice.
          However, we have no obligation to update any information on our Services.
          We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.
          We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services.
          Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.
          <br /><br />
          13. GOVERNING LAW<br />
          These Legal Terms shall be governed by and defined following the laws of the Philippines. A.M Peralta Psychological Services and yourself irrevocably consent that the courts of the Philippines shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
          <br /><br />
          14. DISPUTE RESOLUTION<br />
          Informal Negotiations
          To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the
          "Disputes") brought by either you or us (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.
          Binding Arbitration<br />
          Any dispute arising out of or in connection with these Legal Terms, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber (Belgium, Brussels, Avenue Louise, 146) according to the Rules of this ICAC, which, as a result of referring to it, is considered as the part of this clause. The number of arbitrators shall be three (3). The seat, or legal place, or arbitration shall be Baguio City, Philippines. The language of the proceedings shall be English, Filipino. The governing law of these Legal Terms shall be substantive law of the Philippines.
          Restrictions<br />
          The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.
          Exceptions to Informal Negotiations and Arbitration
          The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.
          <br /><br />
          15. CORRECTIONS<br />
          There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, Inaccuracies, or omissions ana Io chance or update information on the Services at any time, without prior notice.
          <br /><br />
          16. DISCLAIMER<br />
          THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2)
          PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN,
          (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR
          FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
          <br /><br />
          17. LIMITATIONS OF LIABILITY<br />
          IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          <br /><br />
          18. INDEMNIFICATION<br />
          You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
          <br /><br />
          19. USER DATA<br />
          We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
          <br /><br />
          20. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES<br />
          Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.
          <br /><br />
          21. SMS TEXT MESSAGING<br />
          Opting Out
          If at any time you wish to stop receiving SMS messages from us, simply reply to the text with "STOP." You may receive an SMS message confirming your opt out.
          Message and Data Rates<br />
          Please be aware that message and data rates may apply to any SMS messages sent or received. The rates are determined by your carrier and the specifics of your mobile plan.
          Support<br />
          If you have any questions or need assistance regarding our SMS communications, please email us at amperaltapsychservices@yahoo.com or call at 09266696242.
          <br /><br />
          22. MISCELLANEOUS<br />
          These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions.
          There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.
          <br /><br />
          23. CONTACT US<br />
          In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
          A.M Peralta Psychological Services<br />
          Unit 303 Sam-son's Building, Lower Mabini St.<br />
          Baguio City, Benguet 2600<br />
          Philippines<br />
          Phone: 09266696242<br />
          amperaltapsychservices@yahoo.com<br /></p>
        ) : (
          <p>I am to participate in telebehavioral health with A.M.Peralta Psychological Services as part of my consultation/counseling and psychotherapy. I understand that telebehavioral health is the practice of delivering mental health care services via technology between a licensed mental health care practitioner and a client such as myself. Furthermore, I understand the guidelines indicated below with respect to telebehavioral health.
            <br /><br />
          1) I understand that there are risks, benefits, and consequences associated with telebehavioral health, including but not limited to, disruption of transmission by technology failures, interruption and/or breaches of confidentiality by unauthorized persons, and/or limited ability to respond to emergencies.
            <br /><br />
          2) I understand that there will be no recording of any of the online sessions by either party. All information disclosed within sessions and written records pertaining to those sessions are confidential and may not be disclosed to anyone without written authorization, except where the disclosure is permitted and/or required by law.
            <br /><br />
          3) I understand that the privacy laws that protect the confidentiality of my protected health
          information also apply to telebehavioral health unless an exception to confidentiality applies (i.e. mandatory reporting of child, elder, or vulnerable adult abuse, danger to self or others; I raise mental/emotional health as an issue in a legal proceeding).
            <br /><br />
          4) I understand that if I am having suicidal or homicidal thoughts, actively experiencing psychotic symptoms or experiencing a mental health crisis that cannot be resolved remotely, it may be determined that telebehavioral health services are not appropriate and a higher level of care is required.
            <br /><br />
          5) I understand that during a telebehavioral health session, we could encounter technical difficulties resulting in service interruptions. If this occurs, end and restart the session. If we are unable to reconnect within ten minutes, please call me at 09266696242 to discuss since we may have to re-schedule.
            <br /><br />
          6) I understand that my therapist may need to contact my emergency contact and/or appropriate authorities in case of an emergency but in the event that my therapist is not available when I happen to be in an emergency situation, I understand that I am to contact other emergency providers and follow necessary emergency procedures that my therapist is to give to me upon my consent.
            <br /><br />
          </p>
        )}
      </div>
      <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">
        &times;
      </button>
    </div>
  </div>
)}

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
              <Image 
                src="/images/amperalta.jpg" 
                alt="A.M. Peralta Psychological Services" 
                width={288} // 72 * 4 (for example, you can adjust width/height to suit your design)
                height={288} 
                className="rounded-full" 
                priority // Optional: if it's a critical image that should be loaded first
              />
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
          A.M. Peralta Psychological Services&apos; web application is designed to help you easily book an appointment in just a few simple steps.
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
      <section id="contacts" className="py-8 md:py-32 bg-[#ffffff]">
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


<<<<<<< HEAD
  <div className="text-left mt-4 ml-36 flex justify-between items-center">
  <div>
  <a href="#" onClick={(e) => { e.preventDefault(); openModal('terms'); }} className="text-sm">Terms and Conditions</a> | 
  <a href="#" onClick={(e) => { e.preventDefault(); openModal('privacy'); }} className="text-sm">  Privacy Policy</a>
</div>


  </div>
=======
        <div className="text-left mt-4 ml-36 flex justify-between items-center">
          <div>
            <button
                type="button"
                onClick={() => {
                    setIsModalOpen(true);
                    setModalContentType('terms');
                }}
                className="text-blue-500 hover:underline ml-1"
            >
                Terms and Conditions
            </button>
            &nbsp;|&nbsp;
            <button
                type="button"
                onClick={() => {
                    setIsModalOpen(true);
                    setModalContentType('privacy');
                }}
                className="text-blue-500 hover:underline ml-1"
            >
                Privacy Policy
            </button>
          </div>
        </div>
>>>>>>> origin/jc
      </section>
      {/* Terms and Privacy Modal */}
      <TermsAndPrivacy
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          contentType={modalContentType}  
          termsContent={termsContent} 
          privacyContent={privacyContent} 
      />
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