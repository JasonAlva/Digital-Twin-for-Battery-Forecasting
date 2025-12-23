import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, TrendingDown, Clock, Activity, Brain } from 'lucide-react';

interface ResultsProps {
  data: any;
  showComparison: boolean;
  onComparisonChange: (show: boolean) => void;
}

export default function ResultsDashboard({ data, showComparison, onComparisonChange }: ResultsProps) {
  if (!data) {
    return null;
  }

  const chartData = data.cycles.map((cycle: number, i: number) => ({
    cycle,
    physics: data.capacity_physics[i],
    ml: data.capacity_ml[i],
    hybrid: data.capacity_hybrid[i],
  }));

  const metrics = data.metrics;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-20 relative z-10"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent-secondary/5 blur-[120px] rounded-full -z-10" />

      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl font-bold font-heading mb-2 text-white">
          Simulation Results
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary/5 border border-accent-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          <span className="text-[10px] text-accent-primary uppercase tracking-[0.2em] font-medium">Digital Twin Sync active [v{data.v % 10000}]</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="glass-panel p-6 text-center border-t-2 border-t-accent-success"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent-success/10 rounded-full">
              <Zap className="w-6 h-6 text-accent-success" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {metrics.remaining_capacity_percent.toFixed(1)}%
          </div>
          <div className="text-sm text-text-secondary">Remaining Capacity</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 text-center border-t-2 border-t-accent-primary"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent-primary/10 rounded-full">
              <Clock className="w-6 h-6 text-accent-primary" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {data.eol_cycle || '—'}
          </div>
          <div className="text-sm text-text-secondary">End of Life (cycles)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 text-center border-t-2 border-t-accent-warning"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-accent-warning/10 rounded-full">
              <TrendingDown className="w-6 h-6 text-accent-warning" />
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {metrics.capacity_fade_per_100_cycles.toFixed(2)}%
          </div>
          <div className="text-sm text-text-secondary">Fade per 100 cycles</div>
        </motion.div>
      </div>

      {/* Simulation Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6 mb-12 border-l-4 border-l-accent-primary"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-accent-primary/10 rounded-lg mt-1">
            <Brain className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Model Intelligence Report</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our <strong>Hybrid Digital Twin</strong> has analyzed your parameters. The charts below represent how your battery's capacity will likely fade over {chartData.length} measured points.
              {data.eol_cycle ? (
                <span> We predict the battery will reach its End-of-Life (80% SOH) at cycle <strong>{data.eol_cycle}</strong>.</span>
              ) : (
                " The battery remains healthy throughout the simulated period."
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="space-y-12">
        {/* Main Capacity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-accent-primary" />
            <h3 className="text-xl font-bold font-heading text-white">Capacity Degradation</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorHybrid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                </linearGradient>
                <filter id="neon-glow-chart" height="200%" width="200%" x="-50%" y="-50%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                  <feFlood floodColor="#00F0FF" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="shadow" />
                  <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="cycle" stroke="#64748B" tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(5, 5, 11, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                formatter={(value: any, name: string) => [Number(value).toFixed(3) + ' Ah', name]}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line
                type="monotone"
                dataKey="hybrid"
                stroke="#00F0FF"
                dot={false}
                strokeWidth={3}
                filter="url(#neon-glow-chart)"
                name="Hybrid (Physics + ML)"
                fill="url(#colorHybrid)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Model Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-heading text-white">Model Comparison</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-10 h-6 flex items-center bg-gray-700 rounded-full p-1 transition duration-300 ${showComparison ? 'bg-accent-primary' : ''}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${showComparison ? 'translate-x-4' : ''}`}></div>
              </div>
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => onComparisonChange(e.target.checked)}
                className="hidden"
              />
              <span className="text-sm text-text-secondary group-hover:text-white transition">Show underlying models</span>
            </label>
          </div>

          {showComparison ? (
            <div className="space-y-8">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="cycle" stroke="#64748B" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(5, 5, 11, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: any, name: string) => [Number(value).toFixed(3) + ' Ah', name]}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line
                    type="monotone"
                    dataKey="physics"
                    stroke="#FFD600"
                    dot={false}
                    strokeWidth={2}
                    name="Physics Only"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="ml"
                    stroke="#00FF94"
                    dot={false}
                    strokeWidth={2}
                    name="ML Correction"
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="hybrid"
                    stroke="#00F0FF"
                    dot={false}
                    strokeWidth={3}
                    name="Hybrid (Combined)"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-accent-warning/5 border border-accent-warning/20">
                  <h4 className="text-accent-warning font-bold text-sm mb-1 uppercase tracking-wider">Physics Line</h4>
                  <p className="text-xs text-text-secondary">Pure theoretical degradation. Reliable but misses real-world chemical nuances like SEI layer fluctuations.</p>
                </div>
                <div className="p-4 rounded-lg bg-accent-success/5 border border-accent-success/20">
                  <h4 className="text-accent-success font-bold text-sm mb-1 uppercase tracking-wider">ML Correction</h4>
                  <p className="text-xs text-text-secondary">The "AI's Opinion". It predicts how much the real battery will deviate from the physics theory.</p>
                </div>
                <div className="p-4 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
                  <h4 className="text-accent-primary font-bold text-sm mb-1 uppercase tracking-wider">Hybrid (Our Model)</h4>
                  <p className="text-xs text-text-secondary">The Gold Standard. Combines both for the most accurate prediction possible (85.8% R²).</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
              <div className="p-4 bg-white/5 rounded-full mb-4">
                <Activity className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-text-secondary mb-2">Toggle "Show underlying models" to see the breakdown</p>
              <p className="text-xs text-text-muted px-10 text-center">See how our AI corrects the physics model in real-time</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Detailed Metrics Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel p-8 mt-12"
      >
        <h3 className="text-xl font-bold font-heading mb-6 text-white">Detailed Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border-l-2 border-accent-secondary pl-4 py-1">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Initial Capacity</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.initial_capacity_ah.toFixed(3)} Ah</p>
          </div>
          <div className="border-l-2 border-accent-secondary pl-4 py-1">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Final Capacity</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.remaining_capacity_ah.toFixed(3)} Ah</p>
          </div>
          <div className="border-l-2 border-accent-secondary pl-4 py-1">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Total Degradation</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.total_degradation_ah.toFixed(3)} Ah</p>
          </div>
          <div className="border-l-2 border-accent-secondary pl-4 py-1">
            <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">Capacity Loss</p>
            <p className="text-xl font-bold text-white font-mono">{(100 - metrics.remaining_capacity_percent).toFixed(2)}%</p>
          </div>
        </div>
      </motion.div>

      {/* Degradation Velocity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel p-6 mt-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="w-5 h-5 text-accent-warning" />
          <h3 className="text-xl font-bold font-heading text-white">Degradation Velocity</h3>
        </div>
        <p className="text-sm text-text-secondary mb-8">
          This chart shows the <strong>instantaneous rate of capacity loss</strong>. Spikes often correlate with high-temperature cycles or heavy usage peaks identified by the ML model.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.map((d: any, i: number, arr: any[]) => ({
            ...d,
            velocity: i === 0 ? 0 : Math.abs(arr[i - 1].hybrid - d.hybrid) / (d.cycle - arr[i - 1].cycle)
          })).slice(1)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="cycle" stroke="#64748B" tickLine={false} axisLine={false} />
            <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 5, 11, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [Number(value).toExponential(2) + ' Ah/cyc', 'Fade Rate']}
            />
            <Line
              type="monotone"
              dataKey="velocity"
              stroke="#FFD600"
              dot={false}
              strokeWidth={2}
              fillOpacity={1}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.section>
  );
}
