import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;

    const particles = [];
    const PARTICLE_COUNT = 80;
    const lines = [];
    const LINE_COUNT = 5;

    function resize() {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(1, 1);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function initLines() {
      lines.length = 0;
      for (let i = 0; i < LINE_COUNT; i++) {
        const points = [];
        const baseY = h * 0.3 + Math.random() * h * 0.4;
        for (let x = 0; x <= w; x += 4) {
          points.push({ x, y: baseY });
        }
        lines.push({
          points,
          baseY,
          amplitude: 20 + Math.random() * 40,
          frequency: 0.002 + Math.random() * 0.003,
          speed: 0.01 + Math.random() * 0.02,
          phase: Math.random() * Math.PI * 2,
          color: i % 3 === 0 ? '34,173,246' : i % 3 === 1 ? '52,211,153' : '245,158,11',
          opacity: 0.15 + Math.random() * 0.15,
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);

      // Draw flowing time-series lines
      lines.forEach((line) => {
        ctx.beginPath();
        line.points.forEach((p, idx) => {
          const y = line.baseY +
            Math.sin(p.x * line.frequency + t * line.speed + line.phase) * line.amplitude +
            Math.sin(p.x * line.frequency * 2.5 + t * line.speed * 1.5) * line.amplitude * 0.3;
          if (idx === 0) ctx.moveTo(p.x, y);
          else ctx.lineTo(p.x, y);
        });
        ctx.strokeStyle = `rgba(${line.color},${line.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Glow
        ctx.strokeStyle = `rgba(${line.color},${line.opacity * 0.3})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      });

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,173,246,${p.opacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,173,246,${p.opacity * 0.1})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,173,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(() => draw(t + 1));
    }

    resize();
    initParticles();
    initLines();
    draw(0);

    window.addEventListener('resize', () => { resize(); initParticles(); initLines(); });
    return () => { cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}
