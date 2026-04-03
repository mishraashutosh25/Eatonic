import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 py-4 px-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src="/logo.png" alt="Eatonic" className="h-10 w-auto object-contain" />
          </Link>
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
           <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Cookie size={32} />
           </div>
           <h1 className="text-4xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
           <p className="text-lg text-gray-600 mb-12">
             Yes, we use cookies! But the digital kind. 
           </p>

           <div className="bg-white rounded-2xl border border-gray-200 p-10 text-left shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-800">Essential Cookies</h3>
              <p className="text-gray-600 border-b border-gray-100 pb-6">Required for the authentication and basic cart functionality. You cannot disable these if you wish to order food on Eatonic.</p>
              
              <h3 className="text-xl font-bold text-gray-800">Analytics & Tracking</h3>
              <p className="text-gray-600">Used strictly to understand user flows, identify platform bottlenecks, and improve the application speed. You can opt-out via your browser settings.</p>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
