import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
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

      <main className="flex-grow py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
           
           <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Eatonic</h1>
              <p className="text-gray-600 leading-relaxed mb-10">
                 Whether you have a question about your order, want to partner with us, or just want to say hi, our team is always ready to help you.
              </p>

              <div className="space-y-8">
                 <div className="flex gap-4 items-start">
                    <div className="bg-red-50 p-3 rounded-full text-red-500 mt-1">
                       <Phone size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900 mb-1">Customer Support</h3>
                       <p className="text-gray-500 text-sm">Call us anytime 24/7</p>
                       <p className="font-medium text-gray-900 mt-1">+91 (1800) 123-4567</p>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="bg-red-50 p-3 rounded-full text-red-500 mt-1">
                       <Mail size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900 mb-1">Email inquiries</h3>
                       <p className="text-gray-500 text-sm">We'll get back to you within 24 hours</p>
                       <p className="font-medium text-gray-900 mt-1">support@eatonic.com</p>
                    </div>
                 </div>

                 <div className="flex gap-4 items-start">
                    <div className="bg-red-50 p-3 rounded-full text-red-500 mt-1">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900 mb-1">Headquarters</h3>
                       <p className="text-gray-500 text-sm leading-relaxed">
                          Eatonic Tech Towers,<br/>
                          Sector 45, Vijay Nagar,<br/>
                          Indore, MP 452010, India
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="John Doe" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="john@example.com" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500" placeholder="How can we help you?"></textarea>
                 </div>
                 <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Send Message <Send size={18} />
                 </button>
              </form>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
