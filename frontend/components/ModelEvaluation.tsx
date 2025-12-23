import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Zap, TrendingUp, AlertCircle, CheckCircle, ArrowUp, Sparkles, Target } from 'lucide-react';

interface ModelEvaluationProps {
  onClose: () => void;
}

interface EvaluationResult {
  physics_metrics: {
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
  };
  ml_metrics: {
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
  };
  hybrid_metrics: {
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
  };
  improvement: {
    rmse_improvement_percent: number;
    r2_improvement_percent: number;
    mae_improvement_percent: number;
  };
}

export default function ModelEvaluation({ onClose }: ModelEvaluationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EvaluationResult | null>(null);

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/evaluate-model`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate model');
      console.error('Evaluation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ label, value, unit = '', color = 'blue', subtext, icon: Icon }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      className={`relative overflow-hidden rounded-2xl p-6 border backdrop-blur-xl transition-all`}
      style={{
        background: `linear-gradient(135deg, ${color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : color === 'purple' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(16, 185, 129, 0.1)'} 0%, ${color === 'blue' ? 'rgba(59, 130, 246, 0.05)' : color === 'purple' ? 'rgba(147, 51, 234, 0.05)' : 'rgba(16, 185, 129, 0.05)'} 100%)`,
        borderColor: color === 'blue' ? 'rgba(59, 130, 246, 0.5)' : color === 'purple' ? 'rgba(147, 51, 234, 0.5)' : 'rgba(16, 185, 129, 0.5)',
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium tracking-wide mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
              <div className={`text-4xl font-bold bg-gradient-to-r ${
                color === 'blue' ? 'from-blue-300 to-blue-500' :
                color === 'purple' ? 'from-purple-300 to-purple-500' :
                'from-emerald-300 to-emerald-500'
              } bg-clip-text text-transparent`}>
                {typeof value === 'number' ? value.toFixed(4) : value}
              </div>
              <span className={`text-sm font-semibold ${
                color === 'blue' ? 'text-blue-400' :
                color === 'purple' ? 'text-purple-400' :
                'text-emerald-400'
              }`}>{unit}</span>
            </div>
          </div>
          {Icon && <Icon className={`w-6 h-6 ${
            color === 'blue' ? 'text-blue-400' :
            color === 'purple' ? 'text-purple-400' :
            'text-emerald-400'
          }`} />}
        </div>
        {subtext && <p className="text-xs text-gray-500 font-medium">{subtext}</p>}
      </div>
      <div className={`absolute inset-0 opacity-10 ${
        color === 'blue' ? 'bg-gradient-to-br from-blue-600 to-transparent' :
        color === 'purple' ? 'bg-gradient-to-br from-purple-600 to-transparent' :
        'bg-gradient-to-br from-emerald-600 to-transparent'
      }`} />
    </motion.div>
  );

  const ImprovementBadge = ({ label, improvement }: any) => {
    const isPositive = improvement > 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-3 px-4 py-3 rounded-full font-semibold transition-all backdrop-blur-xl border ${
          isPositive 
            ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
            : 'bg-gradient-to-r from-red-900/40 to-pink-900/40 border-red-500/50 shadow-lg shadow-red-500/20'
        }`}
      >
        <div className={`p-1.5 rounded-full ${isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
          <ArrowUp className={`w-4 h-4 ${isPositive ? 'text-emerald-300' : 'text-red-300 rotate-180'}`} />
        </div>
        <span className={isPositive ? 'text-emerald-200' : 'text-red-200'}>
          {label}: <span className="font-bold text-lg">{Math.abs(improvement).toFixed(1)}%</span>
        </span>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center border border-gray-700/50 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto" />
          </motion.div>
          <p className="text-white font-bold text-xl mb-2">Evaluating Model Performance</p>
          <p className="text-gray-400">Computing metrics on 169,766 training samples...</p>
          <div className="mt-6 flex gap-1 justify-center">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ height: ['8px', '24px', '8px'] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 bg-gradient-to-t from-amber-400 to-amber-300 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!results) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl p-10 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50">
              <Target className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-3xl font-bold text-white">Model Evaluation</h3>
          </div>
          
          <p className="text-gray-300 mb-8 leading-relaxed">
            Click below to evaluate the hybrid model on the full training dataset. See how physics + ML compares!
          </p>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-orange-500/20 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Evaluating...' : 'Run Evaluation'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold py-3 px-6 rounded-xl transition-all border border-gray-600/50 hover:border-gray-500/50"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const comparisonData = [
    {
      metric: 'RMSE',
      Physics: results.physics_metrics.rmse,
      Hybrid: results.hybrid_metrics.rmse,
    },
    {
      metric: 'MAE',
      Physics: results.physics_metrics.mae,
      Hybrid: results.hybrid_metrics.mae,
    },
    {
      metric: 'MAPE',
      Physics: results.physics_metrics.mape,
      Hybrid: results.hybrid_metrics.mape,
    },
  ];

  const radarData = [
    {
      metric: 'R² Score',
      Physics: Math.min(results.physics_metrics.r2 * 100, 100),
      Hybrid: Math.min(results.hybrid_metrics.r2 * 100, 100),
      fullMark: 100,
    },
    {
      metric: 'Low Error',
      Physics: Math.max(0, (1 - results.physics_metrics.mae) * 100),
      Hybrid: Math.max(0, (1 - results.hybrid_metrics.mae) * 100),
      fullMark: 100,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 overflow-y-auto"
    >
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-3xl p-10 max-w-6xl w-full shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">Model Evaluation</h2>
              </div>
              <p className="text-gray-400 ml-12">Comprehensive hybrid model performance analysis</p>
            </motion.div>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl leading-none p-2 hover:bg-gray-700/50 rounded-lg transition-all"
            >
              ✕
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-red-900/30 to-pink-900/30 border border-red-500/50 rounded-xl p-4 mb-8 flex items-start gap-4 shadow-lg shadow-red-500/10"
            >
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-bold">Error</p>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Improvement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 flex flex-wrap gap-4"
          >
            <ImprovementBadge label="RMSE Better" improvement={results.improvement.rmse_improvement_percent} />
            <ImprovementBadge label="R² Better" improvement={results.improvement.r2_improvement_percent} />
            <ImprovementBadge label="MAE Better" improvement={results.improvement.mae_improvement_percent} />
          </motion.div>

          {/* Metrics Grid */}
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
            >
              <Sparkles className="w-6 h-6 text-amber-400" />
              Performance Metrics
            </motion.h3>

            {/* Physics Model */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-10"
            >
              <h4 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2 ml-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                Physics-Only Model
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="RMSE" value={results.physics_metrics.rmse} color="blue" subtext="Lower is better" />
                <MetricCard label="MAE" value={results.physics_metrics.mae} color="blue" subtext="Mean Error" />
                <MetricCard label="R² Score" value={results.physics_metrics.r2} color="blue" subtext="Higher is better" />
                <MetricCard label="MAPE" value={results.physics_metrics.mape} unit="%" color="blue" subtext="% Error" />
              </div>
            </motion.div>

            {/* ML Model */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <h4 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2 ml-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
                ML Correction Model
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="RMSE" value={results.ml_metrics.rmse} color="purple" subtext="Lower is better" />
                <MetricCard label="MAE" value={results.ml_metrics.mae} color="purple" subtext="Mean Error" />
                <MetricCard label="R² Score" value={results.ml_metrics.r2} color="purple" subtext="Higher is better" />
                <MetricCard label="MAPE" value={results.ml_metrics.mape} unit="%" color="purple" subtext="% Error" />
              </div>
            </motion.div>

            {/* Hybrid Model */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-10"
            >
              <h4 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2 ml-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Hybrid Model (Physics + ML) ⭐
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="RMSE" value={results.hybrid_metrics.rmse} color="green" subtext="Lower is better" icon={TrendingUp} />
                <MetricCard label="MAE" value={results.hybrid_metrics.mae} color="green" subtext="Mean Error" />
                <MetricCard label="R² Score" value={results.hybrid_metrics.r2} color="green" subtext="Higher is better" />
                <MetricCard label="MAPE" value={results.hybrid_metrics.mape} unit="%" color="green" subtext="% Error" />
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            {/* Comparison Chart */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl shadow-xl">
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400" />
                Error Metrics Comparison
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="metric" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => value.toFixed(4)}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Physics" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Hybrid" fill="url(#greenGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* R² Comparison Radar */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl shadow-xl">
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                Model Quality Radar
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <defs>
                    <linearGradient id="radarBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="radarGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" />
                  <PolarRadiusAxis stroke="#4B5563" />
                  <Radar name="Physics" dataKey="Physics" stroke="#3B82F6" fill="url(#radarBlue)" fillOpacity={0.6} />
                  <Radar name="Hybrid" dataKey="Hybrid" stroke="#10B981" fill="url(#radarGreen)" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-cyan-900/20 border border-emerald-500/50 rounded-2xl p-8 mb-8 shadow-lg shadow-emerald-500/10 backdrop-blur-xl"
          >
            <h4 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              Key Findings
            </h4>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Hybrid model achieves <span className="text-emerald-300 font-bold">{results.improvement.r2_improvement_percent.toFixed(1)}% higher R² score</span> than physics-only</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Error reduction: <span className="text-emerald-300 font-bold">{results.improvement.rmse_improvement_percent.toFixed(1)}% lower RMSE</span> for more accurate predictions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>ML correction layer effectively <span className="text-emerald-300 font-bold">compensates for physics model limitations</span></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Superior generalization on battery capacity prediction with R² {`>`} 0.93</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEvaluate}
              className="flex-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Re-evaluate
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white font-bold py-3 px-6 rounded-xl transition-all border border-gray-600/50 hover:border-gray-500/50"
            >
              Close Report
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
