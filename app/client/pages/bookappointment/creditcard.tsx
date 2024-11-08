import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { account } from '@/appwrite';
import { fetchClientId } from '@/hooks/userService';

interface CreditCardPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData;
}

const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const user = await account.get();
      
    } catch (err) {
      setError('Failed to fetch evaluation data.'); // Set an error message
      console.error(err); // Log the error for debugging
    }
  };

  fetchData();
}, []);

const CreditCardPayment: React.FC<CreditCardPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric characters by replacing non-numeric characters
    if (/[^0-9]/.test(value)) {
      e.preventDefault(); // Prevent non-numeric characters from being entered
    } else {
      setCardNumber(value);
    }
    validateCardNumber(value);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpiryDate(value);
    validateExpiryDate(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCvc(value);
    validateCvc(value);
  };

  const validateCardNumber = (cardNumber: string) => {
    let error = '';
    if (!/^\d{12}$/.test(cardNumber)) {
      error = 'Card number must be exactly 12 digits and numeric.';
    }
    setErrors((prevErrors) => ({ ...prevErrors, cardNumber: error }));
  };

  const validateExpiryDate = (expiryDate: string) => {
    let error = '';
    const currentDate = new Date();
    const [expiryMonth, expiryYear] = expiryDate.split('/').map((val) => val.trim());

    // Expiry date validation (MM/YY format and not expired)
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      error = 'Expiry date must be in MM/YY format.';
    } else if (parseInt(expiryYear) < currentDate.getFullYear() % 100 || 
      (parseInt(expiryYear) === currentDate.getFullYear() % 100 && parseInt(expiryMonth) < currentDate.getMonth() + 1)) {
      error = 'Expiry date must not be in the past.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, expiryDate: error }));
  };

  const validateCvc = (cvc: string) => {
    let error = '';
    // CVC validation (3 digits)
    if (!/^\d{3}$/.test(cvc)) {
      error = 'CVC must be exactly 3 digits and numeric.';
    }
    setErrors((prevErrors) => ({ ...prevErrors, cvc: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just check if there are any errors in the state before submitting
    if (Object.values(errors).every((error) => error === '')) {
      // Submit form if no errors
      console.log('Form submitted');
    } else {
      console.log('Form has errors');
    }
  };

  // Check if all fields are valid (no errors)
  const isFormValid = Object.values(errors).every((error) => error === '') &&
                      cardNumber.length === 12 &&
                      expiryDate.length === 5 &&
                      cvc.length === 3;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 id="modal-title" className="text-2xl font-bold mb-4">BPI Card Payment</h1>
        <p id="modal-description" className="text-gray-600">
          You have selected BPI Card as your payment method.
        </p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-gray-800">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="1234 5678 9012"
              maxLength={12}
            />
            {errors.cardNumber && <p className="text-red-600 text-sm">{errors.cardNumber}</p>}

            <label className="block mb-2 text-gray-800">Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => handleExpiryDateChange(e)}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="MM/YY"
              maxLength={5}
              pattern="\d{2}/\d{2}"
              inputMode="numeric"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target;
                let value = input.value.replace(/\D/g, '').slice(0, 4); // Allow only digits, limit to 4 characters
                if (value.length >= 3) {
                  value = value.slice(0, 2) + '/' + value.slice(2); // Insert slash after MM
                }
                // Set the value of the input element
                input.value = value;
                // Call the change handler to update the state
                handleExpiryDateChange(e);
              }}
            />
            {errors.expiryDate && <p className="text-red-600 text-sm">{errors.expiryDate}</p>}
            
            <label className="block mb-2 text-gray-800">CVC</label>
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="CVC"
              maxLength={3}
            />
            {errors.cvc && <p className="text-red-600 text-sm">{errors.cvc}</p>}

            <button
              type="submit"
              className={`w-full p-2 bg-blue-600 text-white rounded-lg ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isFormValid} // Disable button if form is not valid
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreditCardPayment;