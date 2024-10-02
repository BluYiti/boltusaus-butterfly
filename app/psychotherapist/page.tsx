'use client'

import React from 'react';
import { useRouter } from 'next/navigation';


const Dashboard = () => {
  const router = useRouter();
  const handleAvailabilityClick = () => {
  router.push('/psychotherapist/pages/availabilitycalendar/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="/psychotherapist" className="hover:text-black">Dashboard</a>
          <a href="/psychotherapist/pages/pclientlist" className="hover:text-black">Client List</a>
          <a href="/psychotherapist/pages/preports" className="hover:text-black">Reports</a>
          <a href="#" className="hover:text-black">Recordings</a>
          <a href="/psychotherapist/pages/presources" className="hover:text-black">Resources</a>
          <a href="/psychotherapist/pages/paboutme" className="hover:text-black">About</a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Section */}
        <div className="lg:col-span-2">
          {/* Greeting Box */}
          <div className="bg-blue-500 text-white p-6 rounded-xl flex items-center space-x-4">
            <div>
              <img src="/avatar.png" alt="Avatar" className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Good day, Ma'am Hanni!</h2>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="mt-6 bg-white shadow-md p-4 rounded-xl">
            <h3 className="text-xl font-semibold">Upcoming Sessions</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-200 text-teal-600 rounded-full h-10 w-10 flex items-center justify-center font-semibold">DW</div>
                  <span>Denzel White</span>
                </div>
                <span>8:00 AM</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-rose-200 text-rose-600 rounded-full h-10 w-10 flex items-center justify-center font-semibold">GS</div>
                  <span>Gwen Stacey</span>
                </div>
                <span>10:00 AM</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-200 text-indigo-600 rounded-full h-10 w-10 flex items-center justify-center font-semibold">RJ</div>
                  <span>Robert Junior</span>
                </div>
                <span>1:00 PM</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-200 text-amber-600 rounded-full h-10 w-10 flex items-center justify-center font-semibold">HA</div>
                  <span>Hev Abigail</span>
                </div>
                <span>2:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Availability Calendar */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Availability Calendar</h3>
              <button onClick={handleAvailabilityClick} 
              className="bg-green-500 text-white px-4 py-2 rounded-lg">Update</button>
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <div className="grid grid-cols-7 gap-2 text-sm text-gray-600">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  <div className="text-gray-400">29</div><div className="text-gray-400">30</div><div className="text-gray-400">31</div>
                  <div className="text-red-500">1</div><div className="text-red-500">2</div><div className="text-red-500">3</div><div className="text-red-500">4</div>
                  <div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div><div>11</div>
                  <div>12</div><div>13</div><div>14</div><div>15</div><div>16</div><div>17</div><div>18</div>
                  <div>19</div><div>20</div><div>21</div><div>22</div><div>23</div><div>24</div><div>25</div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Payments */}
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold">Client Payments</h3>
            <div className="mt-4">
              <p><strong>Raianna Gayle</strong> has cancelled her appointment. View request to initiate refund.</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
