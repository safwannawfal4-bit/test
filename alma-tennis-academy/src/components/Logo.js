import { Link } from 'react-router-dom';

export default function Logo({ variant = 'dark', size = 'md' }) {
  const sizes = {
    sm: { text: 'text-2xl', sub: 'text-[8px]', ball: 14, gap: 'tracking-[0.2em]' },
    md: { text: 'text-3xl', sub: 'text-[10px]', ball: 18, gap: 'tracking-[0.25em]' },
    lg: { text: 'text-5xl', sub: 'text-sm', ball: 26, gap: 'tracking-[0.3em]' },
  };

  const s = sizes[size];
  const textColor = variant === 'dark' ? 'text-alma-green' : 'text-white';
  const subColor = variant === 'dark' ? 'text-alma-green' : 'text-white/90';

  return (
    <Link to="/" className="inline-flex flex-col items-center group">
      <div className="flex items-end">
        <span
          className={`${s.text} font-display italic font-bold ${textColor} leading-none`}
          style={{ fontFamily: "'Dancing Script', 'Playfair Display', cursive" }}
        >
          alma
        </span>
        {/* Tennis Ball SVG */}
        <svg
          width={s.ball}
          height={s.ball}
          viewBox="0 0 40 40"
          className="-ml-1 -mb-0.5 group-hover:rotate-12 transition-transform"
        >
          <circle cx="20" cy="20" r="19" fill="#A8D86E" />
          <circle cx="20" cy="20" r="19" fill="url(#ballGrad)" />
          <path
            d="M8 8c4 6 4 18 0 24"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M32 8c-4 6-4 18 0 24"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
          <defs>
            <radialGradient id="ballGrad" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#C4E8A0" />
              <stop offset="100%" stopColor="#A8D86E" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <span
        className={`${s.sub} ${s.gap} uppercase font-semibold ${subColor} mt-0.5`}
      >
        Tennis Academy
      </span>
    </Link>
  );
}
