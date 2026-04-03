import { useState } from 'react';
import { useData } from '../../context/DataContext';
import ProductFormModal from './ProductFormModal';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleSave = (data) => {
    if (editing) {
      updateProduct(editing.id, data);
    } else {
      addProduct(data);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-alma-green">Products ({products.length})</h1>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="btn-primary text-sm"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Name</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Category</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Price</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60">Stock</th>
                <th className="px-4 py-3 font-medium text-alma-charcoal/60 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-alma-green">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize bg-alma-lime/10 text-alma-green text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">${product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700 text-xs font-medium">Edit</button>
                    <button onClick={() => handleDelete(product)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductFormModal
          product={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
