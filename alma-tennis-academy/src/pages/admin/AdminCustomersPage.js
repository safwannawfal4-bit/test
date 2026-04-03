import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useOrders } from '../../context/OrderContext';
import { useEnrollments } from '../../context/EnrollmentContext';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const { orders } = useOrders();
  const { enrollments } = useEnrollments();

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'customer'));
    const unsub = onSnapshot(q, (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const filtered = customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getCustomerOrders = (uid) => orders.filter(o => o.userId === uid);
  const getCustomerEnrollments = (uid) => enrollments.filter(e => e.userId === uid);

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-alma-green">Customers ({customers.length})</h1>
      </div>

      <div className="mb-4">
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-alma-charcoal/50">No customers found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(customer => {
            const custOrders = getCustomerOrders(customer.uid || customer.id);
            const custEnrollments = getCustomerEnrollments(customer.uid || customer.id);
            const isExpanded = expandedId === customer.id;

            return (
              <div key={customer.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : customer.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-alma-lime/20 rounded-full flex items-center justify-center text-alma-green font-bold">
                      {(customer.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-alma-green">{customer.name}</p>
                      <p className="text-xs text-alma-charcoal/50">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center hidden sm:block">
                      <p className="font-bold text-alma-green">{customer.orderCount || custOrders.length}</p>
                      <p className="text-xs text-alma-charcoal/40">Orders</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="font-bold text-alma-green">${(customer.totalSpent || 0).toFixed(2)}</p>
                      <p className="text-xs text-alma-charcoal/40">Spent</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="font-bold text-alma-green">{custEnrollments.length}</p>
                      <p className="text-xs text-alma-charcoal/40">Programs</p>
                    </div>
                    <div className="text-xs text-alma-charcoal/40">
                      Joined {formatDate(customer.createdAt)}
                    </div>
                    <svg className={`w-5 h-5 text-alma-charcoal/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-alma-charcoal/40 mb-1">Phone</p>
                        <p className="font-medium text-sm">{customer.phone || 'Not provided'}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-alma-charcoal/40 mb-1">Lifetime Value</p>
                        <p className="font-medium text-sm text-alma-green">${(customer.totalSpent || 0).toFixed(2)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-alma-charcoal/40 mb-1">Member Since</p>
                        <p className="font-medium text-sm">{formatDate(customer.createdAt)}</p>
                      </div>
                    </div>

                    {/* Enrolled Programs */}
                    {custEnrollments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-alma-green mb-2">Enrolled Programs</h4>
                        <div className="space-y-1">
                          {custEnrollments.map(e => (
                            <div key={e.id} className="flex justify-between bg-white rounded-lg px-3 py-2 text-sm">
                              <span>{e.programName}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                e.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>{e.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Order History */}
                    {custOrders.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-alma-green mb-2">Order History</h4>
                        <div className="space-y-1">
                          {custOrders.map(o => (
                            <div key={o.id} className="flex justify-between bg-white rounded-lg px-3 py-2 text-sm">
                              <div>
                                <span className="font-mono text-xs text-alma-charcoal/40">{o.id?.slice(0, 8)}</span>
                                <span className="ml-2">{o.items?.length || 0} items</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">${(o.total || 0).toFixed(2)}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  o.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>{o.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {custOrders.length === 0 && custEnrollments.length === 0 && (
                      <p className="text-sm text-alma-charcoal/40 text-center py-4">No orders or enrollments yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
