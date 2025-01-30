import React, { useEffect, useState } from 'react';
import { account } from '@/appwrite';
import { fetchAppointmentsForDay, fetchPsychoId, fetchPaymentStatus } from '@/hooks/userService';

interface DayGridProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const DayGrid: React.FC<DayGridProps> = ({ selectedDay, selectedMonth }) => {
  const [loading, setLoading] = useState<boolean>(true);  // General loading state
  const [, setError] = useState<string | null>(null);
  const [, setPsychoId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]); // State to store appointments

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const user = await account.get();
        const psychoId = await fetchPsychoId(user.$id);
        setPsychoId(psychoId);

        if (selectedDay && selectedMonth && psychoId) {
          const appointments = await fetchAppointmentsForDay(selectedDay, selectedMonth, psychoId);
          
          // Fetch payment status for each appointment
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
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, [selectedDay, selectedMonth]);

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
            <div className="flex justify-center items-center">
          <img src="/gifs/butterfly.gif" alt="Loading" className="h-8 w-8" />
          <span className="ml-2 text-blue-500">Loading...</span>
            </div>
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs text-bold font-medium text-gray-500 uppercase tracking-wider">
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
                      {appointment.paymentStatus === 'paid' || appointment.paymentStatus === 'reschedule'  ? (
                      <a href="#" className="text-white p-[0.3rem] rounded-xl bg-amber-400 hover:text-indigo-900">
                        Reschedule
                      </a>
                      ) : (
                      <span className="text-gray-500">Not Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DayGrid;