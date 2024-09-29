'use client';

export default function PaymentStatus() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">You’re almost there!</h1>
      <p className="mb-8">Please wait a moment....</p>

      {/* Progress bar */}
      <div className="w-full mb-4">
        <div className="flex items-center mb-2">
          <div className="w-1/3 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-1/3 h-2 bg-blue-200 rounded-full"></div>
          <div className="w-1/3 h-2 bg-blue-200 rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Choose payment method</span>
          <span>Payment Pending</span>
          <span>Successful</span>
        </div>
      </div>

      {/* Payment method options */}
      <h2 className="text-lg font-bold mb-4">Choose Payment Method</h2>
      <div className="flex space-x-4 mb-8">
        <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
          <img src="/images/gcash.png" alt="GCash" className="w-12 h-12 mb-2" />
          <span>GCash</span>
        </button>
        <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
          <img src="/images/bank-transfer.png" alt="Bank Transfer" className="w-12 h-12 mb-2" />
          <span>Bank Transfer</span>
        </button>
        <button className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100">
          <img src="/images/cash.png" alt="Cash" className="w-12 h-12 mb-2" />
          <span>Cash</span>
        </button>
      </div>

      {/* Done button */}
      <button
        className="py-2 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        DONE
      </button>
    </div>
  );
}
