import React from 'react';
import { Github, Mail, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-bg/50 backdrop-blur-lg mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold font-heading">
                <span className="text-white">Volt</span>
                <span className="text-accent-primary">Twin</span>
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
              VoltTwin pioneers hybrid digital twin technology for lithium-ion batteries. Our physics-informed machine learning models provide unprecedented accuracy in capacity degradation prediction.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li><a href="#" className="hover:text-accent-primary transition duration-200">Documentation</a></li>
              <li><a href="#" className="hover:text-accent-primary transition duration-200">API Reference</a></li>
              <li><a href="#" className="hover:text-accent-primary transition duration-200">Research Paper</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex justify-center text-xs text-text-muted">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
