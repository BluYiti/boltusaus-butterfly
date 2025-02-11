import React, { useEffect, useState, useCallback } from 'react';
import { account } from '@/appwrite';
import { fetchAppointmentsForDay, fetchPsychoId, fetchPaymentStatus } from '@/hooks/userService';
import RescheduleModal from '@/components/Reschedule';

interface DayGridProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const DayGrid: React.FC<DayGridProps> = ({ selectedDay, selectedMonth }) => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [psychoId, setPsychoId] = useState<string | null>(null);

  // Fetch psychoId only once per session
  useEffect(() => {
    const fetchPsycho = async () => {
      try {
        const user = await account.get();
        const id = await fetchPsychoId(user.$id);
        setPsychoId(id);
      } catch (error) {
        console.error('Failed to fetch psychoId:', error);
      }
    };

    fetchPsycho();
  }, []);

  // Fetch appointments whenever selectedDay, selectedMonth, and psychoId change
  const fetchData = useCallback(async () => {
    if (!selectedDay || !selectedMonth || !psychoId) return;

    setLoading(true);
    try {
      const appointments = await fetchAppointmentsForDay(selectedDay, selectedMonth, psychoId);
      const appointmentsWithPaymentStatus = await Promise.all(
        appointments.map(async (appointment) => ({
          ...appointment,
          paymentStatus: await fetchPaymentStatus(appointment.$id),
        }))
      );

      setAppointments(appointmentsWithPaymentStatus);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDay, selectedMonth, psychoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  if (!selectedDay || !selectedMonth) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#3585ff]">
        {selectedMonth} {selectedDay.toString()} Appointments
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <img src="/gifs/butterfly.gif" alt="Loading" className="h-8 w-8" />
          <span className="ml-2 text-blue-500">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {appointments.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg text-blue-500">No appointments found for this day.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Client', 'Time', 'Status', 'Payment', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
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
      {isModalOpen && selectedAppointment && (
        <RescheduleModal onClose={closeModal} appointmentId={selectedAppointment.$id}>
          <h3 className="text-lg font-semibold mb-2">Reschedule Appointment</h3>
          <p className="text-gray-600 mb-4">Reschedule appointment for:</p>
          <p className="text-md font-medium">
            {selectedMonth} {selectedDay}, {selectedAppointment.slots}
          </p>
        </RescheduleModal>
      )}
    </div>
  );
};

export default DayGrid;
