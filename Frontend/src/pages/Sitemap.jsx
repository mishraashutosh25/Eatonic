import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export default function Sitemap() {
  const routes = [
    { title: "Landing Page", path: "/" },
    { title: "User Sign In", path: "/signin" },
    { title: "User Registration", path: "/signup" },
    { title: "User Dashboard", path: "/home" },
    { title: "About Eatonic", path: "/about" },
    { title: "Contact Us", path: "/contact" },
    { title: "Careers", path: "/careers" },
    { title: "Eatonic Blog", path: "/blog" },
    { title: "Partner with Us", path: "/partners" },
    { title: "Terms of Service", path: "/terms" },
    { title: "Privacy Policy", path: "/privacy" },
    { title: "Cookie Policy", path: "/cookie" },
  ];

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
        <div className="max-w-3xl mx-auto">
           <h1 className="text-4xl font-bold text-gray-900 mb-8">Sitemap Directory</h1>
           
           <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
             <ul className="grid sm:grid-cols-2 gap-4">
               {routes.map((route, i) => (
                 <li key={i}>
                   <Link to={route.path} className="text-red-500 hover:text-red-600 font-medium hover:underline p-2 block border-l-2 border-transparent hover:border-red-500 bg-gray-50 hover:bg-red-50 transition-all rounded-r-lg">
                     {route.title}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
