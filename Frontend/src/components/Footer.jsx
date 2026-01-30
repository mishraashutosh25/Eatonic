import { Linkedin, Instagram, Youtube, Facebook, X } from "lucide-react";
import { motion } from "framer-motion";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const LINK_GROUPS = [
  { title: "Eatonic", links: ["Partner", "Apps", "Support", "Blog", "Privacy"] },
  { title: "For Restaurants", links: ["Partner", "Apps", "Support", "Blog", "Privacy"] },
  { title: "Learn More", links: ["Partner", "Apps", "Support", "Blog", "Privacy"] },
];

const SOCIALS = [
  { label: "LinkedIn", Icon: Linkedin },
  { label: "Instagram", Icon: Instagram },
  { label: "YouTube", Icon: Youtube },
  { label: "Facebook", Icon: Facebook },
  { label: "X (Twitter)", Icon: X },
];

export function Footer() {
  return (
    <footer className="bg-black text-slate-300 px-6 md:px-12 pt-20 pb-10">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.12 }}
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12"
      >
        <motion.div variants={item} className="col-span-2">
          <h2 className="text-3xl font-bold text-white mb-4">
            Eatonic 🍽️
          </h2>
          <p className="text-sm text-slate-400 max-w-sm">
            A next-gen food delivery experience built with love.
          </p>
        </motion.div>

        {LINK_GROUPS.map((group) => (
          <motion.div key={group.title} variants={item}>
            <h4 className="text-white font-semibold mb-4">
              {group.title}
            </h4>
            <ul className="space-y-2 text-sm">
              {group.links.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div variants={item}>
          <h4 className="text-white font-semibold mb-4">Social</h4>

          <div className="flex gap-4 mb-6">
            {SOCIALS.map(({ label, Icon }) => (
              <a key={label} href="#" aria-label={label}>
                <Icon className="hover:text-white transition" />
              </a>
            ))}
          </div>

          <img
            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
            className="h-10 mb-3"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            className="h-10"
          />
        </motion.div>
      </motion.div>

      <div className="border-t border-slate-700 mt-14 pt-6 text-xs text-slate-400 max-w-7xl mx-auto">
        © {new Date().getFullYear()} Eatonic
      </div>
    </footer>
  );
}
