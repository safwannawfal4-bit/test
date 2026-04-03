import { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('alma-orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alma-orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = ({ items, subtotal, discountAmount, total, customerEmail, customerName }) => {
    const order = {
      id: 'ORD-' + Date.now(),
      items,
      subtotal,
      discountAmount,
      total,
      customerEmail,
      customerName,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status } : o)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}
