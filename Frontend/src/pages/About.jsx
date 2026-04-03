import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Users, Target, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 py-4 px-6 fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src="/logo.png" alt="Eatonic" className="h-10 w-auto object-contain" />
          </Link>
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow pb-20">
        <div className="w-full h-[45vh] min-h-[400px] relative flex items-center justify-center mb-16 overflow-hidden">
           <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-[15s]" 
              alt="Food Delivery" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-black/30"></div>
           <div className="relative z-10 text-center px-6">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
                 About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Eatonic</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto font-medium">
                We are on a mission to redefine food delivery. From connecting you to your favorite local diners to introducing you to hidden culinary gems, Eatonic is your ultimate food companion.
              </p>
           </div>
        </div>

        <div className="max-w-4xl mx-auto px-6">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Founded with a passion for great food and seamless technology, Eatonic started as a simple idea: what if getting amazing meals delivered to your door was as effortless and enjoyable as eating them? 
            </p>
             <p className="text-gray-600 leading-relaxed">
              Today, Eatonic partners with thousands of top-rated restaurants, empowering local businesses and bringing joy to millions of food lovers every single day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                 <Target size={24} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
               <p className="text-gray-600 leading-relaxed">To ensure nobody ever has a bad meal. We strive to provide unparalleled choice, extreme convenience, and reliable deliveries.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                 <Heart size={24} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Our Core Values</h3>
               <p className="text-gray-600 leading-relaxed">Customer obsesssion, operational excellence, and supporting our local restaurant partners are at the heart of everything we do.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
