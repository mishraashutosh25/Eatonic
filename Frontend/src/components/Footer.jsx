import { Linkedin, Instagram, Youtube, Facebook, Twitter, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-6 sm:px-10 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
         {/* Brand & Social */}
         <div className="w-full md:w-1/3">
           <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-4">
             <img 
               src="/logo.png" 
               alt="Eatonic Logo" 
               className="h-12 sm:h-16 w-auto object-contain scale-[1.4] origin-left" 
             />
           </Link>
           <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-6">
             Your ultimate destination for discovering incredible food and seamless delivery experiences.
           </p>
           <div className="flex gap-3">
              {[Linkedin, Instagram, Youtube, Facebook, Twitter].map((Icon, i) => (
                 <a key={i} href="#" className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Icon size={18} strokeWidth={1.5} />
                 </a>
              ))}
           </div>
         </div>

         {/* Links Group */}
         <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
               <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Company</h4>
               <ul className="space-y-2.5 text-[15px]">
                  <li><Link to="/about" className="text-gray-500 hover:text-red-500 transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-500 hover:text-red-500 transition-colors">Contact</Link></li>
                  <li><Link to="/careers" className="text-gray-500 hover:text-red-500 transition-colors">Careers</Link></li>
                  <li><Link to="/blog" className="text-gray-500 hover:text-red-500 transition-colors">Blog</Link></li>
                  <li><Link to="/partners" className="text-gray-500 hover:text-red-500 transition-colors">Partners</Link></li>
               </ul>
            </div>
            
            <div>
               <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Legal</h4>
               <ul className="space-y-2.5 text-[15px]">
                  <li><Link to="/terms" className="text-gray-500 hover:text-red-500 transition-colors">Terms of Service</Link></li>
                  <li><Link to="/privacy" className="text-gray-500 hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/cookie" className="text-gray-500 hover:text-red-500 transition-colors">Cookie Policy</Link></li>
                  <li><Link to="/sitemap" className="text-gray-500 hover:text-red-500 transition-colors">Sitemap</Link></li>
               </ul>
            </div>

            <div>
               <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Our Apps</h4>
               <div className="flex flex-col gap-3">
                  <button className="w-[140px] bg-black text-white px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
                     <svg viewBox="0 0 384 512" className="w-4 h-4" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                     <div className="text-left leading-none">
                       <span className="text-[10px] text-gray-300 block mb-0.5">Download on</span>
                       <span className="font-bold text-[13px]">App Store</span>
                     </div>
                  </button>
                  <button className="w-[140px] bg-black text-white px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
                     <svg viewBox="0 0 512 512" className="w-4 h-4 text-green-400" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
                     <div className="text-left leading-none">
                       <span className="text-[10px] text-gray-300 block mb-0.5">Get it on</span>
                       <span className="font-bold text-[13px]">Google Play</span>
                     </div>
                  </button>
               </div>
            </div>
         </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-gray-100 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
         <p>© {new Date().getFullYear()} Eatonic. All rights reserved.</p>
         <div className="flex items-center gap-1.5 font-medium">
            Made with <span className="text-red-500 text-lg">♥</span> in India
         </div>
      </div>
    </footer>
  );
}
