import { useState } from 'react';
import { useData } from '../../context/DataContext';
import ProgramFormModal from './ProgramFormModal';

export default function AdminProgramsPage() {
  const { programs, addProgram, updateProgram, deleteProgram } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = (data) => {
    if (editing) {
      updateProgram(editing.id, data);
    } else {
      addProgram(data);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleEdit = (program) => {
    setEditing(program);
    setShowModal(true);
  };

  const handleDelete = (program) => {
    if (window.confirm(`Delete "${program.name}"?`)) {
      deleteProgram(program.id);
    }
  };

  const typeColors = {
    group: 'bg-blue-100 text-blue-700',
    private: 'bg-purple-100 text-purple-700',
    camp: 'bg-orange-100 text-orange-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-alma-green">Programs ({programs.length})</h1>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="btn-primary text-sm"
        >
          + Add Program
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Name</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Type</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Age</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Price</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Spots</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.map(program => (
                <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-alma-green">{program.name}</td>
                  <td className="px-4 py-3">
                    <span className={`capitalize text-xs px-2 py-1 rounded-full ${typeColors[program.type] || ''}`}>
                      {program.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-alma-charcoal/70">{program.ageGroup}</td>
                  <td className="px-4 py-3 font-semibold">${program.price}</td>
                  <td className="px-4 py-3">{program.spotsAvailable}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(program)}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(program)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProgramFormModal
          program={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
