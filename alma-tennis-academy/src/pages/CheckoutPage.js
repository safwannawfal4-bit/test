import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="pt-24 pb-16 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="section-title mb-4">Order Placed!</h1>
        <p className="text-alma-charcoal/60 mb-2 max-w-md">
          Thank you for your order! This is a demo, so no real payment was processed.
        </p>
        <p className="text-sm text-alma-charcoal/40 mb-8">
          In a real store, you would receive a confirmation email.
        </p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 pb-16 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="section-title mb-4">Nothing to Checkout</h1>
        <Link to="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
              <input
                required
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2"
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Street Address"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2"
              />
              <input
                required
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
              <input
                required
                type="text"
                placeholder="State / Province"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
              <input
                required
                type="text"
                placeholder="ZIP / Postal Code"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
              <input
                required
                type="text"
                placeholder="Country"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Payment (Demo) */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-2">Payment</h2>
            <p className="text-sm text-alma-charcoal/50 mb-4">
              This is a demo store. No real payment will be processed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Card Number"
                defaultValue="4242 4242 4242 4242"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2"
              />
              <input
                type="text"
                placeholder="MM/YY"
                defaultValue="12/28"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
              <input
                type="text"
                placeholder="CVC"
                defaultValue="123"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full text-lg py-4">
            Place Order - ${cartTotal.toFixed(2)}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map(ci => (
              <div key={`${ci.itemType}-${ci.item.id}`} className="flex justify-between text-sm">
                <span className="text-alma-charcoal/70">
                  {ci.item.name} x{ci.quantity}
                </span>
                <span className="font-medium">${(ci.item.price * ci.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-alma-cream-dark mt-4 pt-4 flex justify-between font-bold text-alma-green">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
