import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SimulatorForm from '@/components/SimulatorForm';
import ResultsDashboard from '@/components/ResultsDashboard';
import ModelEvaluation from '@/components/ModelEvaluation';

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const handleSimulation = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await axios.post(`${API_URL}/simulate`, {
        initial_capacity_ah: formData.initial_capacity_ah,
        temperature_celsius: formData.temperature_celsius,
        discharge_current_a: formData.discharge_current_a,
        num_cycles: formData.num_cycles,
        time_per_cycle_minutes: formData.time_per_cycle_minutes,
        usage_profile: formData.usage_profile,
      });

      setResults(response.data);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Simulation failed';
      setError(errorMessage);
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-body selection:bg-accent-primary/30 selection:text-white">
      <Head>
        <title>VoltTwin | Battery Health & Life Prediction</title>
        <meta name="description" content="Predict battery health, state of charge, and end-of-life using hybrid physics + ML models." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-8 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
              VoltTwin
            </h1>
            <p className="text-2xl text-gray-300 mb-4">
              Intelligent Battery Prediction Engine
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Enter your battery parameters below to get instant predictions for State of Health (SoH), 
              remaining lifespan, and actionable insights. Works for any battery in any industry.
            </p>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <div className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-200">
              🔬 Physics + ML Hybrid
            </div>
            <div className="px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-200">
              📊 Real-Time Predictions
            </div>
            <div className="px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-full text-green-200">
              💡 Clear Explanations
            </div>
          </div>

          {/* Model Evaluation Button */}
          <div className="text-center">
            <button
              onClick={() => setShowEvaluation(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <span>📊</span> Test Model Performance
            </button>
            <p className="text-gray-400 text-sm mt-3">Click to see how our hybrid model compares to physics-only models</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-8 py-12 max-w-7xl mx-auto">
          {!results ? (
            <>
              {/* Input Form */}
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8 mb-12">
                <h2 className="text-3xl font-bold mb-8">Battery Parameters</h2>
                <p className="text-gray-400 mb-6">
                  Enter your battery specifications. VoltTwin uses a hybrid physics + ML model to predict battery health.
                </p>
                <SimulatorForm onSubmit={handleSimulation} loading={loading} />

                {error && (
                  <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                    <p className="text-red-200">
                      <span className="font-bold">Error:</span> {error}
                    </p>
                  </div>
                )}
              </div>

              {/* How to Read Predictions */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-8 mb-12">
                <h3 className="text-2xl font-bold mb-6">📚 How to Interpret Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-bold text-blue-300 mb-2">State of Health (SoH)</h4>
                    <p className="text-gray-300 text-sm">
                      Shows the battery's remaining capacity as a percentage of original. 
                      <br/><br/>
                      <span className="text-green-400">🟢 80-100%</span> = Healthy<br/>
                      <span className="text-yellow-400">🟡 60-79%</span> = Aging<br/>
                      <span className="text-red-400">🔴 &lt;60%</span> = Consider replacement
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-300 mb-2">End of Life (EOL)</h4>
                    <p className="text-gray-300 text-sm">
                      Predicts when the battery will reach 70% SoH (typical EOL threshold).
                      <br/><br/>
                      Based on your usage patterns and environmental conditions (temperature, discharge rate).
                      Use this to plan maintenance or replacement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-300 mb-2">Predictions Explained</h4>
                    <p className="text-gray-300 text-sm">
                      <span className="font-bold">Physics Model:</span> Based on degradation equations<br/>
                      <span className="font-bold">ML Correction:</span> Learned from real-world data<br/>
                      <span className="font-bold">Hybrid:</span> Best of both approaches for accuracy
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Results Dashboard */}
              <div id="results">
                <div className="mb-8 flex justify-between items-center">
                  <h2 className="text-3xl font-bold">Your Results</h2>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-semibold"
                  >
                    ← New Simulation
                  </button>
                </div>
                <ResultsDashboard data={results} showComparison={true} onComparisonChange={() => {}} />
              </div>

              {/* Explanation of Results */}
              <div className="mt-12 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6">📖 Understanding Your Predictions</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                    <h4 className="font-bold text-green-300 mb-3">✓ What This Means</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <span className="font-semibold">Current SoH:</span> Your battery is at{' '}
                        <span className="text-white">{results.soh?.toFixed(1)}%</span> capacity
                      </li>
                      <li>
                        <span className="font-semibold">Health Status:</span> Categorized as{' '}
                        <span className="text-white">{results.health_status}</span>
                      </li>
                      <li>
                        <span className="font-semibold">Remaining Life:</span> Approximately{' '}
                        <span className="text-white">
                          {Math.max(0, (100 - results.soh) / 0.5).toFixed(0)} more cycles
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
                    <h4 className="font-bold text-blue-300 mb-3">💡 Recommended Actions</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      {results.health_status === 'Healthy' && (
                        <>
                          <li>✓ Battery is performing well</li>
                          <li>✓ Continue current usage patterns</li>
                          <li>✓ No immediate action required</li>
                        </>
                      )}
                      {results.health_status === 'Aging' && (
                        <>
                          <li>⚠ Battery is aging, plan for replacement soon</li>
                          <li>⚠ Monitor usage to extend lifespan</li>
                          <li>⚠ Consider reducing temperature exposure</li>
                        </>
                      )}
                      {results.health_status === 'Risk' && (
                        <>
                          <li>🔴 Battery nearing end of life</li>
                          <li>🔴 Replace or service within 1-3 months</li>
                          <li>🔴 Reduce discharge current to slow degradation</li>
                        </>
                      )}
                      {results.health_status === 'Critical' && (
                        <>
                          <li>🔴 Battery critical, replace immediately</li>
                          <li>🔴 Risk of unexpected failure</li>
                          <li>🔴 Prepare replacement plan</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 md:col-span-2">
                    <h4 className="font-bold text-purple-300 mb-3">🎯 How We Calculated This</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      VoltTwin uses a <span className="font-semibold">hybrid approach</span>:
                    </p>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <span className="font-semibold">Physics Model:</span> Applies the Xu et al. degradation 
                        equation based on temperature ({results.temperature_celsius}°C) and discharge current 
                        ({results.discharge_current_a}A)
                      </li>
                      <li>
                        <span className="font-semibold">ML Correction:</span> Neural network trained on real 
                        battery data learns non-linear effects and corrects physics model predictions
                      </li>
                      <li>
                        <span className="font-semibold">Final Prediction:</span> Combines physics rigor with 
                        ML accuracy for best-of-both results
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Industry Applications */}
              <div className="mt-12 bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border border-orange-700/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6">🏭 Applies to Any Industry</h3>
                <p className="text-gray-300 mb-6">
                  VoltTwin predictions work for batteries across all sectors:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <p className="font-bold text-orange-300 mb-2">⚡ EV Manufacturing</p>
                    <p className="text-gray-400">Warranty forecasting & fleet health</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <p className="font-bold text-blue-300 mb-2">🔌 Grid Storage</p>
                    <p className="text-gray-400">Energy trading & maintenance planning</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <p className="font-bold text-cyan-300 mb-2">🚚 Fleet Management</p>
                    <p className="text-gray-400">Route assignment & replacement forecasting</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <p className="font-bold text-green-300 mb-2">🏠 Residential</p>
                    <p className="text-gray-400">Home energy systems & cost savings</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <p className="font-bold text-red-300 mb-2">🏭 Manufacturing</p>
                    <p className="text-gray-400">QA defect detection & cost control</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Model Evaluation Modal */}
        {showEvaluation && <ModelEvaluation onClose={() => setShowEvaluation(false)} />}

        {/* Footer Spacing */}
        <div className="h-12" />
      </main>

      <Footer />
    </div>
  );
}
