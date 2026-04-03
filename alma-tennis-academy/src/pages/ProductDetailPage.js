import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { products } = useData();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h1 className="section-title">Product Not Found</h1>
        <Link to="/shop" className="btn-primary mt-6 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, 'product');
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const categoryEmojis = {
    rackets: '🎾',
    balls: '🟡',
    bags: '🎒',
    strings: '🧵',
    accessories: '⭐',
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-alma-charcoal/50">
        <Link to="/" className="hover:text-alma-green transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-alma-green transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-alma-green">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square bg-white rounded-2xl shadow-md flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-9xl">{categoryEmojis[product.category]}</span>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-sm font-medium text-alma-lime bg-alma-lime/10 px-3 py-1 rounded-full uppercase tracking-wide">
            {product.category}
          </span>

          <h1 className="mt-4 text-3xl md:text-4xl font-display font-bold text-alma-green">
            {product.name}
          </h1>

          <p className="mt-4 text-lg text-alma-charcoal/70 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 text-4xl font-bold text-alma-green">
            ${product.price}
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="font-semibold text-alma-green mb-3">Features</h3>
            <ul className="space-y-2">
              {product.features.map(feature => (
                <li key={feature} className="flex items-center gap-2 text-alma-charcoal/70">
                  <svg className="w-5 h-5 text-alma-lime flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border-2 border-alma-cream-dark rounded-lg">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-3 text-alma-green font-bold hover:bg-alma-cream-dark transition-colors"
              >
                -
              </button>
              <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-3 text-alma-green font-bold hover:bg-alma-cream-dark transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-grow py-3 rounded-lg font-semibold text-lg transition-all active:scale-95 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-alma-green text-white hover:bg-alma-green-light'
              }`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
          </div>

          {product.inStock ? (
            <p className="mt-4 text-sm text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              In Stock - Ready to Ship
            </p>
          ) : (
            <p className="mt-4 text-sm text-red-500">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
}
