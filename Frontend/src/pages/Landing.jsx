// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger the hero animation for more drama
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 py-4">
          <Link to="/" className="group">
            <h1
              className={`text-3xl font-bold tracking-tight transition-all duration-500 ${
                scrolled 
                  ? "text-gray-900" 
                  : "text-white drop-shadow-lg"
              }`}
            >
              Eatonic
              <span className={`inline-block ml-1 transition-all duration-500 ${
                scrolled ? "text-red-600" : "text-red-400"
              }`}>.</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            <a
              href="#features"
              className={`text-sm font-medium transition-all duration-300 hover:text-red-600 relative group ${
                scrolled ? "text-gray-600" : "text-white/90"
              }`}
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#how-it-works"
              className={`text-sm font-medium transition-all duration-300 hover:text-red-600 relative group ${
                scrolled ? "text-gray-600" : "text-white/90"
              }`}
            >
              How it works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/signin"
              className={`text-sm font-semibold transition-all duration-300 hover:text-red-600 px-4 py-2 ${
                scrolled ? "text-gray-700" : "text-white"
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 ${
                scrolled
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5"
                  : "bg-white text-gray-900 hover:bg-white/90 shadow-lg"
              }`}
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=90')",
              transform: "scale(1.1)",
            }}
          />
          {/* Refined gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/75 via-gray-900/60 to-black/70" />
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
        </div>

        {/* Hero Content with Staggered Animation */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className={`mb-8 inline-block transition-all duration-1000 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <span className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium shadow-xl inline-flex items-center gap-2">
              <span className="text-lg">🍽️</span>
              <span>Your food journey starts here</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Craving something
            <span className="block mt-3 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              delicious?
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-xl sm:text-2xl mb-12 text-gray-100 max-w-2xl mx-auto leading-relaxed font-light transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Discover extraordinary dining experiences from local favorites to
            hidden gems, all at your fingertips.
          </p>

          {/* Trust Indicators with Icon Enhancement */}
          <div
            className={`flex flex-wrap justify-center gap-8 text-white/90 text-sm transition-all duration-1000 delay-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="font-medium">10,000+ restaurants</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="font-medium">4.8 average rating</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/10">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="font-medium">50,000+ happy users</span>
            </div>
          </div>
        </div>

        {/* Refined Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Scroll</span>
            <svg
              className="w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-28 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900 leading-tight">
              Why choose Eatonic?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience food delivery reimagined with features designed for
              your convenience
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Order Online",
                desc: "Browse menus, customize orders, and get food delivered to your doorstep in minutes",
                img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600",
                icon: "🚀",
                gradient: "from-orange-400 to-red-500",
                color: "red",
              },
              {
                title: "Dine In",
                desc: "Discover and reserve tables at the city's finest restaurants with exclusive offers",
                img: "https://i.pinimg.com/736x/93/32/08/933208855a4b4d89b931899b9381f291.jpg",
                icon: "🍽️",
                gradient: "from-purple-400 to-pink-500",
                color: "purple",
              },
              {
                title: "Nightlife",
                desc: "Explore curated bars, clubs, and lounges for unforgettable evening experiences",
                img: "https://i.pinimg.com/736x/ce/3c/fb/ce3cfb6b672a3fe525f11345566f482d.jpg",
                icon: "🌙",
                gradient: "from-blue-400 to-indigo-500",
                color: "blue",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                  <div className="absolute bottom-5 left-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-5 text-[15px]">
                    {item.desc}
                  </p>
                  <button
                    className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}
                  >
                    <span>Learn more</span>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-28 px-6 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/30 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Process</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-5 text-gray-900 leading-tight">
              Getting started is easy
            </h2>
            <p className="text-xl text-gray-600">
              Your perfect meal is just three steps away
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-200 to-transparent" />
            
            {[
              {
                step: "01",
                title: "Choose your favorite",
                desc: "Browse through hundreds of restaurants and cuisines in your area",
                icon: "🔍",
              },
              {
                step: "02",
                title: "Place your order",
                desc: "Customize your meal and complete your order with secure payment",
                icon: "🛒",
              },
              {
                step: "03",
                title: "Enjoy your meal",
                desc: "Track your order in real-time and enjoy hot, fresh food at your door",
                icon: "😋",
              },
            ].map((item, index) => (
              <div key={item.step} className="text-center group relative">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-5xl shadow-xl group-hover:shadow-2xl group-hover:shadow-red-500/30 group-hover:scale-110 transition-all duration-500 relative z-10">
                    {item.icon}
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center font-bold text-red-600 border-2 border-red-100 group-hover:scale-110 transition-transform duration-500 z-20">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px] max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-24 px-6 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
            {[
              { number: "10K+", label: "Restaurants" },
              { number: "50K+", label: "Active Users" },
              { number: "100K+", label: "Orders Delivered" },
              { number: "4.8★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-6xl font-bold mb-3 group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </div>
                <div className="text-white/90 text-sm uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-32 px-6 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-[2rem] shadow-xl p-12 md:p-20 border border-gray-100 relative overflow-hidden group">
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                Ready to satisfy your cravings?
              </h2>

              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join thousands of food lovers who trust Eatonic for their daily
                dining needs. Start your culinary adventure today.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
                <Link
                  to="/signup"
                  className="inline-block px-12 py-4 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105 active:scale-100"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/signin"
                  className="inline-block px-12 py-4 rounded-full border-2 border-gray-200 text-gray-700 font-semibold hover:border-red-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}