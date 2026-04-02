import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const options = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'Download Core',
    desc: 'Free, open-source. Run InfluxDB 3 on your own infrastructure.',
    cta: 'Download Free',
    color: 'border-neon-400/30 hover:border-neon-400/60',
    btnColor: 'bg-neon-400 text-navy-900',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
    title: 'Try Cloud Free',
    desc: 'No credit card required. Start querying in under 60 seconds.',
    cta: 'Start Free Trial',
    color: 'border-cyan-400/30 hover:border-cyan-400/60',
    btnColor: 'bg-cyan-400 text-navy-900',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: 'Contact Sales',
    desc: 'Enterprise needs? Talk to our team about dedicated solutions.',
    cta: 'Get in Touch',
    color: 'border-amber-400/30 hover:border-amber-400/60',
    btnColor: 'bg-amber-400 text-navy-900',
  },
];

export default function GetStarted() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="get-started" className="relative py-28 overflow-hidden" ref={ref}>
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[150px]" />

      <div className={`relative z-10 max-w-5xl mx-auto px-6 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Start building with InfluxDB 3 <span className="gradient-text">today</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From open-source to fully managed — choose the deployment that fits your needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {options.map((o) => (
            <div key={o.title}
              className={`glass rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1 border ${o.color}`}>
              <div className="text-white mb-5 flex justify-center">{o.icon}</div>
              <h4 className="text-white font-bold text-lg mb-2">{o.title}</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">{o.desc}</p>
              <button className={`px-6 py-2.5 rounded-full font-semibold text-sm ${o.btnColor} transition-all duration-300 hover:shadow-lg`}>
                {o.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
