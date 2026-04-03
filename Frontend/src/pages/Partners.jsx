import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export default function Partners() {
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
        <div className="max-w-4xl mx-auto text-center">
           <h1 className="text-4xl font-bold text-gray-900 mb-6">Grow your business with Eatonic</h1>
           <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
             Join thousands of restaurants who are expanding their reach and increasing their revenue by partnering with Eatonic.
           </p>

           <div className="grid md:grid-cols-2 gap-8 mb-12 text-left">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Partnerships</h3>
                 <p className="text-gray-600 mb-6">List your menu on Eatonic and get access to dedicated delivery drivers and a massive new customer base.</p>
                 <button className="text-red-500 font-semibold hover:underline">Apply to be a Restaurant Partner</button>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Accounts</h3>
                 <p className="text-gray-600 mb-6">Treat your employees with Eatonic Corporate. Simplified billing, bulk orders, and exclusive enterprise discounts.</p>
                 <button className="text-red-500 font-semibold hover:underline">Apply for Corporate Account</button>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
