import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const placeOrder = async (orderData) => {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'confirmed',
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...orderData };
  };

  const updateOrderStatus = async (orderId, status) => {
    return updateDoc(doc(db, 'orders', orderId), { status });
  };

  return (
    <OrderContext.Provider value={{ orders, loading, placeOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
}
