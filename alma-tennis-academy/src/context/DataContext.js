import { createContext, useContext, useState, useEffect } from 'react';
import defaultProducts from '../data/products';
import defaultPrograms from '../data/programs';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('alma-products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [programs, setPrograms] = useState(() => {
    const saved = localStorage.getItem('alma-programs');
    return saved ? JSON.parse(saved) : defaultPrograms;
  });

  useEffect(() => {
    localStorage.setItem('alma-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('alma-programs', JSON.stringify(programs));
  }, [programs]);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addProgram = (program) => {
    const newProgram = { ...program, id: Date.now() };
    setPrograms(prev => [...prev, newProgram]);
    return newProgram;
  };

  const updateProgram = (id, updates) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProgram = (id) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        products, programs,
        addProduct, updateProduct, deleteProduct,
        addProgram, updateProgram, deleteProgram,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
