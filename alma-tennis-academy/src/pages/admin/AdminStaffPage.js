import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';

const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'products', label: 'Products', icon: '🎾' },
  { key: 'programs', label: 'Programs', icon: '📋' },
  { key: 'orders', label: 'Orders', icon: '📦' },
  { key: 'customers', label: 'Customers', icon: '👥' },
  { key: 'staff', label: 'Staff Management', icon: '🏢' },
  { key: 'help', label: 'Help & Guide', icon: '❓' },
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', permissions: ['dashboard'] });
  const [taskForm, setTaskForm] = useState({ assignTo: '', title: '', description: '', priority: 'medium', dueDate: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'employee'));
    const unsub = onSnapshot(q, (snap) => {
      setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsub2 = onSnapshot(collection(db, 'tasks'), (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsub(); unsub2(); };
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      // Create Firestore user doc with employee role
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: form.email,
        name: form.name,
        phone: form.phone,
        role: 'employee',
        permissions: form.permissions,
        createdAt: new Date().toISOString(),
        totalSpent: 0,
        orderCount: 0,
      });
      setForm({ name: '', email: '', password: '', phone: '', permissions: ['dashboard'] });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleUpdatePermissions = async (staffMember, permissions) => {
    await updateDoc(doc(db, 'users', staffMember.id), { permissions });
  };

  const handleDeleteEmployee = async (staffMember) => {
    if (window.confirm(`Remove "${staffMember.name}" from staff?`)) {
      await updateDoc(doc(db, 'users', staffMember.id), { role: 'customer', permissions: [] });
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const assignee = staff.find(s => s.id === taskForm.assignTo);
      await setDoc(doc(collection(db, 'tasks')), {
        ...taskForm,
        assigneeName: assignee?.name || 'Unassigned',
        assigneeEmail: assignee?.email || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setTaskForm({ assignTo: '', title: '', description: '', priority: 'medium', dueDate: '' });
      setShowTaskForm(false);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handleTaskStatus = async (taskId, status) => {
    await updateDoc(doc(db, 'tasks', taskId), { status });
  };

  const handleDeleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const togglePermission = (perm) => {
    if (editingStaff) {
      const current = editingStaff.permissions || [];
      const updated = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
      handleUpdatePermissions(editingStaff, updated);
      setEditingStaff({ ...editingStaff, permissions: updated });
    } else {
      setForm(f => ({
        ...f,
        permissions: f.permissions.includes(perm)
          ? f.permissions.filter(p => p !== perm)
          : [...f.permissions, perm],
      }));
    }
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-alma-green">Staff & Tasks</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowTaskForm(true); setShowAddForm(false); }} className="btn-secondary text-sm">
            + Assign Task
          </button>
          <button onClick={() => { setShowAddForm(true); setShowTaskForm(false); }} className="btn-primary text-sm">
            + Add Employee
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Create Employee Account</h2>
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name" className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime" />
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Email" className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime" />
              <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Password (min 6 chars)" className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime" />
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone" className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime" />
            </div>
            <div>
              <p className="text-sm font-medium text-alma-green mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {ALL_PERMISSIONS.map(p => (
                  <button key={p.key} type="button" onClick={() => togglePermission(p.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      form.permissions.includes(p.key)
                        ? 'bg-alma-green text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Employee'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Assign Task Form */}
      {showTaskForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Assign Task</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select required value={taskForm.assignTo} onChange={e => setTaskForm({ ...taskForm, assignTo: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime">
                <option value="">Assign to...</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input required value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="Task title" className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime md:col-span-2" />
              <textarea value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Task description..." rows={2}
                className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime resize-none md:col-span-2" />
              <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-alma-lime" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                {saving ? 'Assigning...' : 'Assign Task'}
              </button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Team Members ({staff.length})</h2>
        {staff.length === 0 ? (
          <p className="text-alma-charcoal/40 text-sm text-center py-8">No employees yet. Click "+ Add Employee" to create one.</p>
        ) : (
          <div className="space-y-4">
            {staff.map(member => (
              <div key={member.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-alma-lime/20 rounded-full flex items-center justify-center text-alma-green font-bold">
                      {(member.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-alma-green">{member.name}</p>
                      <p className="text-xs text-alma-charcoal/50">{member.email} {member.phone && `| ${member.phone}`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingStaff(editingStaff?.id === member.id ? null : member)}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                    >
                      {editingStaff?.id === member.id ? 'Done' : 'Edit Access'}
                    </button>
                    <button onClick={() => handleDeleteEmployee(member)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
                  </div>
                </div>
                {editingStaff?.id === member.id ? (
                  <div className="flex flex-wrap gap-2">
                    {ALL_PERMISSIONS.map(p => (
                      <button key={p.key} type="button" onClick={() => togglePermission(p.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          (editingStaff.permissions || []).includes(p.key)
                            ? 'bg-alma-green text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        {p.icon} {p.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {(member.permissions || []).map(p => {
                      const perm = ALL_PERMISSIONS.find(a => a.key === p);
                      return perm ? (
                        <span key={p} className="bg-alma-lime/10 text-alma-green text-xs px-2 py-0.5 rounded-full">
                          {perm.icon} {perm.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="text-alma-charcoal/40 text-sm text-center py-8">No tasks yet. Click "+ Assign Task" to create one.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{task.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>{task.priority}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>{task.status}</span>
                    </div>
                    {task.description && <p className="text-xs text-alma-charcoal/60 mb-1">{task.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-alma-charcoal/40">
                      <span>Assigned to: <strong>{task.assigneeName}</strong></span>
                      {task.dueDate && <span>Due: {task.dueDate}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <select value={task.status} onChange={e => handleTaskStatus(task.id, e.target.value)}
                      className="text-xs border rounded-lg px-2 py-1 outline-none">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400 hover:text-red-600 text-xs p-1">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
