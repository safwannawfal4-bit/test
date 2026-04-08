import { Link } from 'react-router-dom';

export default function DiscountBadge() {
  return (
    <Link to="/shop" className="inline-flex items-center gap-1.5 bg-alma-lime/20 text-alma-green text-xs font-bold px-3 py-1.5 rounded-full">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      20% OFF Member
    </Link>
  );
}
