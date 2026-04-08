import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('Products listener error:', err));

    const unsub2 = onSnapshot(collection(db, 'programs'), (snap) => {
      setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => console.error('Programs listener error:', err));

    return () => { unsub1(); unsub2(); };
  }, []);

  const addProduct = async (product) => {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
    });
    return docRef;
  };

  const updateProduct = async (id, updates) => {
    await updateDoc(doc(db, 'products', id), updates);
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const addProgram = async (program) => {
    const docRef = await addDoc(collection(db, 'programs'), {
      ...program,
      spotsTotal: program.spotsAvailable,
      createdAt: serverTimestamp(),
    });
    return docRef;
  };

  const updateProgram = async (id, updates) => {
    await updateDoc(doc(db, 'programs', id), updates);
  };

  const deleteProgram = async (id) => {
    await deleteDoc(doc(db, 'programs', id));
  };

  return (
    <DataContext.Provider
      value={{
        products, programs, loading,
        addProduct, updateProduct, deleteProduct,
        addProgram, updateProgram, deleteProgram,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
