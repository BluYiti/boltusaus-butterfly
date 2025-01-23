import React from 'react';

interface DayGridProps {
  selectedDay: number | null;
  selectedMonth: string | null;
}

const DayGrid: React.FC<DayGridProps> = ({ selectedDay, selectedMonth }) => {
  if (!selectedDay || !selectedMonth) {
    return null;
  }

  return (
    <div>
        <div>
            <h1 className="text-2xl font-bold text-[#3585ff] mt-7">{selectedMonth} {selectedDay.toString()} Appointments</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
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
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {/* Example row */}
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            John Doe
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            10:00 AM
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Confirmed
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                Edit
                            </a>
                        </td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default DayGrid;