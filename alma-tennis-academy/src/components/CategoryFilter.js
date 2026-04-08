export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selected === 'all'
            ? 'bg-alma-green text-white'
            : 'bg-white text-alma-charcoal hover:bg-alma-cream-dark'
        }`}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
            selected === cat
              ? 'bg-alma-green text-white'
              : 'bg-white text-alma-charcoal hover:bg-alma-cream-dark'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
