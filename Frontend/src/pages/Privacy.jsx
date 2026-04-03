import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src="/logo.png" alt="Eatonic" className="h-10 w-auto object-contain" />
          </Link>
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors">
            Back Home
          </Link>
        </div>
      </header>

      <main className="flex-grow py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-gray-200">
           <h1 className="text-4xl font-black text-gray-900 mb-2">Privacy Policy</h1>
           <p className="text-gray-500 mb-10 border-b border-gray-100 pb-6">Effective Date: April 1, 2026</p>

           <div className="prose max-w-none text-gray-600 space-y-6">
             <p className="leading-relaxed font-semibold">Eatonic values your privacy and is fully committed to protecting your personal data globally.</p>
             
             <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Information We Collect</h2>
             <p className="leading-relaxed">We collect strictly what is needed: delivery location coordinates, name, primary contact number, and hashed payment tokens. We do not store raw credit card numbers on Eatonic servers.</p>
             
             <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. How We Use It</h2>
             <p className="leading-relaxed">Your location data is fed into our proprietary ETA engine to guarantee hot food delivery. We also utilize anonymized order history to recommend better cuisines via our machine learning systems.</p>

             <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Data Deletion</h2>
             <p className="leading-relaxed">You hold the right to be forgotten. Users can request a complete data wipe bypassing an email to privacy@eatonic.com. The process is finalized within 15 business days.</p>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
