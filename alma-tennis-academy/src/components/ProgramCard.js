import { useCart } from '../context/CartContext';

export default function ProgramCard({ program }) {
  const { addToCart } = useCart();

  const typeColors = {
    group: 'bg-blue-100 text-blue-700',
    private: 'bg-purple-100 text-purple-700',
    camp: 'bg-orange-100 text-orange-700',
  };

  const ageIcons = {
    kids: '👦',
    teens: '🧑',
    adults: '👨',
    all: '👨‍👩‍👧‍👦',
  };

  return (
    <div className="card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide ${typeColors[program.type]}`}>
          {program.type}
        </span>
        <span className="text-2xl">{ageIcons[program.ageGroup]}</span>
      </div>

      <h3 className="text-xl font-semibold text-alma-green">{program.name}</h3>
      <p className="mt-2 text-sm text-alma-charcoal/60 flex-grow">{program.description}</p>

      <div className="mt-5 space-y-2 text-sm text-alma-charcoal/80">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-alma-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {program.duration}
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-alma-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {program.schedule}
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-alma-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {program.level}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-alma-cream-dark flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-alma-green">${program.price}</span>
          <span className="text-sm text-alma-charcoal/50 ml-1">/ {program.type === 'private' ? 'session' : 'program'}</span>
        </div>
        <button
          onClick={() => addToCart(program, 'program')}
          className="btn-primary text-sm py-2"
        >
          {program.spotsAvailable <= 4 ? `Enroll (${program.spotsAvailable} spots)` : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
}
