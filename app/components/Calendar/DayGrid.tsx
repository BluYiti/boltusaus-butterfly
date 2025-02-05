import React, { useEffect, useState } from 'react';
import { account } from '@/appwrite';
import { fetchAppointmentsForDay, fetchPsychoId, fetchPaymentStatus } from '@/hooks/userService';
import RescheduleModal from '@/components/Reschedule';

interface DayGridProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const DayGrid: React.FC<DayGridProps> = ({ selectedDay, selectedMonth }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [, setPsychoId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await account.get();
        const psychoId = await fetchPsychoId(user.$id);
        setPsychoId(psychoId);

        if (selectedDay && selectedMonth && psychoId) {
          const appointments = await fetchAppointmentsForDay(selectedDay, selectedMonth, psychoId);
          const appointmentsWithPaymentStatus = await Promise.all(
            appointments.map(async (appointment) => {
              const paymentStatus = await fetchPaymentStatus(appointment.$id);
              return { ...appointment, paymentStatus };
            })
          );

          setAppointments(appointmentsWithPaymentStatus || []);
        }
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDay, selectedMonth]);

  // Open modal function
  const handleRescheduleClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  if (!selectedDay || !selectedMonth) {
    return null;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-[#3585ff]">{selectedMonth} {selectedDay.toString()} Appointments</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <img src="/gifs/butterfly.gif" alt="Loading" className="h-8 w-8" />
          <span className="ml-2 text-blue-500">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {appointments.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg text-blue-500">
                No appointments found for this day.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.$id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.client?.firstname || 'N/A'} {appointment.client?.lastname || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.slots}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.paymentStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.paymentStatus === 'paid' || appointment.paymentStatus === 'rescheduled' ? (
                          <button 
                            className="text-white p-[0.3rem] rounded-xl bg-amber-400 hover:text-indigo-900"
                            onClick={() => handleRescheduleClick(appointment)}
                          >
                            Reschedule
                          </button>
                        ) : (
                          <span className="text-gray-500">Not Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Reschedule Modal */}
      {isModalOpen && (
        <RescheduleModal 
        onClose={closeModal} 
        appointmentId={selectedAppointment?.$id} 
      >
        <h3 className="text-lg font-semibold mb-2">Reschedule Appointment</h3>
        <p className="text-gray-600 mb-4">
          Reschedule appointment for:
        </p>
        <p className="text-md font-medium">
          {selectedMonth} {selectedDay}, {selectedAppointment?.slots}
        </p>
      </RescheduleModal>      
      
      )}
    </div>
  );
};

export default DayGrid;
