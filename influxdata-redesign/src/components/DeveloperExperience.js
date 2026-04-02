import React, { useState, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: 'Native SQL',
    desc: 'Query with the language you know. Full SQL support with time-series extensions.',
    code: "SELECT mean(cpu) FROM metrics\nWHERE time > now() - INTERVAL '1h'\nGROUP BY host;",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
      </svg>
    ),
    title: 'Client Libraries',
    desc: 'Python, Go, JavaScript, Rust, C#, Java, and more. Idiomatic APIs for every stack.',
    code: "from influxdb_client_3 import InfluxDBClient3\nclient = InfluxDBClient3(host, token=TOKEN)\ndata = client.query('SELECT * FROM cpu')\nprint(data.to_pandas())",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Processing Engine',
    desc: 'Transform data at the edge with Python plugins. Triggers, scheduled tasks, and more.',
    code: "# processing_engine plugin\ndef process(table, args):\n    for row in table:\n        if row['temp'] > 100:\n            alert('overheating', row)\n    return table",
  },
];

function TerminalAnimation() {
  const lines = [
    { text: '$ influxdb3 serve --node-id node0', delay: 0 },
    { text: '', delay: 400 },
    { text: '  InfluxDB 3 OSS', delay: 600, color: 'text-cyan-400' },
    { text: '  Version:  3.0.0', delay: 800, color: 'text-gray-500' },
    { text: '  Engine:   Apache Arrow / DataFusion', delay: 1000, color: 'text-gray-500' },
    { text: '  Storage:  Parquet + Object Store', delay: 1200, color: 'text-gray-500' },
    { text: '', delay: 1400 },
    { text: '  HTTP API listening on 0.0.0.0:8181', delay: 1600, color: 'text-neon-400' },
    { text: '  gRPC API listening on 0.0.0.0:8815', delay: 1800, color: 'text-neon-400' },
    { text: '  Ready to accept connections.', delay: 2000, color: 'text-neon-400' },
  ];

  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay + 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []); // lines is static

  return (
    <div className="terminal mt-10">
      <div className="terminal-bar">
        <span className="terminal-dot bg-red-500/70" />
        <span className="terminal-dot bg-amber-400/70" />
        <span className="terminal-dot bg-neon-400/70" />
        <span className="ml-3 text-xs text-gray-600 font-mono">terminal</span>
      </div>
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[280px]">
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={line.color || 'text-gray-300'}>
            {line.text || '\u00A0'}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="cursor-blink text-gray-600" />
        )}
      </div>
    </div>
  );
}

export default function DeveloperExperience() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="developers" className="relative py-28" ref={ref}>
      <div className={`max-w-7xl mx-auto px-6 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-3">Developer Experience</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Built for developers, <span className="gradient-text">by developers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 glass-hover transition-all duration-300 group">
              <div className="text-cyan-400 mb-4">{f.icon}</div>
              <h4 className="text-white font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{f.desc}</p>
              <div className="code-block p-4 text-xs">
                <pre className="text-gray-400 whitespace-pre-wrap font-mono">{f.code}</pre>
              </div>
            </div>
          ))}
        </div>

        <TerminalAnimation />
      </div>
    </section>
  );
}
