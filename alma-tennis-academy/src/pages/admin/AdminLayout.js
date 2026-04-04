import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const allLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', perm: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: '🎾', perm: 'products' },
  { to: '/admin/programs', label: 'Programs', icon: '📋', perm: 'programs' },
  { to: '/admin/orders', label: 'Orders', icon: '📦', perm: 'orders' },
  { to: '/admin/customers', label: 'Customers', icon: '👥', perm: 'customers' },
  { to: '/admin/social', label: 'Social Posts', icon: '📱', perm: 'staff' },
  { to: '/admin/staff', label: 'Staff & Tasks', icon: '🏢', perm: 'staff' },
  { to: '/admin/tracking', label: 'Tracking', icon: '📡', perm: 'staff' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️', perm: 'staff' },
  { to: '/admin/help', label: 'Help', icon: '❓', perm: 'help' },
];

export default function AdminLayout() {
  const { logout, hasPermission, isAdmin, user } = useAuth();

  const links = allLinks.filter(link => hasPermission(link.perm));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - fixed, doesn't scroll with page */}
      <aside className="w-56 bg-alma-green text-white flex-shrink-0 hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40">
        <div className="px-4 py-4 border-b border-white/10">
          <h1 className="text-lg font-display font-bold italic">Alma Admin</h1>
          <p className="text-[10px] text-white/50 mt-0.5">
            {isAdmin ? 'Administrator' : `Employee: ${user?.name}`}
          </p>
        </div>
        <nav className="flex-grow px-3 py-2 space-y-0.5 overflow-y-auto">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-sm">{link.icon}</span>{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 text-xs text-white/70 hover:text-white transition-colors">
            ← Back to Site
          </Link>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-300 hover:text-red-200 transition-colors w-full">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-alma-green text-white z-50 px-4 py-3 flex items-center justify-between">
        <h1 className="font-display font-bold italic text-sm">Alma Admin</h1>
        <div className="flex gap-2 overflow-x-auto">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}
              className={({ isActive }) => `text-base ${isActive ? 'opacity-100' : 'opacity-50'}`}
            >
              {link.icon}
            </NavLink>
          ))}
          <Link to="/" className="text-base opacity-50 hover:opacity-100">🏠</Link>
        </div>
      </div>

      {/* Main content - offset by sidebar width */}
      <main className="flex-grow md:ml-56 p-6 md:p-8 md:mt-0 mt-14 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
