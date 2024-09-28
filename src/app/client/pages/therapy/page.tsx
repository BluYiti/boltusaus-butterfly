import React from 'react';

const TherapyPage: React.FC = () => {
  return (
    <div className="text-black min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <button className="text-white text-lg">&larr;</button>
        <h1 className="text-xl font-bold">Therapy</h1>
        <div className="relative">
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-4 w-4 text-xs flex items-center justify-center">1</span>
          <button className="text-white text-lg">&#128276;</button> {/* Notification bell */}
        </div>
        <button className="text-white text-lg">&#9776;</button> {/* Menu */}
      </header>

      {/* Main Content */}
      <div className="p-4">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-600 text-sm font-medium">
              <th className="p-3">Appointments</th>
              <th className="p-3">Fee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Appointment 1 */}
            <tr className="border-b">
              <td className="p-3">Week 1</td>
              <td className="p-3">Php</td>
              <td className="p-3"></td>
              <td className="p-3">
                <span className=""></span>
              </td>
              <td className="p-3 flex justify-end space-x-2">
                <button className="bg-blue-400 text-white px-3 py-1 rounded">Resched</button>
                <button className="bg-red-400 text-white px-3 py-1 rounded">Cancel</button>
              </td>
            </tr>

            {/* Appointment 2 */}
            <tr className="border-b">
              <td className="p-3">Week 2</td>
              <td className="p-3">Php</td>
              <td className="p-3"></td>
              <td className="p-3">
                <span className=""></span>
              </td>
              <td className="p-3 flex justify-end space-x-2">
                <button className="bg-blue-400 text-white px-3 py-1 rounded">Resched</button>
                <button className="bg-red-400 text-white px-3 py-1 rounded">Cancel</button>
              </td>
            </tr>

            {/* Appointment 3 */}
            <tr>
              <td className="p-3">Week 3</td>
              <td className="p-3">Php</td>
              <td className="p-3"></td>
              <td className="p-3">
                <span className=""></span>
              </td>
              <td className="p-3 flex justify-end space-x-2">
                <button className="bg-blue-400 text-white px-3 py-1 rounded">Resched</button>
                <button className="bg-red-400 text-white px-3 py-1 rounded">Cancel</button>
              </td>
            </tr>

                {/* Appointment 4 */}
                <tr>
              <td className="p-3">Week 4</td>
              <td className="p-3">Php</td>
              <td className="p-3"></td>
              <td className="p-3">
                <span className=""></span>
              </td>
              <td className="p-3 flex justify-end space-x-2">
                <button className="bg-blue-400 text-white px-3 py-1 rounded">Resched</button>
                <button className="bg-red-400 text-white px-3 py-1 rounded">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded">PAY</button>
        </div>
      </div>
    </div>
  );
};

export default TherapyPage;
