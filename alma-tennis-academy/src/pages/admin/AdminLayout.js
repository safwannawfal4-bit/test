import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
    { to: '/admin/products', label: 'Products', icon: '🎾' },
    { to: '/admin/programs', label: 'Programs', icon: '📋' },
    { to: '/admin/orders', label: 'Orders', icon: '📦' },
    { to: '/admin/customers', label: 'Customers', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-alma-green text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-display font-bold italic">Alma Admin</h1>
          <p className="text-xs text-white/50 mt-1">Management Dashboard</p>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span>{link.icon}</span>{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
            ← Back to Site
          </Link>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-300 hover:text-red-200 transition-colors w-full">
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 bg-alma-green text-white z-50 px-4 py-3 flex items-center justify-between">
        <h1 className="font-display font-bold italic">Alma Admin</h1>
        <div className="flex gap-3">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) => `text-lg ${isActive ? 'opacity-100' : 'opacity-50'}`}
            >
              {link.icon}
            </NavLink>
          ))}
          <Link to="/" className="text-lg opacity-50 hover:opacity-100">🏠</Link>
        </div>
      </div>

      <main className="flex-grow p-6 md:p-8 overflow-auto md:mt-0 mt-14">
        <Outlet />
      </main>
    </div>
  );
}
