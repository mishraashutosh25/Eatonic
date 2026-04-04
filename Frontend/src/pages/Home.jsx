import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'

function Home() {

  const { userData } = useSelector(state => state.user);

  if (!userData) return null; // ya loader

  return (
    <div className='w-full min-h-[100vh] flex flex-col'>
      {userData.role === "user" && <UserDashboard />}
      {userData.role === "owner" && <OwnerDashboard />}
      {userData.role === "deliveryBoy" && <DeliveryBoyDashboard />}
    </div>
  )
}

export default Home