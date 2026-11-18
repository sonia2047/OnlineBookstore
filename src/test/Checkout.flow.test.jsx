import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import BookCard from '../components/BookCard.jsx';
import Navbar from '../components/Navbar.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import OrderConfirmationPage from '../pages/OrderConfirmationPage.jsx';
import { books } from '../data/books.js';

const [book1, book2] = books;
const usd = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/**
 * Renders one app tree (single CartProvider) so the cart state carries across
 * routes, exactly as in the real application.
 */
function renderShop(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <BookCard book={book1} />
                <BookCard book={book2} />
              </>
            }
          />
          <Route path="/books" element={<h1>Catalog page</h1>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('Checkout flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('carries the cart through cart, checkout and confirmation', async () => {
    const user = userEvent.setup();
    renderShop('/');

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Add ${book2.title} to cart` }));

    await user.click(screen.getByRole('link', { name: /Cart/ }));
    expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Checkout' }));
    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument();

    const expected = Math.round((book1.price * 2 + book2.price) * 100) / 100;
    expect(screen.getByTestId('checkout-total')).toHaveTextContent(usd(expected));

    await user.click(screen.getByRole('button', { name: 'Place demo order' }));

    expect(screen.getByRole('heading', { name: 'Thank you for your order!' })).toBeInTheDocument();
    expect(screen.getByText(/No payment was taken\./)).toBeInTheDocument();
    expect(screen.getByTestId('order-number').textContent).toMatch(/^OB-/);
    expect(screen.getByRole('heading', { name: 'Order summary' })).toBeInTheDocument();
    expect(screen.getByTestId('order-total')).toHaveTextContent(usd(expected));
    expect(screen.getByText(`× 2`)).toBeInTheDocument();
  });

  it('empties the cart after the order is placed', async () => {
    const user = userEvent.setup();
    renderShop('/');
    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('link', { name: /Cart/ }));
    await user.click(screen.getByRole('link', { name: 'Checkout' }));
    await user.click(screen.getByRole('button', { name: 'Place demo order' }));

    expect(screen.getByRole('link', { name: /Cart/ })).toHaveTextContent(/^Cart0$/);
    expect(JSON.parse(localStorage.getItem('bookstore-cart'))).toEqual([]);
  });

  it('returns to the catalog when Continue Shopping is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      'bookstore-last-order',
      JSON.stringify({
        orderNumber: 'OB-TEST',
        placedAt: '2026-01-01T00:00:00.000Z',
        items: [{ id: 1, title: 'A', author: 'X', price: 10, quantity: 1 }],
        totalItems: 1,
        totalPrice: 10,
      }),
    );
    renderShop('/order-confirmation');

    await user.click(screen.getByRole('link', { name: 'Continue Shopping' }));

    expect(screen.getByRole('heading', { name: 'Catalog page' })).toBeInTheDocument();
  });

  it('shows an empty-state message on checkout when the cart is empty', () => {
    renderShop('/checkout');
    expect(screen.getByRole('heading', { name: 'Nothing to check out' })).toBeInTheDocument();
  });

  it('shows a fallback on the confirmation page when there is no recent order', () => {
    renderShop('/order-confirmation');
    expect(screen.getByRole('heading', { name: 'No recent order' })).toBeInTheDocument();
  });
});
