import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { calculateTotals } from '../utils/cartTotals.js';
import { createOrder } from '../utils/createOrder.js';

export const CartContext = createContext(null);

const CART_KEY = 'bookstore-cart';
const ORDER_KEY = 'bookstore-last-order';

function loadFromStorage(key, fallback, isValid) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return isValid(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

function cartReducer(items, action) {
  switch (action.type) {
    case 'add': {
      const exists = items.some((item) => item.id === action.book.id);
      if (exists) {
        return items.map((item) =>
          item.id === action.book.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      const { id, title, author, price, image } = action.book;
      return [...items, { id, title, author, price, image, quantity: 1 }];
    }
    case 'updateQuantity':
      return items
        .map((item) => (item.id === action.id ? { ...item, quantity: action.quantity } : item))
        .filter((item) => item.quantity > 0);
    case 'remove':
      return items.filter((item) => item.id !== action.id);
    case 'clear':
    case 'placeOrder':
      return [];
    default:
      throw new Error(`Unknown cart action: ${action.type}`);
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, () =>
    loadFromStorage(CART_KEY, [], Array.isArray),
  );
  const [lastOrder, setLastOrder] = useState(() =>
    loadFromStorage(ORDER_KEY, null, (value) => value !== null && typeof value === 'object'),
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const { totalItems, totalPrice } = calculateTotals(items);

    return {
      items,
      totalItems,
      totalPrice,
      lastOrder,
      addToCart: (book) => dispatch({ type: 'add', book }),
      updateQuantity: (id, quantity) => dispatch({ type: 'updateQuantity', id, quantity }),
      removeFromCart: (id) => dispatch({ type: 'remove', id }),
      clearCart: () => dispatch({ type: 'clear' }),
      placeOrder: () => {
        if (items.length === 0) return null;
        const order = createOrder(items);
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
        setLastOrder(order);
        dispatch({ type: 'placeOrder' });
        return order;
      },
    };
  }, [items, lastOrder]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
