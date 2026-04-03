import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export default function ExplicitTerms() {
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
           <h1 className="text-4xl font-black text-gray-900 mb-2">Terms of Service</h1>
           <p className="text-gray-500 mb-10 border-b border-gray-100 pb-6">Effective Date: April 1, 2026</p>

           <div className="prose max-w-none text-gray-600 space-y-6">
             <p className="leading-relaxed font-semibold">By using the Eatonic application, you agree to abide by these operating rules.</p>
             
             <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Account Responsibilities</h2>
             <p className="leading-relaxed">Users are strictly responsible for their credentials. Any orders placed through your authenticated session are considered legally binding purchases.</p>
             
             <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Service Modifications</h2>
             <p className="leading-relaxed">Eatonic reserves the right to suspend operations in specific zones due to severe weather, driver shortages, or platform upgrades without prior notice.</p>

             <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Liability</h2>
             <p className="leading-relaxed">We solely provide a technology bridge. The merchant is exclusively responsible for food quality, allergies, and sanitary compliance.</p>
           </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
