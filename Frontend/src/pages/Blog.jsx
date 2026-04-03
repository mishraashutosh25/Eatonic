import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export default function Blog() {
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
        <div className="max-w-5xl mx-auto">
           <h1 className="text-4xl font-bold text-gray-900 mb-4">Eatonic Insights</h1>
           <p className="text-lg text-gray-600 mb-12">Stories, tips, and behind-the-scenes from your favorite food delivery app.</p>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                 <div key={item} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                       <span className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 block">Technology</span>
                       <h3 className="text-xl font-bold text-gray-900 mb-2">How our AI routes your food faster</h3>
                       <p className="text-gray-600 text-sm mb-4">A deep dive into the technology powering Eatonic's 15-minute delivery promise.</p>
                       <a className="text-red-500 font-semibold text-sm hover:underline cursor-pointer">Read article →</a>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
