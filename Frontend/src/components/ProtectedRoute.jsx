import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const userData = useSelector((state) => state.user.userData);

  if (userData === undefined) return null; // loading
  return userData ? children : <Navigate to="/signin" />;
}
