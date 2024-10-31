import React from 'react';

const GCashPayment: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen z-50">
      <h1 className="text-2xl font-bold mb-4">GCash Payment</h1>
      <p className="text-gray-600">You have selected GCash as your payment method.</p>
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <p className="mb-2 text-gray-800">This is where you can initiate your GCash payment process.</p>
        {/* Add your GCash payment form or QR code here */}
      </div>
    </div>
  );
};

export default GCashPayment;
