import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, discountPercent, discountAmount, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { placeOrder } = useOrders();
  const { createEnrollment } = useEnrollments();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    const formData = new FormData(e.target);

    try {
      const orderData = {
        userId: user?.uid || null,
        customerEmail: formData.get('email') || user?.email || 'guest@example.com',
        customerName: `${formData.get('firstName') || ''} ${formData.get('lastName') || ''}`.trim() || user?.name || 'Guest',
        customerPhone: formData.get('phone') || user?.phone || '',
        items: cartItems,
        subtotal: cartSubtotal,
        discountAmount,
        total: cartTotal,
        shippingAddress: {
          street: formData.get('street') || '',
          city: formData.get('city') || '',
          state: formData.get('state') || '',
          zip: formData.get('zip') || '',
          country: formData.get('country') || '',
        },
      };

      await placeOrder(orderData);

      // Create enrollments for programs and update spots
      for (const ci of cartItems) {
        if (ci.itemType === 'program' && user?.uid) {
          await createEnrollment({
            userId: user.uid,
            userName: user.name,
            userEmail: user.email,
            programId: ci.item.id,
            programName: ci.item.name,
            programType: ci.item.type,
          });
          // Decrement spots
          try {
            await updateDoc(doc(db, 'programs', ci.item.id), {
              spotsAvailable: increment(-ci.quantity),
            });
          } catch (err) {
            console.error('Error updating spots:', err);
          }
        }
      }

      // Update user stats
      if (user?.uid) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            totalSpent: increment(cartTotal),
            orderCount: increment(1),
          });
        } catch (err) {
          console.error('Error updating user stats:', err);
        }
      }

      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error('Order error:', err);
    }
    setPlacing(false);
  };

  if (orderPlaced) {
    return (
      <div className="pt-24 pb-16 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="section-title mb-4">Order Confirmed!</h1>
        <p className="text-alma-charcoal/60 mb-2 max-w-md">
          Thank you for your order! You'll receive a confirmation email shortly.
        </p>
        {discountPercent > 0 && (
          <p className="text-green-600 font-medium mb-4">You saved ${discountAmount.toFixed(2)} with your member discount!</p>
        )}
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

      {!isAuthenticated && (
        <div className="bg-alma-lime/10 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-alma-green">
            <Link to="/register" className="font-bold underline">Register</Link> or <Link to="/login" className="font-bold underline">login</Link> to get 20% off!
          </p>
          <span className="text-sm text-alma-charcoal/50">Save ${(cartSubtotal * 0.2).toFixed(2)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" required type="text" placeholder="First Name" defaultValue={user?.name?.split(' ')[0] || ''}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input name="lastName" required type="text" placeholder="Last Name" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input name="email" required type="email" placeholder="Email Address" defaultValue={user?.email || ''}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2" />
              <input name="phone" type="tel" placeholder="Phone Number" defaultValue={user?.phone || ''}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="street" required type="text" placeholder="Street Address"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2" />
              <input name="city" required type="text" placeholder="City"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input name="state" required type="text" placeholder="State / Province"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input name="zip" required type="text" placeholder="ZIP / Postal Code"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input name="country" required type="text" placeholder="Country"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-2">Payment</h2>
            <p className="text-sm text-alma-charcoal/50 mb-4">Demo store - no real payment processed.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2" />
              <input type="text" placeholder="MM/YY" defaultValue="12/28"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input type="text" placeholder="CVC" defaultValue="123"
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
            </div>
          </div>

          <button type="submit" disabled={placing} className="btn-primary w-full text-lg py-4 disabled:opacity-50">
            {placing ? 'Placing Order...' : `Place Order - $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-alma-green mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map(ci => (
              <div key={`${ci.itemType}-${ci.item.id}`} className="flex justify-between text-sm">
                <span className="text-alma-charcoal/70">{ci.item.name} x{ci.quantity}</span>
                <span className="font-medium">${(ci.item.price * ci.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-alma-cream-dark mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-alma-charcoal/70">
              <span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Member Discount ({discountPercent}%)</span><span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-alma-green pt-2 border-t border-alma-cream-dark">
              <span>Total</span><span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
