import { useState } from 'react';
import { useOrders } from '../../context/OrderContext';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();
  const [expandedId, setExpandedId] = useState(null);

  const statusOptions = ['confirmed', 'processing', 'shipped', 'delivered'];
  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-purple-100 text-purple-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-alma-green mb-6">Orders ({orders.length})</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-alma-charcoal/50">No orders yet. Orders will appear here as customers check out.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Order header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono text-xs text-alma-charcoal/40">{order.id}</p>
                    <p className="font-semibold text-alma-green">{order.customerName}</p>
                    <p className="text-xs text-alma-charcoal/50">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-alma-green">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-alma-charcoal/40">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); updateOrderStatus(order.id, e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 outline-none cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                  >
                    {statusOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <svg className={`w-5 h-5 text-alma-charcoal/30 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-alma-charcoal/50">
                        <th className="pb-2 font-medium">Item</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium text-right">Qty</th>
                        <th className="pb-2 font-medium text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.items.map((ci, i) => (
                        <tr key={i}>
                          <td className="py-2 font-medium">{ci.item.name}</td>
                          <td className="py-2 capitalize text-alma-charcoal/60">{ci.itemType}</td>
                          <td className="py-2 text-right">{ci.quantity}</td>
                          <td className="py-2 text-right">${(ci.item.price * ci.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm space-y-1">
                    <div className="flex justify-between text-alma-charcoal/60">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Member Discount</span>
                        <span>-${order.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-alma-green">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
