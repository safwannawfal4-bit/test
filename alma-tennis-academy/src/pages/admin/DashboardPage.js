import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useOrders } from '../../context/OrderContext';
import { useData } from '../../context/DataContext';
import { useEnrollments } from '../../context/EnrollmentContext';

export default function DashboardPage() {
  const { orders } = useOrders();
  const { products, programs } = useData();
  const { enrollments } = useEnrollments();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'customer'));
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

  // Revenue by day (last 7 days)
  const revenueByDay = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayRevenue = orders.reduce((sum, o) => {
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      if (orderDate >= dayStart && orderDate < dayEnd) return sum + (o.total || 0);
      return sum;
    }, 0);
    revenueByDay.push({ label: dateStr, value: dayRevenue });
  }
  const maxRevenue = Math.max(...revenueByDay.map(d => d.value), 1);

  // Top selling
  const productSales = {};
  orders.forEach(order => {
    (order.items || []).forEach(ci => {
      const key = ci.item?.name || 'Unknown';
      productSales[key] = (productSales[key] || 0) + ci.quantity;
    });
  });
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Popular programs by enrollment
  const programEnrollments = {};
  enrollments.forEach(e => {
    programEnrollments[e.programName] = (programEnrollments[e.programName] || 0) + 1;
  });
  const topPrograms = Object.entries(programEnrollments).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // New customers this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = customers.filter(c => {
    const d = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
    return d >= monthStart;
  }).length;

  const recentOrders = orders.slice(0, 5);
  const recentCustomers = [...customers].sort((a, b) => {
    const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const db2 = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return db2 - da;
  }).slice(0, 5);

  const StatCard = ({ icon, label, value, sub, color = 'text-alma-green' }) => (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs text-alma-charcoal/40">{sub}</span>}
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-alma-charcoal/50 mt-1">{label}</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-alma-green">Dashboard</h1>
        <p className="text-sm text-alma-charcoal/40">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard icon="📦" label="Total Orders" value={totalOrders} />
        <StatCard icon="👥" label="Customers" value={customers.length} sub={`+${newThisMonth} this month`} />
        <StatCard icon="🎓" label="Active Enrollments" value={activeEnrollments} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Revenue (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-40">
          {revenueByDay.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-alma-green">
                {day.value > 0 ? `$${day.value.toFixed(0)}` : ''}
              </span>
              <div
                className="w-full bg-alma-lime rounded-t-lg transition-all duration-500"
                style={{ height: `${Math.max((day.value / maxRevenue) * 100, 2)}%`, minHeight: day.value > 0 ? '8px' : '2px' }}
              />
              <span className="text-xs text-alma-charcoal/40">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory + Avg Order */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="🎾" label="Products" value={products.length} />
        <StatCard icon="📋" label="Programs" value={programs.length} />
        <StatCard icon="📈" label="Avg Order Value" value={`$${avgOrder.toFixed(2)}`} />
        <StatCard icon="🆕" label="New This Month" value={newThisMonth} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-alma-green">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-alma-lime hover:text-alma-green">View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-alma-charcoal/40 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{order.customerName}</p>
                    <p className="text-xs text-alma-charcoal/40">{order.items?.length || 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-alma-green text-sm">${(order.total || 0).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-alma-green">New Customers</h2>
            <Link to="/admin/customers" className="text-xs text-alma-lime hover:text-alma-green">View All →</Link>
          </div>
          {recentCustomers.length === 0 ? (
            <p className="text-alma-charcoal/40 text-sm">No customers yet.</p>
          ) : (
            <div className="space-y-3">
              {recentCustomers.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-alma-lime/20 rounded-full flex items-center justify-center text-xs font-bold text-alma-green">
                      {(c.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-alma-charcoal/40">{c.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-alma-charcoal/40">
                    {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Top Selling Items</h2>
          {topProducts.length === 0 ? (
            <p className="text-alma-charcoal/40 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-alma-charcoal/30">#{i + 1}</span>
                    <p className="font-medium text-sm">{name}</p>
                  </div>
                  <span className="text-sm font-semibold text-alma-green">{qty} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Program Enrollments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Program Enrollments</h2>
          {topPrograms.length === 0 ? (
            <p className="text-alma-charcoal/40 text-sm">No enrollments yet.</p>
          ) : (
            <div className="space-y-3">
              {topPrograms.map(([name, count]) => {
                const program = programs.find(p => p.name === name);
                const total = program?.spotsTotal || program?.spotsAvailable || 10;
                const pct = Math.min((count / total) * 100, 100);
                return (
                  <div key={name} className="py-2 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{name}</span>
                      <span className="text-alma-green font-semibold">{count} enrolled</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-alma-lime rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-alma-green mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products" className="btn-primary text-sm">+ Add Product</Link>
          <Link to="/admin/programs" className="btn-secondary text-sm">+ Add Program</Link>
          <Link to="/admin/orders" className="btn-outline text-sm">View Orders</Link>
          <Link to="/admin/customers" className="btn-outline text-sm">View Customers</Link>
        </div>
      </div>
    </div>
  );
}
