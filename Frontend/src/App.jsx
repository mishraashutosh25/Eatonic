import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Landing from './pages/Landing'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/userGetCurrentUser'
const serverUrl = import.meta.env.VITE_SERVER_URL

function App() {
  useGetCurrentUser();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App
