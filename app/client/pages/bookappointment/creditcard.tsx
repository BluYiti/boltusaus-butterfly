import React from 'react';

const CreditCardPayment: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Credit Card Payment</h1>
      <p className="text-gray-600">You have selected Credit Card as your payment method.</p>
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <p className="mb-2 text-gray-800">This is where you can input your credit card information.</p>
        {/* Add your credit card form here */}
      </div>
    </div>
  );
};

export default CreditCardPayment;
