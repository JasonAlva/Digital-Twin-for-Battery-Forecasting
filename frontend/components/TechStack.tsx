import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Settings, TrendingUp, Code, Calculator } from 'lucide-react';

export default function TechStack() {
  const technologies = [
    {
      icon: Brain,
      title: 'Hybrid Models',
      description: 'Physics-based degradation model combined with trained neural networks',
      color: 'text-accent-secondary'
    },
    {
      icon: Zap,
      title: 'Real Battery Data',
      description: '169,766 real Li-ion battery measurements for accurate training',
      color: 'text-accent-primary'
    },
    {
      icon: Settings,
      title: 'Engineering-Grade',
      description: 'Industry-standard algorithms for battery health estimation',
      color: 'text-accent-warning'
    },
    {
      icon: TrendingUp,
      title: 'High Accuracy',
      description: '85.8% R² score - explains variance better than pure physics or ML',
      color: 'text-accent-success'
    }
  ];

  return (
    <section id="tech" className="max-w-7xl mx-auto px-4 py-20 border-t border-white/5 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Technology
          </span>
          <span className="ml-3 text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
            Stack
          </span>
        </h2>
        <p className="text-text-secondary">Powered by advanced physics and machine learning</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologies.map((tech, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="glass-panel p-8 text-center hover:border-accent-primary/30 transition-all duration-300 group"
          >
            <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition duration-300 ${tech.color}`}>
              <tech.icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-heading mb-3 text-white">{tech.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed group-hover:text-white/80 transition duration-300">{tech.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calculator className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-6 h-6 text-accent-secondary" />
            <h3 className="text-2xl font-bold font-heading text-white">Physics Model</h3>
          </div>
          <p className="text-text-secondary mb-6 leading-relaxed">
            The mathematical foundation. We use the <strong>Arrhenius Equation</strong> and <strong>Fick's Laws of Diffusion</strong> to model the fundamental electrochemical processes. This ensures the model remains physically consistent even when encountering extreme scenarios not present in the training data.
          </p>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg blur opacity-20 transition duration-500"></div>
            <code className="relative block bg-black/50 p-6 rounded-lg text-sm text-accent-primary font-mono border border-white/10 leading-relaxed">
              <span className="text-accent-secondary"># Physics Core</span><br />
              k = A * exp(-Ea / (R * T)) <span className="text-text-muted"># Rate Constant</span><br />
              C(t) = C0 * exp(-k * t) <span className="text-text-muted"># Capacity Decay</span>
            </code>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Code className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-accent-primary" />
            <h3 className="text-2xl font-bold font-heading text-white">ML Architecture</h3>
          </div>
          <p className="text-text-secondary mb-6 leading-relaxed">
            The "Error Corrector". Our Deep Neural Network is trained on a massive dataset of <strong>169,766 cycles</strong>. It learns the non-linear "residuals"—the subtle differences between theoretical physics and real-world battery behavior caused by SEI layer growth and lithium plating.
          </p>
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-secondary to-accent-primary rounded-lg blur opacity-20 transition duration-500"></div>
            <code className="relative block bg-black/50 p-6 rounded-lg text-sm text-accent-primary font-mono border border-white/10 leading-relaxed">
              <span className="text-accent-secondary"># Neural Net</span><br />
              Residual = NN(Temp, Current, SOC, cycles)<br />
              <span className="text-accent-success">Hybrid_Pred</span> = Physics_Pred + Residual
            </code>
          </div>
        </motion.div>
      </div>

      {/* The Hybrid Advantage */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 glass-panel p-10 border-accent-success/20 bg-accent-success/5"
      >
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent-success/20 rounded-lg">
                <Brain className="w-6 h-6 text-accent-success" />
              </div>
              <h3 className="text-3xl font-bold font-heading text-white">The Hybrid Advantage</h3>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              Why use both? Pure physics models are often too simple to capture complex real-world variables, while pure ML models can make "impossible" predictions if they see unfamiliar data.
              <br /><br />
              Our <strong>Hybrid Digital Twin</strong> combines the reliability of physics with the precision of AI, delivering 40% higher accuracy than either method alone.
            </p>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-accent-secondary font-bold text-2xl mb-1">Physics</div>
              <div className="text-xs text-text-secondary">Reliability</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center flex items-center justify-center">
              <span className="text-2xl font-bold text-white">+</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-accent-primary font-bold text-2xl mb-1">AI</div>
              <div className="text-xs text-text-secondary">Precision</div>
            </div>
            <div className="p-4 rounded-xl bg-accent-success/20 border border-accent-success/30 text-center">
              <div className="text-accent-success font-bold text-2xl mb-1">Hybrid</div>
              <div className="text-xs text-text-secondary">Superior</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
