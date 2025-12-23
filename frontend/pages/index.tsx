import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SimulatorForm from '@/components/SimulatorForm';
import ResultsDashboard from '@/components/ResultsDashboard';
import TechStack from '@/components/TechStack';
import Footer from '@/components/Footer';

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

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

  return (
    <div className="min-h-screen relative overflow-hidden font-body text-text-primary selection:bg-accent-primary/30 selection:text-white">
      <Head>
        <title>VoltTwin | Next-Gen Battery Digital Twin & Simulation</title>
        <meta name="description" content="Advanced AI-powered battery degradation simulation using hybrid physics-ML models. Predict lifespan and optimize performance." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <SimulatorForm onSubmit={handleSimulation} loading={loading} />

        {results && (
          <div id="results">
            <ResultsDashboard
              data={results}
              showComparison={showComparison}
              onComparisonChange={setShowComparison}
            />
          </div>
        )}

        <TechStack />
      </main>

      <Footer />
    </div>
  );
}
