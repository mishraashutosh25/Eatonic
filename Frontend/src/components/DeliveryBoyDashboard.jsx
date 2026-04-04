import React from 'react'
import Nav from './Nav'
import { Footer } from './Footer'

function DeliveryBoyDashboard() {
  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100 flex flex-col'>
      <Nav />
      <div className='flex-1 flex flex-col items-center justify-center pt-[68px]'>
        <div className='text-center p-8'>
          <div className='text-6xl mb-4'>🛵</div>
          <h1 className='text-3xl font-extrabold text-gray-900 mb-2'>Delivery Dashboard</h1>
          <p className='text-gray-500'>Delivery Boy features coming soon!</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default DeliveryBoyDashboard