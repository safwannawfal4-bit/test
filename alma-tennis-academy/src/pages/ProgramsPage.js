import { useState } from 'react';
import ProgramCard from '../components/ProgramCard';
import { useData } from '../context/DataContext';

export default function ProgramsPage() {
  const { programs } = useData();
  const [typeFilter, setTypeFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');

  const filtered = programs.filter(p => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (ageFilter !== 'all' && p.ageGroup !== ageFilter) return false;
    return true;
  });

  const FilterButton = ({ value, current, onChange, children }) => (
    <button
      onClick={() => onChange(value)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        current === value
          ? 'bg-alma-green text-white'
          : 'bg-white text-alma-charcoal hover:bg-alma-cream-dark'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="section-title">Programs & Lessons</h1>
        <p className="section-subtitle mx-auto">
          Find the perfect program for your skill level and goals.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-sm font-medium text-alma-charcoal/50 self-center mr-2">Type:</span>
          <FilterButton value="all" current={typeFilter} onChange={setTypeFilter}>All</FilterButton>
          <FilterButton value="group" current={typeFilter} onChange={setTypeFilter}>Group</FilterButton>
          <FilterButton value="private" current={typeFilter} onChange={setTypeFilter}>Private</FilterButton>
          <FilterButton value="camp" current={typeFilter} onChange={setTypeFilter}>Camp</FilterButton>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-sm font-medium text-alma-charcoal/50 self-center mr-2">Age:</span>
          <FilterButton value="all" current={ageFilter} onChange={setAgeFilter}>All Ages</FilterButton>
          <FilterButton value="kids" current={ageFilter} onChange={setAgeFilter}>Kids</FilterButton>
          <FilterButton value="teens" current={ageFilter} onChange={setAgeFilter}>Teens</FilterButton>
          <FilterButton value="adults" current={ageFilter} onChange={setAgeFilter}>Adults</FilterButton>
        </div>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(program => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-alma-charcoal/50">
          <p className="text-xl">No programs match your filters.</p>
          <button
            onClick={() => { setTypeFilter('all'); setAgeFilter('all'); }}
            className="btn-outline mt-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
