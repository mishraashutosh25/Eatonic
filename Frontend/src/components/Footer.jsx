import { Linkedin, Instagram, Youtube, Facebook, X } from "lucide-react";
import { motion } from "framer-motion";

const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export function Footer() {
  return (
    <footer className="bg-black text-slate-300 px-6 md:px-12 pt-20 pb-10">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.1 }} className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12">
        <motion.div variants={item} className="col-span-2">
          <h2 className="text-3xl font-bold text-white mb-4">Eatonic 🍽️</h2>
          <p className="text-sm text-slate-400 max-w-sm">A next‑gen food delivery experience built with love.</p>
        </motion.div>
        {["Eatonic","For Restaurants","Learn More"].map((title, i) => (
          <motion.div key={i} variants={item}>
            <h4 className="text-white font-semibold mb-4">{title}</h4>
            <ul className="space-y-2 text-sm">
              {["Partner","Apps","Support","Blog","Privacy"].map(link => (
                <li key={link} className="hover:text-white cursor-pointer transition">{link}</li>
              ))}
            </ul>
          </motion.div>
        ))}
        <motion.div variants={item}>
          <h4 className="text-white font-semibold mb-4">Social</h4>
          <div className="flex gap-4 mb-6">{[Linkedin, Instagram, Youtube, Facebook, X].map((Icon, i) => <Icon key={i} className="hover:text-white transition" />)}</div>
          <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" className="h-10 mb-3" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-10" />
        </motion.div>
      </motion.div>
      <div className="border-t border-slate-700 mt-14 pt-6 text-xs text-slate-400 max-w-7xl mx-auto">© {new Date().getFullYear()} Eatonic</div>
    </footer>
  );
}
