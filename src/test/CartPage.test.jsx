import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import CartPage from '../pages/CartPage.jsx';
import BookCard from '../components/BookCard.jsx';
import { books } from '../data/books.js';

const [book1, book2] = books;
const round2 = (n) => Math.round(n * 100) / 100;
const usd = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function renderCart() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <BookCard book={book1} />
        <BookCard book={book2} />
        <CartPage />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows an empty state when no books were added', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CartPage />
        </CartProvider>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument();
  });

  it('lists added books with quantities and the grand total', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Add ${book2.title} to cart` }));

    const list = screen.getByRole('list', { name: 'Cart items' });
    expect(list).toHaveTextContent(book1.title);
    expect(list).toHaveTextContent(book2.title);

    const expected = Math.round((book1.price * 2 + book2.price) * 100) / 100;
    const expectedText = expected.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    expect(screen.getByTestId('cart-total')).toHaveTextContent(expectedText);
  });

  it('increases and decreases quantity with the stepper controls', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Increase quantity of ${book1.title}` }));
    expect(screen.getByRole('group', { name: `Quantity for ${book1.title}` })).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: `Decrease quantity of ${book1.title}` }));
    expect(screen.getByRole('group', { name: `Quantity for ${book1.title}` })).toHaveTextContent('1');
  });

  it('updates the displayed total when quantities change', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    expect(screen.getByTestId('cart-total')).toHaveTextContent(usd(book1.price));

    await user.click(screen.getByRole('button', { name: `Increase quantity of ${book1.title}` }));
    await user.click(screen.getByRole('button', { name: `Increase quantity of ${book1.title}` }));
    expect(screen.getByTestId('cart-total')).toHaveTextContent(usd(round2(book1.price * 3)));

    await user.click(screen.getByRole('button', { name: `Decrease quantity of ${book1.title}` }));
    expect(screen.getByTestId('cart-total')).toHaveTextContent(usd(round2(book1.price * 2)));
  });

  it('updates the displayed total when one of several books is removed', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Add ${book2.title} to cart` }));
    expect(screen.getByTestId('cart-total')).toHaveTextContent(usd(round2(book1.price + book2.price)));

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    expect(screen.getByTestId('cart-total')).toHaveTextContent(usd(book2.price));
    expect(screen.queryByRole('group', { name: `Quantity for ${book1.title}` })).not.toBeInTheDocument();
  });

  it('removes the item when quantity is decreased to zero', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: `Decrease quantity of ${book1.title}` }));

    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument();
  });

  it('links the Checkout button to the checkout page', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    expect(screen.getByRole('link', { name: 'Checkout' })).toHaveAttribute('href', '/checkout');
  });

  it('removes an item when Remove is clicked', async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole('button', { name: `Add ${book1.title} to cart` }));
    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument();
  });
});
