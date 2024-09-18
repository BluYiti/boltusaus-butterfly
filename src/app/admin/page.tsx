'use client'

import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="text-black p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl mb-4">Admin</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Search username
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
        </div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Search
            </button>
          </div>
          <div>
            <select className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>Ascending</option>
              <option>Descending</option>
            </select>
            <select className="ml-2 shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
          <div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Add account
            </button>
          </div>
        </div>
        {/* Table for Users */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">JuanDelaCruz@gmail.com</td>
                <td className="border px-4 py-2">Juan Joseph Dela Cruz</td>
                <td className="border px-4 py-2">c</td>
                <td className="border px-4 py-2">
                  <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                    Update
                  </button>
                  <button className="bg-red-500 ml-3 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
              {/* More rows */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
