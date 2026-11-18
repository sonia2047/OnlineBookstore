import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import BookCard from '../components/BookCard.jsx';
import Navbar from '../components/Navbar.jsx';
import { books } from '../data/books.js';

const book = books[0];

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>,
  );
}

describe('BookCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('displays the title, author, category and formatted price', () => {
    renderWithProviders(<BookCard book={book} />);
    expect(screen.getByRole('heading', { name: book.title })).toBeInTheDocument();
    expect(screen.getByText(`by ${book.author}`)).toBeInTheDocument();
    expect(screen.getByText(book.category)).toBeInTheDocument();
    expect(screen.getByText('$14.99')).toBeInTheDocument();
  });

  it('renders the cover image with alt text', () => {
    renderWithProviders(<BookCard book={book} />);
    expect(screen.getByAltText(`Cover of ${book.title}`)).toHaveAttribute('src', book.image);
  });

  it('adds the book to the cart when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <BookCard book={book} />
        <Navbar />
      </>,
    );

    await user.click(screen.getByRole('button', { name: `Add ${book.title} to cart` }));

    const badge = screen.getByLabelText('1 items in cart');
    expect(badge).toHaveTextContent('1');
  });
});
