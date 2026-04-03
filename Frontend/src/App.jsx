import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import CreateEditShop from "./pages/CreateEditShop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Partners from "./pages/Partners";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import CookiePolicy from "./pages/CookiePolicy";
import Sitemap from "./pages/Sitemap";
import ChefMenuPage from "./pages/ChefMenuPage";
import MyOrdersPage from "./pages/MyOrdersPage";

import useGetCurrentUser from "./hooks/userGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import useGetHomeChefs from "./hooks/useGetHomeChefs";

function App() {
  // 🔥 bas call karo
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useGetHomeChefs();

  // 🔥 Redux se user lo
  const userData = useSelector((state) => state.user.userData);

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
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookie" element={<CookiePolicy />} />
      <Route path="/sitemap" element={<Sitemap />} />

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

      <Route
        path="/create-edit-shop"
        element={
          userData ? <CreateEditShop /> : <Navigate to="/signin" replace />
        }
      />

      <Route
        path="/add-food"
        element={
          userData ? <AddItem /> : <Navigate to="/signin" replace />
        }
      />

      <Route
        path="/edit-item/:itemId"
        element={
          userData ? <EditItem /> : <Navigate to="/signin" replace />
        }
      />

      {/* Public — anyone can view a chef's menu */}
      <Route path="/chef/:shopId" element={<ChefMenuPage />} />

      {/* User: My Orders */}
      <Route
        path="/my-orders"
        element={userData ? <MyOrdersPage /> : <Navigate to="/signin" replace />}
      />
    </Routes>
  );
}

export default App;
