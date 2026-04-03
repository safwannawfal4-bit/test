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
    });
    const unsub2 = onSnapshot(collection(db, 'programs'), (snap) => {
      setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const addProduct = async (product) => {
    return addDoc(collection(db, 'products'), {
      ...product,
      createdAt: serverTimestamp(),
    });
  };

  const updateProduct = async (id, updates) => {
    return updateDoc(doc(db, 'products', id), updates);
  };

  const deleteProduct = async (id) => {
    return deleteDoc(doc(db, 'products', id));
  };

  const addProgram = async (program) => {
    return addDoc(collection(db, 'programs'), {
      ...program,
      spotsTotal: program.spotsAvailable,
      createdAt: serverTimestamp(),
    });
  };

  const updateProgram = async (id, updates) => {
    return updateDoc(doc(db, 'programs', id), updates);
  };

  const deleteProgram = async (id) => {
    return deleteDoc(doc(db, 'programs', id));
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
