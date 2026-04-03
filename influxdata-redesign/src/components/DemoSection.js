import React, { useEffect, useRef } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

function MiniChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const w = canvas.width = 500;
    const h = canvas.height = 300;

    function draw(t) {
      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(34,173,246,0.06)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }

      // Temperature line
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y = h * 0.4 +
          Math.sin(x * 0.015 + t * 0.02) * 40 +
          Math.sin(x * 0.04 + t * 0.01) * 15 +
          Math.cos(x * 0.008 + t * 0.015) * 25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#22ADF6';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Glow
      ctx.strokeStyle = 'rgba(34,173,246,0.2)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Humidity line
      ctx.beginPath();
      for (let x = 0; x < w; x += 2) {
        const y = h * 0.55 +
          Math.sin(x * 0.012 + t * 0.018 + 2) * 30 +
          Math.cos(x * 0.035 + t * 0.012) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(52,211,153,0.2)';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Data points
      const dotTime = (t * 2) % w;
      [{color: '#22ADF6', yOff: 0.4, freq: 0.015, sp: 0.02},
       {color: '#34D399', yOff: 0.55, freq: 0.012, sp: 0.018}
      ].forEach(({color, yOff, freq, sp}) => {
        const dy = h * yOff +
          Math.sin(dotTime * freq + t * sp) * 40 +
          Math.sin(dotTime * 0.04 + t * 0.01) * 15;
        ctx.beginPath();
        ctx.arc(dotTime, dy, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dotTime, dy, 10, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(')', ',0.15)').replace('rgb', 'rgba');
        ctx.fill();
      });

      // Labels
      ctx.fillStyle = 'rgba(148,163,184,0.5)';
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('temperature', 10, 20);
      ctx.fillStyle = 'rgba(52,211,153,0.5)';
      ctx.fillText('humidity', 100, 20);

      animId = requestAnimationFrame(() => draw(t + 1));
    }

    draw(0);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full rounded-xl" style={{ maxHeight: 300 }} />;
}

export default function DemoSection() {
  const [ref, visible] = useScrollReveal();

  const sqlCode = [
    { type: 'comment', text: '-- Write data' },
    { type: 'code', parts: [
      { cls: 'syn-keyword', t: 'INSERT INTO' }, { t: ' sensors (time, location, temperature, humidity)' },
    ]},
    { type: 'code', parts: [
      { cls: 'syn-keyword', t: 'VALUES' },
      { t: ' (' }, { cls: 'syn-function', t: 'NOW' }, { t: '(), ' },
      { cls: 'syn-string', t: "'warehouse-7'" }, { t: ', ' },
      { cls: 'syn-number', t: '22.5' }, { t: ', ' },
      { cls: 'syn-number', t: '45.2' }, { t: ');' },
    ]},
    { type: 'empty' },
    { type: 'comment', text: '-- Query with SQL' },
    { type: 'code', parts: [
      { cls: 'syn-keyword', t: 'SELECT' }, { t: ' ' }, { cls: 'syn-function', t: 'mean' },
      { t: '(temperature), ' }, { cls: 'syn-function', t: 'max' }, { t: '(humidity)' },
    ]},
    { type: 'code', parts: [
      { cls: 'syn-keyword', t: 'FROM' }, { t: ' sensors' },
    ]},
    { type: 'code', parts: [
      { cls: 'syn-keyword', t: 'WHERE' }, { t: ' time > ' }, { cls: 'syn-function', t: 'now' },
      { t: '() - ' }, { cls: 'syn-keyword', t: 'INTERVAL' }, { t: ' ' },
      { cls: 'syn-string', t: "'1 hour'" },
    ]},
    { type: 'code', parts: [
      { cls: 'syn-keyword', t: 'GROUP BY' }, { t: ' location;' },
    ]},
  ];

  return (
    <section id="demo" className="relative py-28" ref={ref}>
      <div className={`max-w-7xl mx-auto px-6 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-3">Interactive Demo</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Write. Query. Visualize. <span className="gradient-text">In seconds.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Code editor */}
          <div className="code-block overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-navy-900/50">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-amber-400/70" />
              <span className="w-3 h-3 rounded-full bg-neon-400/70" />
              <span className="ml-3 text-xs text-gray-600 font-mono">query.sql</span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed">
              {sqlCode.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-right pr-4 text-gray-700 select-none text-xs leading-relaxed">{i + 1}</span>
                  {line.type === 'comment' && <span className="syn-comment">{line.text}</span>}
                  {line.type === 'empty' && <span>&nbsp;</span>}
                  {line.type === 'code' && line.parts.map((p, j) => (
                    <span key={j} className={p.cls || 'text-gray-300'}>{p.t}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Visualization */}
          <div className="glass rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-500">LIVE VISUALIZATION</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-400 animate-pulse" />
                  <span className="text-xs text-neon-400">streaming</span>
                </span>
              </div>
              <span className="text-xs font-mono text-gray-600">warehouse-7</span>
            </div>
            <div className="flex-1 min-h-[260px]">
              <MiniChart />
            </div>
            <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-xs text-gray-500">Avg Temperature</p>
                <p className="text-lg font-bold text-cyan-400 font-mono">22.5&deg;C</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Max Humidity</p>
                <p className="text-lg font-bold text-neon-400 font-mono">45.2%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Data Points</p>
                <p className="text-lg font-bold text-amber-400 font-mono">1,247</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
