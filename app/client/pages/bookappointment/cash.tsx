import React from 'react';

const CashPayment: React.FC = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Cash Payment</h1>
      <p className="text-gray-600">You have selected Cash as your payment method.</p>
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <p className="mb-2 text-gray-800">Please prepare the cash for your payment upon delivery or at the counter.</p>
        {/* Additional instructions or content for cash payment can go here */}
      </div>
    </div>
  );
};

export default CashPayment;
