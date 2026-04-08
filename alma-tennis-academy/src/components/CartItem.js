import { useCart } from '../context/CartContext';

export default function CartItem({ cartItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { item, itemType, quantity } = cartItem;

  return (
    <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
      {/* Icon */}
      <div className="w-20 h-20 bg-alma-cream-dark rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
        {itemType === 'program' ? '📋' : (
          item.category === 'rackets' ? '🎾' :
          item.category === 'balls' ? '🟡' :
          item.category === 'bags' ? '🎒' :
          item.category === 'strings' ? '🧵' : '⭐'
        )}
      </div>

      {/* Details */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-alma-green truncate">{item.name}</h3>
        <p className="text-sm text-alma-charcoal/50 capitalize">
          {itemType === 'program' ? `${item.type} program` : item.category}
        </p>
        <p className="font-bold text-alma-green mt-1">${item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, itemType, quantity - 1)}
          className="w-8 h-8 rounded-full bg-alma-cream-dark text-alma-green font-bold hover:bg-alma-cream transition-colors flex items-center justify-center"
        >
          -
        </button>
        <span className="w-8 text-center font-semibold">{quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, itemType, quantity + 1)}
          className="w-8 h-8 rounded-full bg-alma-cream-dark text-alma-green font-bold hover:bg-alma-cream transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Subtotal & Remove */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-alma-green">${(item.price * quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.id, itemType)}
          className="text-red-400 hover:text-red-600 text-sm mt-1 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
