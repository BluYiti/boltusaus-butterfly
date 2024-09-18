import React from 'react'

const Announcements = () => {
  return (
    <div className='bg-white p-4 rounded-md'>
        <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Announcements</h1>
            <span className='text-xs text-gray-400'>View All</span>
        </div>
        <div className='bg-blue-600 rounded-xl p-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-medium '>There are no announcements yet.</h2>
                <span className='text-xs text-gray-400 bg-white rounded-full px-1 py-1'>2024-09-16</span>
            </div>
        </div>
    </div>
  )
}

export default Announcements