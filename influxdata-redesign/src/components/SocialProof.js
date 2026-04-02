import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const logos = [
  'Cisco', 'IBM', 'Siemens', 'Tesla', 'PayPal', 'NASA', 'eBay', 'Capital One'
];

const stats = [
  { value: '10B+', label: 'Data points ingested daily' },
  { value: '5,000+', label: 'Enterprise customers' },
  { value: '170+', label: 'Countries worldwide' },
];

export default function SocialProof() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="relative py-28 grid-bg" ref={ref}>
      <div className={`max-w-7xl mx-auto px-6 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-3">Trusted Worldwide</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Powering the world's data</h2>
        </div>

        {/* Logo cloud */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {logos.map((name) => (
            <div key={name}
              className="glass px-6 py-3 rounded-xl text-gray-500 font-semibold text-sm tracking-wider hover:text-gray-300 hover:border-white/10 transition-all duration-300">
              {name}
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="max-w-3xl mx-auto glass rounded-2xl p-8 mb-16 glow-border-cyan text-center">
          <svg className="w-8 h-8 text-cyan-400/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            "InfluxDB handles our telemetry from 50,000 industrial sensors with sub-second query times.
            Moving to InfluxDB 3 with SQL support cut our development time in half."
          </p>
          <div>
            <p className="text-white font-semibold">Sarah Chen</p>
            <p className="text-gray-500 text-sm">VP of Engineering, Fortune 500 Manufacturing</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold gradient-text font-mono mb-2">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
