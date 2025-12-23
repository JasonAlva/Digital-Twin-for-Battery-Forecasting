import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Hero() {
  // Animated demo data
  const demoData = Array.from({ length: 100 }, (_, i) => ({
    cycle: i + 1,
    capacity: 2.0 * Math.exp(-0.0008 * i),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-primary/20 rounded-full blur-[100px] animate-blob mix-blend-screen" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent-success/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        {/* Left: Text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block px-3 py-1 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-accent-primary text-sm font-medium mb-4">
            Next-Gen Battery Intelligence
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-bold font-heading mb-6 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Volt</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary animate-glow">Twin</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-2xl text-accent-primary mb-2 font-heading">
            Hybrid Digital Twin Simulation
          </motion.p>
          <motion.p variants={itemVariants} className="text-lg text-text-secondary mb-8 leading-relaxed max-w-lg">
            Simulate lithium-ion battery capacity degradation using physics-based models combined with machine learning. Predict battery health, estimate end-of-life, and optimize charging strategies.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4">
            <a href="#simulator" className="btn-primary shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              Start Simulation
            </a>
            <a href="#tech" className="px-6 py-3 border border-white/10 text-white rounded-lg font-medium hover:bg-white/5 hover:border-accent-primary/50 transition duration-300">
              How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Chart Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl opacity-20 transform -rotate-1 rounded-2xl"></div>
          <div className="card glass-panel shadow-2xl relative border-t border-l border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Live Degradation Model</h3>
                <p className="text-xs text-text-secondary">Real-time capacity estimation</p>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={demoData}>
                <defs>
                  <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                  <filter id="neon-glow" height="200%" width="200%" x="-50%" y="-50%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                    <feFlood floodColor="#00F0FF" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="cycle" stroke="#64748B" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(5, 5, 11, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                  formatter={(value: any) => [`${Number(value).toFixed(3)} Ah`, 'Capacity']}
                />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke="#00F0FF"
                  dot={false}
                  strokeWidth={3}
                  filter="url(#neon-glow)"
                  fillOpacity={1}
                  fill="url(#colorCapacity)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
              <div className="text-center">
                <p className="text-xs text-text-secondary">SOH</p>
                <p className="text-xl font-bold text-white">98.5%</p>
              </div>
              <div className="text-center border-l border-white/5 border-r">
                <p className="text-xs text-text-secondary">RUL</p>
                <p className="text-xl font-bold text-accent-success">850 Cyc</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-text-secondary">Temp</p>
                <p className="text-xl font-bold text-accent-warning">28°C</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
