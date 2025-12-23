import React from 'react';
import Link from 'next/link';
import { Github, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="p-2 bg-accent-primary/10 rounded-lg group-hover:bg-accent-primary/20 transition duration-300"
          >
            <Zap className="w-6 h-6 text-accent-primary" />
          </motion.div>
          <span className="text-xl font-bold font-heading">
            <span className="text-white">Volt</span>
            <span className="text-accent-primary">Twin</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          <Link href="#simulator" className="text-text-secondary hover:text-white transition text-sm font-medium">
            Simulator
          </Link>
          <Link href="#tech" className="text-text-secondary hover:text-white transition text-sm font-medium">
            Technology
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
