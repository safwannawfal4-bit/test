import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import EditableText from './EditableText';
import { usePageContent } from '../context/PageContentContext';

function BouncyEmoji({ emoji, size = '4rem', baseOpacity = 0.3, top, bottom, left, right, delay = '0s' }) {
  const [clicks, setClicks] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0, rotate: 0, scale: 1 });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    setClicks(c => c + 1);
    setIsAnimating(true);

    // Random bounce direction
    const randX = (Math.random() - 0.5) * 60;
    const randY = -30 - Math.random() * 40;
    const randRotate = (Math.random() - 0.5) * 40;

    setPos({ x: randX, y: randY, rotate: randRotate, scale: 1.6 });

    setTimeout(() => {
      setPos({ x: randX * 0.3, y: 10, rotate: -randRotate * 0.5, scale: 0.8 });
    }, 200);

    setTimeout(() => {
      setPos({ x: 0, y: -8, rotate: randRotate * 0.2, scale: 1.2 });
    }, 400);

    setTimeout(() => {
      setPos({ x: 0, y: 0, rotate: 0, scale: 1 });
      setIsAnimating(false);
    }, 600);
  }, []);

  const posStyle = {
    position: 'absolute',
    top, bottom, left, right,
    fontSize: size,
    opacity: isAnimating ? 0.9 : baseOpacity,
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 5,
    transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`,
    transition: isAnimating ? 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'all 0.3s ease-out, opacity 0.5s ease',
    filter: isAnimating ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'none',
    animation: isAnimating ? 'none' : `floatEmoji 3s ease-in-out infinite`,
    animationDelay: delay,
  };

  return (
    <div style={posStyle} onClick={handleClick} role="button" tabIndex={0}>
      {emoji}
      {clicks > 0 && isAnimating && (
        <span style={{
          position: 'absolute', top: '-10px', right: '-10px',
          fontSize: '0.8rem', opacity: 0.8,
          animation: 'fadeUp 0.5s ease-out forwards',
        }}>
          +{clicks}
        </span>
      )}
    </div>
  );
}

export default function HeroSection() {
  const { heroBg, content } = usePageContent();

  const hasImage = heroBg?.type === 'image' && heroBg?.imageUrl;
  const emoji1 = content.hero_float_emoji_1 || '🎾';
  const emoji2 = content.hero_float_emoji_2 || '🎾';
  const showEmojis = content.hero_show_emojis !== 'no';

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            <img src={heroBg.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-alma-green via-alma-green-light to-alma-green" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 bg-alma-lime/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-alma-lime/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
            {showEmojis && (
              <>
                <BouncyEmoji emoji={emoji1} size="4rem" baseOpacity={0.35} top="15%" right="15%" />
                <BouncyEmoji emoji={emoji2} size="2.8rem" baseOpacity={0.25} bottom="18%" left="10%" delay="1.5s" />
              </>
            )}
          </div>
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-alma-lime text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-alma-lime rounded-full animate-pulse" />
            <EditableText contentKey="hero_badge" className="text-alma-lime" />
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
            <EditableText contentKey="hero_title_1" className="text-white" />
            <span className="block">
              <EditableText contentKey="hero_title_2" className="text-alma-lime" />
            </span>
          </h1>

          <p className="mt-6 text-xl text-white/80 max-w-xl leading-relaxed">
            <EditableText contentKey="hero_subtitle" className="text-white/80" />
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/programs" className="btn-secondary text-lg px-8 py-4">
              <EditableText contentKey="hero_cta_1" className="text-alma-green" />
            </Link>
            <Link to="/shop" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-alma-green transition-all duration-300">
              <EditableText contentKey="hero_cta_2" className="text-inherit" />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-alma-lime"><EditableText contentKey={`hero_stat_${i}`} className="text-alma-lime" /></div>
                <div className="text-sm text-white/60 mt-1"><EditableText contentKey={`hero_stat_${i}_label`} className="text-white/60" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
