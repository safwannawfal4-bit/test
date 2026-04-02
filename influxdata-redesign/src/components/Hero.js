import React from 'react';
import ParticleCanvas from './ParticleCanvas';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900" />
      <ParticleCanvas />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-400/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-cyan-400 mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-neon-400 animate-pulse" />
          Introducing InfluxDB 3 — Powered by Apache Arrow
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 animate-fade-up delay-100">
          Time series starts{' '}
          <span className="gradient-text">with InfluxDB</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
          The open-source platform built to collect, store, process, and visualize
          time series data at any scale. Now with InfluxDB 3 — columnar storage,
          native SQL, and a new processing engine.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up delay-300">
          <a href="#get-started"
            className="px-8 py-3.5 rounded-full font-semibold text-navy-900 bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,173,246,0.4)] transition-all duration-300 text-sm">
            Get Started Free
          </a>
          <a href="#demo"
            className="px-8 py-3.5 rounded-full font-semibold text-white border border-white/20 hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300 text-sm">
            View Documentation
          </a>
        </div>

        {/* Floating stats */}
        <div className="flex flex-wrap justify-center gap-6 animate-fade-up delay-400">
          {[
            { value: '1M+', label: 'Downloads', anim: 'animate-float' },
            { value: '500+', label: 'Telegraf Plugins', anim: 'animate-float-delayed' },
            { value: 'Millions', label: 'of Instances', anim: 'animate-float-delayed2' },
          ].map((stat) => (
            <div key={stat.label}
              className={`glass px-5 py-3 rounded-xl flex items-center gap-3 ${stat.anim}`}>
              <span className="text-cyan-400 font-bold font-mono text-lg">{stat.value}</span>
              <span className="text-gray-400 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-900 to-transparent" />
    </section>
  );
}
