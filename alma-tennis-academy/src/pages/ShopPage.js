import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import products from '../data/products';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [...new Set(products.map(p => p.category))];
  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="section-title">Shop Equipment</h1>
        <p className="section-subtitle mx-auto">
          Quality tennis gear recommended by our professional coaches.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex justify-center">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-alma-charcoal/50">
          <p className="text-xl">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
