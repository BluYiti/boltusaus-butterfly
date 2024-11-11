'use client'

import React, { useState, useEffect } from "react";
import Layout from "@/components/Sidebar/Layout";
import items from "@/client/data/Links";
import Confetti from "react-confetti"; // Import Confetti for the success effect
import { account, databases, Query } from "@/appwrite";
import useAuthCheck from "@/auth/page";
import LoadingScreen from "@/components/LoadingScreen";
import Calendar from "@/components/Calendar/Calendar"; // Import the Calendar component
import { fetchClientId, fetchProfileImageUrl } from "@/hooks/userService";
import ChoosePaymentModal from "./choosepayment";
import CashPayment from "./cash";
import CreditCardPayment from "./creditcard";
import GCashPayment from "./gcash";

const AppointmentBooking = () => { // Pass client data as a prop
  const { loading: authLoading } = useAuthCheck(['client']);
  const today = new Date();
  const currentYear = today.getFullYear();
  const selectedMonth = today.toLocaleString('default', { month: 'long' });
  const nextMonth = new Date(today.setMonth(today.getMonth() + 1)).toLocaleString('default', { month: 'long' });

  const [appointmentData, setAppointmentData] = useState({
    selectedMonth,
    selectedDay: null,
    selectedTime: null,
    selectedTherapist: null,
    selectedMode: null,
    appointmentBooked: false,
    createdAt: today,
    allowTherapistChange: null, // Control therapist selection ability
  });

  const [loading, setLoading] = useState(true);
  const [clientsPsycho, setClientsPsycho] = useState(null);
  const [psychotherapists, setPsychotherapists] = useState([]);
  const [selectedTherapistId, setSelectedTherapistId] = useState(Number);
  const [profileImageUrls, setProfileImageUrls] = useState({});
  const [showPrompt, setShowPrompt] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleBookAppointment = () => {
    const { selectedTherapist, selectedDay, selectedTime, selectedMode } = appointmentData;
    if (selectedTherapist && selectedDay && selectedTime && selectedMode) {
      setShowPrompt(true);
      console.log("Showing prompt for booking confirmation.");
    }
  };
  
  const confirmBooking = () => {
    setAppointmentData((prev) => ({
      ...prev,
      appointmentBooked: true,
      allowTherapistChange: false,
    }));
    setShowPrompt(false);
    console.log("Appointment confirmed, showing success message.");
  };  

  const cancelBooking = () => {
    setShowPrompt(false);
  };

  const handleProceedToPayment = () => {
    setAppointmentData((prev) => ({ ...prev, appointmentBooked: false }));
    setIsModalOpen(true); // This should trigger the modal to open
    console.log("Proceeding to payment...");
  };  

  // Set the payment method and close the modal
  const handleProceedPayment = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsModalOpen(false);
    console.log(`Proceeding to payment`, {method});
    switch (selectedPaymentMethod) {
      case 'credit card':
        return <CreditCardPayment isOpen={isModalOpen} onClose={handleCloseModal} appointmentData={appointmentData}/>;
      case 'gcash':
        return <GCashPayment isOpen={isModalOpen} onClose={handleCloseModal} appointmentData={appointmentData}/>;
      case 'cash':
        return <CashPayment isOpen={isModalOpen} onClose={handleCloseModal} appointmentData={appointmentData}/>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await account.get();
        const clientId = await fetchClientId(user.$id);

        const response = await databases.getDocument('Butterfly-Database', 'Client', clientId);
        const clientsPsycho = response.psychotherapist;

        // Check if the client already has an assigned therapist
        if (!clientsPsycho) {
          // Client doesn't have a psychotherapist assigned, allow them to select one
          setAppointmentData(prev => ({
            ...prev,
            allowTherapistChange: true, // Allow the user to select a therapist
          }));
          console.log("allowed user to select therapist");
        } else {
          const clientsPsychoId = response.psychotherapist.$id;
          setSelectedTherapistId(clientsPsychoId);
          // Fetch clients psychotherapist
          const clientsTherapistResponse = await databases.getDocument('Butterfly-Database', 'Psychotherapist', clientsPsychoId);
          setClientsPsycho(clientsTherapistResponse);
          console.log("user has a therapist");
          setAppointmentData(prev => ({
            ...prev,
            selectedTherapist: clientsTherapistResponse,
            allowTherapistChange: false, // Client already has a therapist, can't change
          }));
        }

        // Fetch list of therapists
        const therapistResponse = await databases.listDocuments('Butterfly-Database', 'Psychotherapist');
        const therapists = therapistResponse.documents;
        setPsychotherapists(therapists);

        // Fetch profile images for each therapist
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
        setLoading(false); // End the loading state once data is fetched
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
              <div className="flex flex-col p-6 space-y-3">
                <h3 className="text-3xl font-bold text-blue-900">
                  Choose Psychotherapist <span className="text-red-500">{!appointmentData.selectedTherapist && "*"}</span>
                </h3>
                <p className="top-0">
                  **NOTE: Choosing your psychotherapist for the very first time will be permanent throughout your psychological journey.
                </p>
                <div className="flex space-x-6 mt-4">
                  {!clientsPsycho ? (
                    psychotherapists.map((therapist) => (
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
                            onClick={() => {
                              if (appointmentData.allowTherapistChange) {
                                setAppointmentData((prev) => ({ ...prev, selectedTherapist: therapist }));
                              }
                            }}
                            disabled={appointmentData.selectedTherapist?.$id === therapist.$id && !appointmentData.allowTherapistChange}
                          >
                            {appointmentData.selectedTherapist?.$id === therapist.$id ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center space-x-4">
                      <img
                        src={clientsPsycho && clientsPsycho.$id ? profileImageUrls[clientsPsycho.$id] : "/images/default-profile.png"}  // fallback to a default image
                        alt={`${clientsPsycho ? clientsPsycho.firstName : "No Therapist"} ${clientsPsycho ? clientsPsycho.lastName : ""}`}
                        className="rounded-full w-16 h-16"
                      />
                      <div>
                        <h3 className="text-lg font-bold">
                          {clientsPsycho ? `${clientsPsycho.firstName} ${clientsPsycho.lastName}` : "No Therapist Selected"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Specialty: {clientsPsycho ? clientsPsycho.specialties : "N/A"}
                        </p>
                        <button
                          className="mt-2 py-1 px-3 rounded bg-[#2563EB] text-white"
                          disabled={true}
                        >
                          Selected
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-left text-blue-900 mt-8">Counseling and Therapy Sessions</h2>
                <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 mt-4">
                  <Calendar
                    currentMonth={selectedMonth}
                    nextMonth={nextMonth}
                    currentDate={today.getDate()}
                    currentYear={currentYear}
                    selectedDay={appointmentData.selectedDay}
                    setSelectedDay={(day) => setAppointmentData((prev) => ({ ...prev, selectedDay: day }))}
                    selectedMonth={appointmentData.selectedMonth}
                    setSelectedMonth={(month) => setAppointmentData((prev) => ({ ...prev, selectedMonth: month, selectedDay: null }))}
                    selectedTime={appointmentData.selectedTime}
                    setSelectedTime={(time) => setAppointmentData((prev) => ({ ...prev, selectedTime: time }))}
                    isTherapistSelected={!!appointmentData.selectedTherapist} // Pass the selection state
                  />
                </div>

                {/* Therapy Mode Selection */}
                <div className="mb-4">
                  <label className="block mb-2 text-lg font-medium text-gray-700">
                    Select Therapy Mode {!appointmentData.selectedMode && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={appointmentData.selectedMode || ""}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, selectedMode: e.target.value }))}
                    className="border w-32 border-gray-300 rounded-lg p-2"
                  >
                    <option value="" disabled>Select Mode</option>
                    <option value="online">Online</option>
                    <option value="f2f">In-Person</option>
                  </select>
                </div>

                {/* Selected Info */}
                <div className="mt-6">
                    <p className="text-gray-500">
                        Selected: {appointmentData.selectedMonth} {appointmentData.selectedDay}, {currentYear} | {appointmentData.selectedTime} | Mode: {appointmentData.selectedMode}
                    </p>
                    <button
                        className={`mt-4 py-2 px-4 rounded-lg ${isFormComplete ? "bg-blue-400 text-white hover:bg-blue-500" : "bg-gray-300 text-gray-700 cursor-not-allowed"}`}
                        onClick={handleBookAppointment}
                        disabled={!isFormComplete}
                    >
                        Book
                    </button>
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
              Service Counseling and Therapy<br />
              <strong>Date & Time</strong>: {appointmentData.selectedMonth} {appointmentData.selectedDay}, {currentYear} | {appointmentData.selectedTime}<br/>
              <strong>Mode</strong>: {appointmentData.selectedMode}<br/>
              <strong>Psychotherapist</strong>: {appointmentData.selectedTherapist ? `${appointmentData.selectedTherapist.firstName} ${appointmentData.selectedTherapist.lastName}` : "No therapist selected"}
            </p>
            <p className="text-lg text-gray-700">You can proceed to payment to complete the booking.</p>
            <button
              className="mt-4 py-2 px-4 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {isModalOpen && (
        <ChoosePaymentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProceed={handleProceedPayment}
          appointmentData={appointmentData} // Pass booking details here
        />
      )}

      {/* Render selected payment component based on `selectedPaymentMethod` */}
      {selectedPaymentMethod === "credit card" && (
        <React.Suspense fallback={<LoadingScreen />}>
          <CreditCardPayment isOpen={true} onClose={() => setSelectedPaymentMethod(null)} appointmentData={appointmentData} />
        </React.Suspense>
      )}
      {selectedPaymentMethod === "gcash" && (
        <React.Suspense fallback={<LoadingScreen />}>
          <GCashPayment isOpen={true} onClose={() => setSelectedPaymentMethod(null)} appointmentData={appointmentData} />
        </React.Suspense>
      )}
      {selectedPaymentMethod === "cash" && (
        <React.Suspense fallback={<LoadingScreen />}>
          <CashPayment isOpen={true} onClose={() => setSelectedPaymentMethod(null)} appointmentData={appointmentData} />
        </React.Suspense>
      )}
    </Layout>
  );
};

export default AppointmentBooking;