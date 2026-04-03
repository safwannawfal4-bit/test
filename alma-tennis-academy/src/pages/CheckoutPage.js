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
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [mapQuery, setMapQuery] = useState('');
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zip: '', country: '',
  });

  const updateMapFromAddress = () => {
    const q = [address.street, address.city, address.state, address.country].filter(Boolean).join(', ');
    setMapQuery(q);
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);

    try {
      const formData = new FormData(e.target);
      const orderData = {
        userId: user?.uid || null,
        customerEmail: formData.get('email') || user?.email || 'guest@example.com',
        customerName: `${formData.get('firstName') || ''} ${formData.get('lastName') || ''}`.trim() || user?.name || 'Guest',
        customerPhone: formData.get('phone') || user?.phone || '',
        items: cartItems,
        subtotal: cartSubtotal,
        discountAmount,
        total: cartTotal,
        paymentMethod,
        shippingAddress: address,
        mapLocation: mapQuery,
      };

      await placeOrder(orderData);

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
          try {
            await updateDoc(doc(db, 'programs', ci.item.id), {
              spotsAvailable: increment(-ci.quantity),
            });
          } catch (err) {
            console.error('Error updating spots:', err);
          }
        }
      }

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
      alert('Failed to place order: ' + err.message);
    }
    setPlacing(false);
  };

  if (orderPlaced) {
    return (
      <div className="pt-24 pb-16 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="section-title mb-4">Order Confirmed!</h1>
        <p className="text-alma-charcoal/60 mb-2 max-w-md">
          Thank you for your order!
          {paymentMethod === 'cod'
            ? ' Please have the payment ready when your order arrives.'
            : ' Your payment has been processed.'}
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

  const mapEmbedUrl = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : '';

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
          {/* Contact */}
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

          {/* Shipping Address + Map */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Street Address" value={address.street}
                onChange={e => handleAddressChange('street', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all md:col-span-2" />
              <input required type="text" placeholder="City" value={address.city}
                onChange={e => handleAddressChange('city', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input required type="text" placeholder="State / Province" value={address.state}
                onChange={e => handleAddressChange('state', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input required type="text" placeholder="ZIP / Postal Code" value={address.zip}
                onChange={e => handleAddressChange('zip', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
              <input required type="text" placeholder="Country" value={address.country}
                onChange={e => handleAddressChange('country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-alma-cream-dark focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none transition-all" />
            </div>

            {/* Show on Map button */}
            <button
              type="button"
              onClick={updateMapFromAddress}
              className="mt-4 text-sm font-medium text-alma-green hover:text-alma-green-light transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Show on Map
            </button>

            {/* Google Maps Embed */}
            {mapEmbedUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-alma-cream-dark">
                <iframe
                  title="Delivery Location"
                  src={mapEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-alma-green mb-4">Payment Method</h2>

            <div className="space-y-3 mb-6">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-alma-lime bg-alma-lime/5'
                    : 'border-gray-200 hover:border-alma-cream-dark'
                }`}
              >
                <input type="radio" name="paymentMethod" value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-4 h-4 text-alma-green" />
                <div className="flex items-center gap-3 flex-grow">
                  <span className="text-xl">💳</span>
                  <div>
                    <p className="font-semibold text-alma-green text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-alma-charcoal/50">Pay securely with your card</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-alma-lime bg-alma-lime/5'
                    : 'border-gray-200 hover:border-alma-cream-dark'
                }`}
              >
                <input type="radio" name="paymentMethod" value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-4 h-4 text-alma-green" />
                <div className="flex items-center gap-3 flex-grow">
                  <span className="text-xl">💵</span>
                  <div>
                    <p className="font-semibold text-alma-green text-sm">Cash on Delivery</p>
                    <p className="text-xs text-alma-charcoal/50">Pay when your order arrives at your door</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Card fields (only show if card selected) */}
            {paymentMethod === 'card' && (
              <div>
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
            )}

            {paymentMethod === 'cod' && (
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📋</span>
                  <div className="text-sm">
                    <p className="font-semibold text-amber-800 mb-1">Cash on Delivery Notes:</p>
                    <ul className="text-amber-700 space-y-1">
                      <li>Please have the exact amount of <strong>${cartTotal.toFixed(2)}</strong> ready</li>
                      <li>Our delivery person will collect payment at your door</li>
                      <li>You'll receive an SMS/email with delivery tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={placing} className="btn-primary w-full text-lg py-4 disabled:opacity-50">
            {placing ? 'Placing Order...' : paymentMethod === 'cod'
              ? `Place Order (Cash on Delivery) - $${cartTotal.toFixed(2)}`
              : `Place Order - $${cartTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
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
            <div className="flex justify-between text-sm text-alma-charcoal/70">
              <span>Shipping</span><span className="text-alma-lime font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm text-alma-charcoal/70">
              <span>Payment</span>
              <span className="font-medium">{paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Card'}</span>
            </div>
            <div className="flex justify-between font-bold text-alma-green pt-2 border-t border-alma-cream-dark">
              <span>Total</span><span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
