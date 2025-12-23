import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, AlertCircle, Cpu, Thermometer, Zap, Clock, Activity } from 'lucide-react';

interface SimulatorFormProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function SimulatorForm({ onSubmit, loading }: SimulatorFormProps) {
  const [formData, setFormData] = useState({
    initial_capacity_ah: 2.0,
    temperature_celsius: 25,
    discharge_current_a: 1.5,
    num_cycles: 1000,
    time_per_cycle_minutes: 60,
    usage_profile: 'standard',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
    setError(null);
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Simulation failed. Please check your inputs.');
    }
  };

  const inputs = [
    {
      label: "Initial Capacity (Ah)",
      name: "initial_capacity_ah",
      icon: <Zap className="w-4 h-4 text-accent-primary" />,
      min: 0.1, max: 10, step: 0.1,
      info: "The total energy the battery can hold at 100% State of Health."
    },
    {
      label: "Discharge Current (A)",
      name: "discharge_current_a",
      icon: <Activity className="w-4 h-4 text-accent-warning" />,
      min: 0.1, max: 20, step: 0.1,
      info: "How much current is pulled. Higher current increases chemical stress."
    },
    {
      label: "Number of Cycles",
      name: "num_cycles",
      icon: <Clock className="w-4 h-4 text-accent-success" />,
      min: 100, max: 5000, step: 100,
      info: "Duration of the simulation. Most batteries hit EOL at 500-1500 cycles."
    },
    {
      label: "Time per Cycle (min)",
      name: "time_per_cycle_minutes",
      icon: <Clock className="w-4 h-4 text-accent-secondary" />,
      min: 10, max: 1440, step: 10,
      info: "Average duration of a single charge/discharge event."
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="simulator"
      className="max-w-7xl mx-auto px-4 py-20"
    >
      <div className="text-center mb-16">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold font-heading mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
            Simulation Parameters
          </span>
        </motion.h2>
        <p className="text-text-secondary">Configure the virtual battery environment</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {inputs.map((input, idx) => (
            <motion.div
              key={input.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-6 hover:border-accent-primary/30 transition duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                {input.icon}
                <label className="text-sm font-medium text-text-primary">
                  {input.label}
                </label>
              </div>
              <p className="text-[10px] text-text-secondary mb-4 leading-tight">{input.info}</p>
              <input
                type="number"
                name={input.name}
                value={(formData as any)[input.name]}
                onChange={handleChange}
                min={input.min}
                max={input.max}
                step={input.step}
                className="input-field text-lg font-mono"
              />
            </motion.div>
          ))}

          {/* Temperature Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="glass-panel p-6 col-span-1 md:col-span-2 hover:border-accent-warning/30 transition duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-accent-warning" />
                <label className="text-sm font-medium text-text-primary">Operating Temperature</label>
              </div>
              <span className="text-xl font-bold font-mono text-accent-warning">{formData.temperature_celsius}°C</span>
            </div>
            <input
              type="range"
              name="temperature_celsius"
              value={formData.temperature_celsius}
              onChange={(e) => handleSliderChange('temperature_celsius', parseFloat(e.target.value))}
              min="0"
              max="60"
              step="1"
              className="slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-2">
              <span>0°C (Freezing)</span>
              <span>60°C (Overheat)</span>
            </div>
          </motion.div>

          {/* Usage Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="glass-panel p-6 col-span-1 md:col-span-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-accent-secondary" />
              <label className="text-sm font-medium text-text-primary">Usage Profile</label>
            </div>
            <p className="text-[10px] text-text-secondary mb-4 leading-tight">
              Defines the stress multiplier. <strong>Heavy</strong> accounts for rapid acceleration and fast charging.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {['light', 'standard', 'heavy'].map((profile) => (
                <button
                  key={profile}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, usage_profile: profile }))}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 border ${formData.usage_profile === profile
                    ? 'bg-accent-primary/20 border-accent-primary text-accent-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-dark-bg/50 border-white/5 text-text-secondary hover:bg-white/5'
                    }`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Action & Status */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 h-full flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent-primary/20 rounded-full blur-[50px] animate-pulse" />

            <h3 className="text-xl font-bold mb-2 relative z-10">Ready to Simulate</h3>
            <p className="text-text-secondary mb-8 text-sm relative z-10">
              Calculations are performed using our hybrid physics-ML engine.
            </p>

            {error && (
              <div className="bg-accent-danger/10 border border-accent-danger rounded-lg p-4 flex gap-3 mb-6 w-full text-left relative z-10">
                <AlertCircle className="w-5 h-5 text-accent-danger flex-shrink-0" />
                <p className="text-xs text-accent-danger">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 relative z-10 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Run Simulation
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
