import { useState, useEffect, useRef, useCallback } from 'react';

const GRAVITY = 0.4;
const FRICTION = 0.99;
const BOUNCE_DAMPING = 0.7;
const HIT_RADIUS = 80;
const HIT_POWER = 18;

export default function TennisGame({ emoji1 = '🎾', emoji2 = '🎾' }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const [swinging, setSwinging] = useState(false);
  const [racketAngle, setRacketAngle] = useState(-30);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [hitEffects, setHitEffects] = useState([]);
  const ballsRef = useRef([]);
  const [ballPositions, setBallPositions] = useState([]);

  // Initialize balls
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    ballsRef.current = [
      { x: rect.width * 0.8, y: rect.height * 0.25, vx: 0, vy: 0, size: 50, emoji: emoji1, id: 0 },
      { x: rect.width * 0.15, y: rect.height * 0.7, vx: 0, vy: 0, size: 38, emoji: emoji2, id: 1 },
    ];
    setBallPositions(ballsRef.current.map(b => ({ ...b })));
  }, [emoji1, emoji2]);

  // Physics loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loop = () => {
      const rect = container.getBoundingClientRect();
      let updated = false;

      ballsRef.current.forEach(ball => {
        if (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) {
          updated = true;
          ball.vy += GRAVITY;
          ball.vx *= FRICTION;
          ball.vy *= FRICTION;
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Wall bouncing
          if (ball.x < ball.size / 2) { ball.x = ball.size / 2; ball.vx = Math.abs(ball.vx) * BOUNCE_DAMPING; }
          if (ball.x > rect.width - ball.size / 2) { ball.x = rect.width - ball.size / 2; ball.vx = -Math.abs(ball.vx) * BOUNCE_DAMPING; }
          if (ball.y < ball.size / 2) { ball.y = ball.size / 2; ball.vy = Math.abs(ball.vy) * BOUNCE_DAMPING; }
          if (ball.y > rect.height - ball.size / 2) {
            ball.y = rect.height - ball.size / 2;
            ball.vy = -Math.abs(ball.vy) * BOUNCE_DAMPING;
            if (Math.abs(ball.vy) < 1) ball.vy = 0;
          }
        } else {
          ball.vx = 0;
          ball.vy = 0;
        }
      });

      if (updated) {
        setBallPositions(ballsRef.current.map(b => ({ ...b })));
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    setMousePos({ x, y });

    // Racket angle follows mouse movement direction
    const dx = x - mouseRef.current.prevX;
    const dy = y - mouseRef.current.prevY;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      setRacketAngle(Math.atan2(dy, dx) * (180 / Math.PI) - 45);
    }
  }, []);

  // Hit detection
  const handleClick = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Swing animation
    setSwinging(true);
    setTimeout(() => setSwinging(false), 300);

    // Check each ball
    let hitAny = false;
    ballsRef.current.forEach(ball => {
      const dx = ball.x - clickX;
      const dy = ball.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < HIT_RADIUS) {
        hitAny = true;
        // Direction from click to ball center
        const angle = Math.atan2(dy, dx);
        // Power based on distance (closer = harder)
        const power = HIT_POWER * (1 - dist / HIT_RADIUS) + HIT_POWER * 0.5;
        // Add mouse velocity for extra power
        const mouseVx = mouseRef.current.x - mouseRef.current.prevX;
        const mouseVy = mouseRef.current.y - mouseRef.current.prevY;

        ball.vx = Math.cos(angle) * power + mouseVx * 0.5;
        ball.vy = Math.sin(angle) * power + mouseVy * 0.5 - 5; // slight upward bias

        setScore(s => s + 1);
        setShowScore(true);
        setTimeout(() => setShowScore(false), 1500);

        // Hit effect
        const effect = { id: Date.now(), x: ball.x, y: ball.y };
        setHitEffects(prev => [...prev, effect]);
        setTimeout(() => setHitEffects(prev => prev.filter(e => e.id !== effect.id)), 600);
      }
    });

    // Miss effect - racket swing in air
    if (!hitAny) {
      const effect = { id: Date.now(), x: clickX, y: clickY, miss: true };
      setHitEffects(prev => [...prev, effect]);
      setTimeout(() => setHitEffects(prev => prev.filter(e => e.id !== effect.id)), 400);
    }
  }, []);

  // Touch support
  const handleTouch = useCallback((e) => {
    const touch = e.touches[0];
    if (touch) {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
      setMousePos({ x: mouseRef.current.x, y: mouseRef.current.y });
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    if (touch) {
      handleClick({ clientX: touch.clientX, clientY: touch.clientY });
    }
  }, [handleClick]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[5]"
      style={{ cursor: 'none' }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouchEnd}
    >
      {/* Balls */}
      {ballPositions.map(ball => (
        <div
          key={ball.id}
          style={{
            position: 'absolute',
            left: ball.x - ball.size / 2,
            top: ball.y - ball.size / 2,
            fontSize: ball.size,
            lineHeight: 1,
            transition: 'none',
            filter: (Math.abs(ball.vx) > 3 || Math.abs(ball.vy) > 3) ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' : 'none',
            transform: `rotate(${(ball.vx || 0) * 3}deg)`,
          }}
        >
          {ball.emoji}
        </div>
      ))}

      {/* Hit effects */}
      {hitEffects.map(effect => (
        <div
          key={effect.id}
          style={{
            position: 'absolute',
            left: effect.x,
            top: effect.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {effect.miss ? (
            <div style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '1.5rem',
              animation: 'fadeUp 0.4s ease-out forwards',
            }}>
              💨
            </div>
          ) : (
            <div style={{
              animation: 'hitBurst 0.6s ease-out forwards',
            }}>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '2rem' }}>💥</div>
            </div>
          )}
        </div>
      ))}

      {/* Score */}
      {score > 0 && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 16,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
          padding: '6px 14px',
          color: 'white',
          fontSize: '0.85rem',
          fontWeight: 700,
          transition: 'all 0.3s ease',
          transform: showScore ? 'scale(1.15)' : 'scale(1)',
        }}>
          🏆 Hits: {score}
        </div>
      )}

      {/* Tennis Racket Cursor */}
      <div
        style={{
          position: 'absolute',
          left: mousePos.x,
          top: mousePos.y,
          transform: `translate(-50%, -50%) rotate(${swinging ? racketAngle + 60 : racketAngle}deg)`,
          transition: swinging ? 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)' : 'transform 0.08s ease-out',
          pointerEvents: 'none',
          zIndex: 10,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      >
        <svg width="48" height="48" viewBox="0 0 64 64">
          {/* Handle */}
          <rect x="28" y="38" width="8" height="22" rx="3" fill="#8B4513" />
          <rect x="29" y="38" width="6" height="22" rx="2" fill="#A0522D" />
          {/* Grip tape */}
          <line x1="28" y1="42" x2="36" y2="40" stroke="#D2691E" strokeWidth="1.5" />
          <line x1="28" y1="46" x2="36" y2="44" stroke="#D2691E" strokeWidth="1.5" />
          <line x1="28" y1="50" x2="36" y2="48" stroke="#D2691E" strokeWidth="1.5" />
          <line x1="28" y1="54" x2="36" y2="52" stroke="#D2691E" strokeWidth="1.5" />
          {/* Racket head frame */}
          <ellipse cx="32" cy="18" rx="18" ry="22" fill="none" stroke="#2D4A2D" strokeWidth="3.5" />
          <ellipse cx="32" cy="18" rx="18" ry="22" fill="none" stroke="#3D6B3D" strokeWidth="2" />
          {/* Strings vertical */}
          <line x1="22" y1="4" x2="22" y2="34" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="27" y1="1" x2="27" y2="36" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="32" y1="0" x2="32" y2="37" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="37" y1="1" x2="37" y2="36" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="42" y1="4" x2="42" y2="34" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          {/* Strings horizontal */}
          <line x1="16" y1="8" x2="48" y2="8" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="15" y1="13" x2="49" y2="13" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="14" y1="18" x2="50" y2="18" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="15" y1="23" x2="49" y2="23" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          <line x1="16" y1="28" x2="48" y2="28" stroke="#C4E8A0" strokeWidth="0.8" opacity="0.7" />
          {/* Throat */}
          <line x1="26" y1="35" x2="28" y2="40" stroke="#2D4A2D" strokeWidth="2.5" />
          <line x1="38" y1="35" x2="36" y2="40" stroke="#2D4A2D" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Instruction hint */}
      {score === 0 && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          borderRadius: 20,
          padding: '8px 20px',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.75rem',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          animation: 'fadeInOut 3s ease-in-out infinite',
        }}>
          Click the {emoji1} to hit it!
        </div>
      )}
    </div>
  );
}
