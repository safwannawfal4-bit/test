import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cartItems, cartSubtotal, discountPercent, discountAmount, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="section-title mb-4">Your Cart is Empty</h1>
        <p className="text-alma-charcoal/60 mb-8">
          Looks like you haven't added any items yet.
        </p>
        <div className="flex gap-4">
          <Link to="/shop" className="btn-primary">Shop Equipment</Link>
          <Link to="/programs" className="btn-outline">Browse Programs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="section-title mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(ci => (
            <CartItem key={`${ci.itemType}-${ci.item.id}`} cartItem={ci} />
          ))}
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 transition-colors mt-2"
          >
            Clear entire cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-semibold text-alma-green mb-6">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-alma-charcoal/70">
              <span>Subtotal ({cartItems.reduce((s, c) => s + c.quantity, 0)} items)</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Member Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-alma-charcoal/70">
              <span>Shipping</span>
              <span className="text-alma-lime font-medium">Free</span>
            </div>
            <div className="border-t border-alma-cream-dark pt-3 flex justify-between font-bold text-lg text-alma-green">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="btn-primary w-full text-center mt-6 block"
          >
            Proceed to Checkout
          </Link>

          {!isAuthenticated && (
            <div className="mt-4 bg-alma-lime/10 rounded-lg p-3 text-center">
              <p className="text-sm text-alma-green font-medium">
                <Link to="/register" className="underline font-bold">Register</Link> to save 20% on your order!
              </p>
              <p className="text-xs text-alma-charcoal/50 mt-1">
                You'd save ${(cartSubtotal * 0.2).toFixed(2)} on this order
              </p>
            </div>
          )}

          <Link
            to="/shop"
            className="block text-center text-sm text-alma-charcoal/50 hover:text-alma-green mt-3 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
