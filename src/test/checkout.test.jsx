import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider } from '../context/CartContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { calculateTotals } from '../utils/cartTotals.js';
import { createOrder } from '../utils/createOrder.js';
import { books } from '../data/books.js';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const [book1, book2] = books;

describe('calculateTotals', () => {
  it('returns zero for an empty cart', () => {
    expect(calculateTotals([])).toEqual({ totalItems: 0, totalPrice: 0 });
  });

  it('sums quantities and prices', () => {
    const items = [
      { id: 1, price: 10, quantity: 2 },
      { id: 2, price: 5.5, quantity: 3 },
    ];
    expect(calculateTotals(items)).toEqual({ totalItems: 5, totalPrice: 36.5 });
  });

  it('rounds to cents to avoid floating-point drift', () => {
    const items = [
      { id: 1, price: 0.1, quantity: 3 },
      { id: 2, price: 0.2, quantity: 1 },
    ];
    expect(calculateTotals(items).totalPrice).toBe(0.5);
  });
});

describe('createOrder', () => {
  const items = [
    { id: 1, title: 'A', author: 'X', price: 10, image: 'data:image/svg+xml,...', quantity: 2 },
  ];

  it('builds a snapshot with totals and an order number', () => {
    const order = createOrder(items, new Date('2026-01-01T10:00:00Z'));
    expect(order.orderNumber).toMatch(/^OB-[0-9A-Z]+$/);
    expect(order.placedAt).toBe('2026-01-01T10:00:00.000Z');
    expect(order.totalItems).toBe(2);
    expect(order.totalPrice).toBe(20);
  });

  it('omits cover images from the stored line items', () => {
    const order = createOrder(items);
    expect(order.items[0]).not.toHaveProperty('image');
    expect(order.items[0]).toMatchObject({ id: 1, title: 'A', quantity: 2 });
  });
});

describe('CartContext totals after changes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updates the total when a quantity increases', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.updateQuantity(book1.id, 3));

    expect(result.current.totalItems).toBe(3);
    expect(result.current.totalPrice).toBe(Math.round(book1.price * 3 * 100) / 100);
  });

  it('updates the total when a quantity decreases', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book2));
    act(() => result.current.updateQuantity(book2.id, 1));
    act(() => result.current.updateQuantity(book1.id, 0));

    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(book2.price);
  });

  it('removes the book from the total when it is removed from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book2));
    act(() => result.current.removeFromCart(book1.id));

    expect(result.current.totalPrice).toBe(book2.price);
  });
});

describe('CartContext.placeOrder', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null and does not create an order when the cart is empty', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    let order;
    act(() => {
      order = result.current.placeOrder();
    });
    expect(order).toBeNull();
    expect(result.current.lastOrder).toBeNull();
  });

  it('creates an order from the cart, stores it, and empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book2));

    const expectedTotal = Math.round((book1.price * 2 + book2.price) * 100) / 100;

    act(() => {
      result.current.placeOrder();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.lastOrder.totalItems).toBe(3);
    expect(result.current.lastOrder.totalPrice).toBe(expectedTotal);
    expect(result.current.lastOrder.items.map((i) => i.id)).toEqual([book1.id, book2.id]);
  });

  it('persists the last order to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => {
      result.current.placeOrder();
    });

    const saved = JSON.parse(localStorage.getItem('bookstore-last-order'));
    expect(saved.orderNumber).toBe(result.current.lastOrder.orderNumber);
  });

  it('restores the last order from localStorage on mount', () => {
    localStorage.setItem(
      'bookstore-last-order',
      JSON.stringify({
        orderNumber: 'OB-TEST',
        placedAt: '2026-01-01T00:00:00.000Z',
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }),
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.lastOrder.orderNumber).toBe('OB-TEST');
  });
});
