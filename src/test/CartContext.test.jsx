import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider } from '../context/CartContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { books } from '../data/books.js';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const [book1, book2] = books;

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('adds a new book with quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('increments quantity when the same book is added again', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('calculates the total price across items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book2));
    const expected = Math.round((book1.price * 2 + book2.price) * 100) / 100;
    expect(result.current.totalPrice).toBe(expected);
  });

  it('updates quantity and removes the item when quantity reaches 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.updateQuantity(book1.id, 4));
    expect(result.current.items[0].quantity).toBe(4);

    act(() => result.current.updateQuantity(book1.id, 0));
    expect(result.current.items).toEqual([]);
  });

  it('removes an item and clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    act(() => result.current.addToCart(book2));

    act(() => result.current.removeFromCart(book1.id));
    expect(result.current.items.map((item) => item.id)).toEqual([book2.id]);

    act(() => result.current.clearCart());
    expect(result.current.items).toEqual([]);
  });

  it('persists the cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addToCart(book1));
    const saved = JSON.parse(localStorage.getItem('bookstore-cart'));
    expect(saved[0].id).toBe(book1.id);
  });

  it('restores the cart from localStorage on mount', () => {
    localStorage.setItem(
      'bookstore-cart',
      JSON.stringify([{ id: book1.id, title: book1.title, author: book1.author, price: book1.price, image: book1.image, quantity: 3 }]),
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.totalItems).toBe(3);
  });

  it('ignores corrupted localStorage data', () => {
    localStorage.setItem('bookstore-cart', '{not valid json');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
  });

  it('throws when used outside CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
  });
});
