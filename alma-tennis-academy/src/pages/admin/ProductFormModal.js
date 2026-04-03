import { useState, useEffect } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { uploadImage } from '../../utils/uploadImage';

export default function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', category: 'rackets', price: '', description: '',
    features: '', inStock: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        features: (product.features || []).join(', '),
        inStock: product.inStock,
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = product?.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'products');
      }
      await onSave({
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        description: form.description,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        inStock: form.inStock,
        imageUrl,
      });
    } catch (err) {
      console.error('Save error:', err);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-alma-green">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ImageUpload currentUrl={product?.imageUrl} onFileSelect={setImageFile} />
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Product Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime outline-none">
                <option value="rackets">Rackets</option>
                <option value="balls">Balls</option>
                <option value="bags">Bags</option>
                <option value="strings">Strings</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-alma-green mb-1">Price ($)</label>
              <input required type="number" step="0.01" min="0" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Description</label>
            <textarea required rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-alma-green mb-1">Features (comma-separated)</label>
            <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })}
              placeholder="Feature 1, Feature 2, Feature 3"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.inStock}
              onChange={e => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 rounded text-alma-green" />
            <span className="text-sm text-alma-charcoal">In Stock</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-grow disabled:opacity-50">
              {saving ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
