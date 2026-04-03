import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categoryEmojis = {
  rackets: '🎾', balls: '🟡', bags: '🎒', strings: '🧵', accessories: '⭐',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card group">
      <Link to={`/shop/${product.id}`}>
        <div className="aspect-square bg-alma-cream-dark flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
              {categoryEmojis[product.category] || '🎾'}
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <span className="text-xs font-medium text-alma-lime bg-alma-lime/10 px-2 py-1 rounded-full uppercase tracking-wide">
          {product.category}
        </span>
        <Link to={`/shop/${product.id}`}>
          <h3 className="mt-3 font-semibold text-alma-green hover:text-alma-green-light transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-alma-charcoal/60 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-alma-green">${product.price}</span>
          <button
            onClick={() => addToCart(product, 'product')}
            className="bg-alma-lime text-alma-green px-4 py-2 rounded-lg text-sm font-semibold hover:bg-alma-lime-light transition-all active:scale-95"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
