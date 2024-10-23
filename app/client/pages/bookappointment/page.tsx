"use client"; // Add this at the top of the file

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Confetti from "react-confetti"; // Import Confetti for the success effect
import { databases } from "@/appwrite";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import Calendar from "@/components/Calendar/Calendar"; // Import the Calendar component
import { fetchProfileImageUrl } from "@/hooks/userService";
import ChoosePaymentModal from "./choosepayment";

const AppointmentBooking = () => {
  const { loading: authLoading } = useAuthCheck(['client']);
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState({
    selectedMonth: "October",
    selectedDay: null,
    selectedTime: null,
    selectedTherapist: null,
    appointmentBooked: false,
  });
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [showPrompt, setShowPrompt] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handlePaymentSelection = (selectedMethod: string) => {
    setPaymentMethod(selectedMethod);
    console.log(`Selected payment method: ${selectedMethod}`);
  };

  const today = new Date();
  const currentYear = today.getFullYear();

  const handleBookAppointment = () => {
    const { selectedTherapist, selectedDay, selectedTime } = appointmentData;
    if (selectedTherapist && selectedDay && selectedTime) {
      setShowPrompt(true);
    }
  };

  const confirmBooking = () => {
    setAppointmentData((prev) => ({ ...prev, appointmentBooked: true }));
    setShowPrompt(false);
  };

  const cancelBooking = () => {
    setShowPrompt(false);
  };

  const handleProceedToPayment = () => {
    setAppointmentData((prev) => ({ ...prev, appointmentBooked: false }));
    setIsModalOpen(true);
    console.log("Proceeding to payment...");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const therapistResponse = await databases.listDocuments('Butterfly-Database', 'Psychotherapist');
        const therapists = therapistResponse.documents;
        setPsychotherapists(therapists);

        // Fetch profile images for each psychotherapist
        const profileImages = {};
        for (const therapist of therapists) {
          if (therapist.profilepic) {
            const url = await fetchProfileImageUrl(therapist.profilepic);
            if (url) {
              profileImages[therapist.$id] = url;
            }
          }
        }
        setProfileImageUrls(profileImages);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isFormComplete = appointmentData.selectedDay !== null && appointmentData.selectedTime && appointmentData.selectedTherapist;

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout sidebarTitle="Butterfly" sidebarItems={items}>
      <div className="text-black min-h-screen flex">
        <div className="flex-grow flex flex-col justify-between bg-gray-100 w-3/4">
          <div className="bg-blue-100 shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-black w-full flex flex-col bg-gray-100">
              <div className="flex flex-col p-6 space-y-6">
                <h3 className="text-3xl font-bold text-blue-900">
                  Choose Psychotherapist <span className="text-red-500">{!appointmentData.selectedTherapist && "*"}</span>
                </h3>

                <div className="flex space-x-6 mt-4">
                  {psychotherapists.map((therapist) => (
                    <div key={therapist.$id} className="flex items-center space-x-4">
                      <img
                        src={profileImageUrls[therapist.$id] || "/images/default-profile.png"}  // fallback to a default image
                        alt={`${therapist.firstName} ${therapist.lastName}`}
                        className="rounded-full w-16 h-16"
                      />
                      <div>
                        <h3 className="text-lg font-bold">{therapist.firstName} {therapist.lastName}</h3>
                        <p className="text-sm text-gray-500">Specialty: {therapist.specialties}</p>
                        <button
                          className={`mt-2 py-1 px-3 rounded ${appointmentData.selectedTherapist?.$id === therapist.$id ? 'bg-[#2563EB] text-white' : 'bg-gray-300 text-blue-500 hover:bg-gray-400'}`}
                          onClick={() => setAppointmentData((prev) => ({ ...prev, selectedTherapist: therapist }))}
                        >
                          {appointmentData.selectedTherapist?.$id === therapist.$id ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
                <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4">
                  <Calendar
                      currentMonth="October"
                      nextMonth="November"
                      currentDate={today.getDate()}
                      currentYear={currentYear}
                      selectedDay={appointmentData.selectedDay}
                      setSelectedDay={(day) => setAppointmentData((prev) => ({ ...prev, selectedDay: day }))}
                      selectedMonth={appointmentData.selectedMonth}
                      setSelectedMonth={(month) => setAppointmentData((prev) => ({ ...prev, selectedMonth: month, selectedDay: null }))}
                      selectedTime={appointmentData.selectedTime}
                      setSelectedTime={(time) => setAppointmentData((prev) => ({ ...prev, selectedTime: time }))}
                      isTherapistSelected={!!appointmentData.selectedTherapist} // Pass the selection state
                      handleBookAppointment={handleBookAppointment}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Prompt */}
      {showPrompt && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center relative border border-gray-300">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Are you sure you want to proceed?</h3>
            <div className="mt-6 flex justify-around">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400"
                onClick={cancelBooking}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
                onClick={confirmBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message and Confetti */}
      {appointmentData.appointmentBooked && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <Confetti width={windowDimensions.width} height={windowDimensions.height} />
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center relative border border-gray-300">
            <button
              className="absolute top-2 right-2 bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-black hover:bg-gray-400"
              onClick={() => setAppointmentData((prev) => ({ ...prev, appointmentBooked: false }))}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-green-600">You Are Almost Done With Booking your Appointment!</h3>
            <p className="mt-2">
              Service: Counseling and Therapy<br />
              Date & Time: {appointmentData.selectedMonth} {appointmentData.selectedDay}, {currentYear} | {appointmentData.selectedTime}<br />
              Psychotherapist: {appointmentData.selectedTherapist ? `${appointmentData.selectedTherapist.firstName} ${appointmentData.selectedTherapist.lastName}` : "No therapist selected"}
            </p>
            <p className="text-lg text-gray-700">You can proceed to payment to complete the booking.</p>
            <button
              className="mt-4 bg-green-400 text-white py-2 px-4 rounded-lg hover:bg-green-950"
              onClick={handleProceedToPayment}
              disabled={!isFormComplete}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}


      {/* Modal */}
      <ChoosePaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

export default AppointmentBooking;
