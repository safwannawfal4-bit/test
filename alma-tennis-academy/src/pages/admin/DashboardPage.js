import { useOrders } from '../../context/OrderContext';
import { useData } from '../../context/DataContext';

export default function DashboardPage() {
  const { orders } = useOrders();
  const { products, programs } = useData();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Top selling products
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(ci => {
      const key = ci.item.name;
      productSales[key] = (productSales[key] || 0) + ci.quantity;
    });
  });
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentOrders = orders.slice(0, 5);

  const StatCard = ({ icon, label, value, sub }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {sub && <span className="text-xs text-alma-charcoal/40">{sub}</span>}
      </div>
      <p className="text-2xl font-bold text-alma-green">{value}</p>
      <p className="text-sm text-alma-charcoal/50 mt-1">{label}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-alma-green mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard icon="📦" label="Total Orders" value={totalOrders} />
        <StatCard icon="👥" label="Customers" value={uniqueCustomers} />
        <StatCard icon="📈" label="Avg Order Value" value={`$${avgOrder.toFixed(2)}`} />
      </div>

      {/* Inventory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-alma-green mb-1">Products</h3>
          <p className="text-3xl font-bold text-alma-charcoal">{products.length}</p>
          <p className="text-sm text-alma-charcoal/50">items in catalog</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-alma-green mb-1">Programs</h3>
          <p className="text-3xl font-bold text-alma-charcoal">{programs.length}</p>
          <p className="text-sm text-alma-charcoal/50">active programs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-alma-charcoal/40 text-sm">No orders yet. Orders will appear here as customers check out.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{order.customerName}</p>
                    <p className="text-xs text-alma-charcoal/40">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-alma-green text-sm">${order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
}
