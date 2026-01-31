import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

import useGetCurrentUser from "./hooks/userGetCurrentUser";
import useGetCity from "./hooks/useGetCity";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import useGetMyShop from "./hooks/useGetMyShop";

function App() {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Landing theme={theme} setTheme={setTheme} />} />

      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
