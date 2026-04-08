import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('alma-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alma-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, itemType = 'product') => {
    setCartItems(prev => {
      const existing = prev.find(
        ci => ci.item.id === item.id && ci.itemType === itemType
      );
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id && ci.itemType === itemType
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { item, itemType, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId, itemType) => {
    setCartItems(prev =>
      prev.filter(ci => !(ci.item.id === itemId && ci.itemType === itemType))
    );
  };

  const updateQuantity = (itemId, itemType, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }
    setCartItems(prev =>
      prev.map(ci =>
        ci.item.id === itemId && ci.itemType === itemType
          ? { ...ci, quantity }
          : ci
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  // 20% discount for logged-in customers (not admin)
  const discountPercent = (isAuthenticated && !isAdmin) ? 20 : 0;
  const discountAmount = cartSubtotal * (discountPercent / 100);
  const cartTotal = cartSubtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        discountPercent,
        discountAmount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
