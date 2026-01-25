import React from 'react'
import Nav from './Nav'

function UserDashboard() {
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100'>
        <Nav/>
        {/* Add user specific content here */}
      </div>
  )
}

export default UserDashboard