import { Link } from 'react-router-dom';
import { usePageContent } from '../context/PageContentContext';

export default function Logo({ variant = 'dark', size = 'md' }) {
  const { logoUrl } = usePageContent();

  const heights = { sm: 'h-10', md: 'h-14', lg: 'h-20' };

  // If a custom logo is uploaded, show it
  if (logoUrl) {
    return (
      <Link to="/" className="inline-block group">
        <img
          src={logoUrl}
          alt="Alma Tennis Academy"
          className={`${heights[size]} w-auto object-contain group-hover:scale-105 transition-transform`}
          style={variant === 'light' ? { filter: 'brightness(10)' } : {}}
        />
      </Link>
    );
  }

  // Default text logo
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
        <svg width={s.ball} height={s.ball} viewBox="0 0 40 40"
          className="-ml-1 -mb-0.5 group-hover:rotate-12 transition-transform">
          <circle cx="20" cy="20" r="19" fill="var(--color-accent, #A8D86E)" />
          <path d="M8 8c4 6 4 18 0 24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M32 8c-4 6-4 18 0 24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>
      <span className={`${s.sub} ${s.gap} uppercase font-semibold ${subColor} mt-0.5`}>
        Tennis Academy
      </span>
    </Link>
  );
}
