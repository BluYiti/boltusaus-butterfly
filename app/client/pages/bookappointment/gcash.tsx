import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { account, databases } from '@/appwrite';
import { fetchClientId, fetchClientPsycho } from '@/hooks/userService';

interface GCashPaymentProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingsData {
  client: number; // The client associated with the appointment
  psychotherapist: number; // The psychotherapist associated with the appointment
  date: Date; // The datetime of the appointment
  slots: '09:00am' | '10:00am' | '11:00am' | '01:00pm' | '02:00pm' | '03:00pm' | '04:00pm'; // Enum for specific time slots
  status: 'success' | 'pending' | 'rescheduled' | 'happening' | 'missed' | 'paid' | 'disabled'; // Enum for the status of the appointment
  createdAt: Date; // The datetime when the appointment was created
  mode: 'f2f' | 'online'; // Enum for the mode of the appointment
}

const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async (BookingsData: BookingsData) => {
    try {
      const user = await account.get();
      const clientId = await fetchClientId(user.$id)
      const psychoId = await fetchClientPsycho(user.$id)

      const BookingsData = {
        client: clientId,
        psychotherapist, psychoId,

      };

      const addBookingsData = async () => {
        try {
          await databases.createDocument('Butterfly-Database', 'Bookings', 'unique()', BookingsData);
        } catch (error) {
          
        }
        
        console.log('Client Collection document added');
      }

      addBookingsData();
    } catch (err) {
      setError('Failed to fetch evaluation data.'); // Set an error message
      console.error(err); // Log the error for debugging
    }
  };

  fetchData();
}, []);

function addPaymentData(){

}

function handleBookAppointment() {
      
}

const GCashPayment: React.FC<GCashPaymentProps> = ({ isOpen, onClose, appointmentData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">GCash Payment</h1>
        <p className="text-gray-600">You have selected GCash as your payment method.</p>
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <img src="/images/gcashqr.png" alt="gcashqr" width={250} height={250}/>
        </div>
        <h2 className="text-2xl mt-2">Scan the qr code to pay and click the button if you have </h2>
        <button
          onClick={handleBookAppointment}
        >
          Next
        </button>
      </div>
    </Modal>
  );
};

export default GCashPayment;
