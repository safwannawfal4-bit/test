import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const nodes = [
  { icon: '{ }', label: 'Data Sources', sub: 'IoT, APIs, Logs', color: 'from-amber-400/20 to-amber-400/5' },
  { icon: 'T', label: 'Telegraf', sub: '500+ Plugins', color: 'from-neon-400/20 to-neon-400/5' },
  { icon: 'DB', label: 'InfluxDB 3', sub: 'Arrow + Columnar', color: 'from-cyan-400/20 to-cyan-400/5' },
  { icon: 'fn', label: 'Processing Engine', sub: 'Transform & Alert', color: 'from-purple-400/20 to-purple-400/5' },
  { icon: 'UI', label: 'Dashboards', sub: 'Visualize & Alert', color: 'from-cyan-400/20 to-cyan-400/5' },
];

export default function Architecture() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="relative py-28 grid-bg" ref={ref}>
      <div className={`max-w-7xl mx-auto px-6 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-3">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">How it works</h2>
        </div>

        {/* Pipeline */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
          {nodes.map((node, i) => (
            <React.Fragment key={node.label}>
              <div className="glass rounded-2xl p-6 text-center w-48 flex-shrink-0 glass-hover transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${node.color} border border-white/10 flex items-center justify-center mx-auto mb-3`}>
                  <span className="font-mono text-sm font-bold text-white">{node.icon}</span>
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{node.label}</h4>
                <p className="text-gray-500 text-xs">{node.sub}</p>
              </div>
              {i < nodes.length - 1 && (
                <div className="hidden lg:block w-12 h-[2px] relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 animate-flow" />
                </div>
              )}
              {i < nodes.length - 1 && (
                <div className="lg:hidden w-[2px] h-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
