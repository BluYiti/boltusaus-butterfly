import React, { useEffect } from "react";

const ChoosePaymentModal = ({ isOpen, onClose, onProceed, appointmentData }) => {
  if (!isOpen) return null;

  useEffect(() => {
    console.log(appointmentData);
  }, [appointmentData]);  // Add dependency to log only when appointmentData changes

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-black hover:bg-gray-400"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
        
        {/* Booking Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
          <p className="text-gray-600 mb-4">
            <strong>Psychotherapist:</strong> {appointmentData.selectedTherapist?.firstName} {appointmentData.selectedTherapist?.lastName}<br />
            <strong>Date and Time:</strong> {appointmentData.selectedMonth} {appointmentData.selectedDay}, {new Date().getFullYear()} at {appointmentData.selectedTime}<br />
            <strong>Type:</strong> {appointmentData.selectedMode}<br />
            <strong>Amount to be Paid:</strong> ₱1,000.00 {/* Replace with dynamic pricing if available */}
          </p>
        </div>

        {/* Payment Options */}
        <div className="flex justify-evenly mb-4">
          <button
            className="bg-red-700 text-white px-4 rounded-2xl hover:bg-red-400"
            onClick={() => onProceed("credit card")}
          >
            <img src="/images/bpi.png" alt="Credit Card" className="w-24 h-24 object-contain" />
          </button>
          <button
            className="bg-blue-400 text-white px-4 rounded-2xl hover:bg-blue-300"
            onClick={() => onProceed("gcash")}
          >
            <img src="/images/gcash.png" alt="GCash" className="w-24 h-24 object-contain" />
          </button>
          <button
            className="bg-green-400 text-white px-4 rounded-2xl hover:bg-green-200"
            onClick={() => onProceed("cash")}
          >
            <img src="/images/cash.png" alt="Cash" className="w-24 h-24 object-contain" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePaymentModal;
