import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Landing from './pages/Landing'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/userGetCurrentUser'
import Home from './pages/Home'
import { useSelector } from 'react-redux'
import useGetCity from './hooks/useGetCity'
const serverUrl = import.meta.env.VITE_SERVER_URL

function App() {
  useGetCurrentUser();
  useGetCity();
   const userData = useSelector((state) => state.user.userData);
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to={"/home"} />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to={"/home"} />} />
      <Route path="/forgot-password" element={!userData ? <ForgotPassword /> : <Navigate to={"/home"} />} />
      <Route path='/home' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
    </Routes>
  )
}

export default App
