// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  
  const mainImageY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const accentImage1Y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const accentImage2Y = useTransform(scrollYProgress, [0, 0.5], [0, -120]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Smooth Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Subtle Animated Gradients */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-[150px]"
        />
        
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-[150px]"
        />
        
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.15, 1],
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-400/15 via-emerald-400/15 to-transparent rounded-full blur-[120px]"
        />

        {/* Fine Grain */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* NAVBAR */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-950/70 backdrop-blur-2xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">
            Eatonic
          </h1>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 group"
            >
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-orange-400 to-emerald-400 group-hover:w-full transition-all duration-500" />
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </motion.header>

      {/* HERO */}
      <section className="relative px-6 lg:px-8 pt-32 pb-24 lg:pt-48 lg:pb-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <motion.div 
              style={{ y: heroY, opacity: heroOpacity }} 
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-300">Available in your city</span>
                </motion.div>

                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
                  Your favorite food,{" "}
                  <span className="relative inline-block mt-2">
                    <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-emerald-400 bg-clip-text text-transparent">
                      delivered instantly
                    </span>
                  </span>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl text-slate-400 leading-relaxed mb-12 max-w-xl"
                >
                  Browse local restaurants, order with one tap, and track your delivery in real-time.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to="/signup"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-emerald-500 text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                  >
                    Login
                  </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
                >
                  <div>
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-sm text-slate-500 mt-1">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-slate-500 mt-1">Restaurants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">4.9★</div>
                    <div className="text-sm text-slate-500 mt-1">Rating</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Content - Food Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: mainImageY }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                className="relative"
              >
                {/* Soft Glow */}
                <div className="absolute -inset-8 bg-gradient-to-br from-orange-500/25 via-orange-400/20 to-emerald-500/25 blur-[60px] opacity-60" />
                
                {/* Main Image */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-orange-400 to-emerald-500 rounded-[2rem] opacity-50 blur-sm" />
                  
                  <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-[2rem] p-2">
                    <img
                      src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=90"
                      alt="Premium Indian Food"
                      className="w-full rounded-[1.75rem] shadow-2xl"
                    />
                    
                    {/* Glass Reflection */}
                    <div className="absolute inset-2 rounded-[1.75rem] bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />
                  </div>
                </div>

                {/* Floating Badges */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-orange-500/30 backdrop-blur-sm"
                >
                  <div className="text-xl font-bold">30min</div>
                  <div className="text-xs opacity-90">Delivery</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/30 backdrop-blur-sm"
                >
                  <div className="text-xl font-bold">₹99</div>
                  <div className="text-xs opacity-90">From</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Accent Images - Background Layer */}
          <div className="hidden xl:block pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2, duration: 1.5 }}
              style={{ y: accentImage1Y }}
              className="absolute right-16 bottom-24 w-72"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
                  alt=""
                  className="w-full rounded-2xl shadow-xl opacity-60 blur-[1px]"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 2.2, duration: 1.5 }}
              style={{ y: accentImage2Y }}
              className="absolute left-16 bottom-32 w-64"
            >
              <motion.div
                animate={{ y: [0, 25, 0] }}
                transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2"
                  alt=""
                  className="w-full rounded-2xl shadow-lg opacity-50 blur-[1px]"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">
                Explore delicious moments
              </span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From local favorites to exotic cuisines
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "photo-1600891964599-f61ba0e24092",
              "photo-1555939594-58d7cb561ad1",
              "photo-1543352634-8730e2b3b4e5",
              "photo-1565299624946-b28f40a0ae38",
            ].map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-xl bg-slate-900/50 p-1">
                  <img
                    src={`https://images.unsplash.com/${id}`}
                    alt="Food"
                    className="w-full rounded-lg transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="absolute inset-0 rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 lg:px-8 py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-emerald-500" />
        
        <motion.div
          animate={{
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Ready to get started?
            </h2>

            <p className="text-xl text-white/95 mb-12">
              Join thousands ordering with Eatonic every day
            </p>

            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-xl bg-white text-slate-900 shadow-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Create Account
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

            <p className="mt-6 text-white/80 text-sm">
              No credit card required • Free first delivery
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
