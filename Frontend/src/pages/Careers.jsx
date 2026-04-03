import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Briefcase } from "lucide-react";

export default function Careers() {
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

      <main className="flex-grow pb-20">
        <div className="w-full h-[40vh] min-h-[350px] relative flex items-center justify-center mb-16 overflow-hidden">
           <img 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-[10s]" 
              alt="Restaurant Team" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-black/40"></div>
           <div className="relative z-10 text-center px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-6">
                 <Briefcase size={16} /> Open Positions
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-xl">
                 Join the <span className="text-red-500">Eatonic</span> Team
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto font-medium">
                 We are shaping the future of food delivery. If you're hungry for impact, you belong here.
              </p>
           </div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-6">

           <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No open positions right now</h3>
              <p className="text-gray-500 mb-6">We're currently fully staffed, but we're always on the lookout for great talent. Send us your resume and we'll keep you in mind for future roles.</p>
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                 Submit Resume
              </button>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
