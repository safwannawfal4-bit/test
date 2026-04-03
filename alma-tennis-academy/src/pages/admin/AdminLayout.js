import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const allLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', perm: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: '🎾', perm: 'products' },
  { to: '/admin/programs', label: 'Programs', icon: '📋', perm: 'programs' },
  { to: '/admin/orders', label: 'Orders', icon: '📦', perm: 'orders' },
  { to: '/admin/customers', label: 'Customers', icon: '👥', perm: 'customers' },
  { to: '/admin/staff', label: 'Staff & Tasks', icon: '🏢', perm: 'staff' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️', perm: 'staff' },
  { to: '/admin/tracking', label: 'Tracking', icon: '📊', perm: 'staff' },
  { to: '/admin/help', label: 'Help', icon: '❓', perm: 'help' },
];

export default function AdminLayout() {
  const { logout, hasPermission, isAdmin, user } = useAuth();

  const links = allLinks.filter(link => hasPermission(link.perm));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-alma-green text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-display font-bold italic">Alma Admin</h1>
          <p className="text-xs text-white/50 mt-1">
            {isAdmin ? 'Administrator' : `Employee: ${user?.name}`}
          </p>
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
        <h1 className="font-display font-bold italic text-sm">Alma Admin</h1>
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
