import { useState, useEffect } from 'react';

export default function ProgramFormModal({ program, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', ageGroup: 'all', type: 'group', price: '',
    duration: '', schedule: '', description: '', spotsAvailable: '10', level: 'All Levels',
  });

  useEffect(() => {
    if (program) {
      setForm({
        name: program.name,
        ageGroup: program.ageGroup,
        type: program.type,
        price: program.price.toString(),
        duration: program.duration,
        schedule: program.schedule,
        description: program.description,
        spotsAvailable: program.spotsAvailable.toString(),
        level: program.level,
      });
    }
  }, [program]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: form.name,
      ageGroup: form.ageGroup,
      type: form.type,
      price: parseFloat(form.price),
      duration: form.duration,
      schedule: form.schedule,
      description: form.description,
      spotsAvailable: parseInt(form.spotsAvailable),
      level: form.level,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-alma-green">
            {program ? 'Edit Program' : 'Add New Program'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Program Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none">
                <option value="group">Group</option>
                <option value="private">Private</option>
                <option value="camp">Camp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Age Group</label>
              <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none">
                <option value="kids">Kids</option>
                <option value="teens">Teens</option>
                <option value="adults">Adults</option>
                <option value="all">All Ages</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Price ($)</label>
              <input required type="number" step="0.01" min="0" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Duration</label>
              <input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 8 weeks"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Spots Available</label>
              <input required type="number" min="0" value={form.spotsAvailable}
                onChange={e => setForm({ ...form, spotsAvailable: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Schedule</label>
            <input required value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })}
              placeholder="e.g. Mon & Wed, 4:00 - 5:30 PM"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Level</label>
            <input required value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
              placeholder="e.g. Beginner to Intermediate"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Description</label>
            <textarea required rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-grow">
              {program ? 'Save Changes' : 'Add Program'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
