import { useCart } from '../hooks/useCart.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './BookCard.css';

export default function BookCard({ book }) {
  const { addToCart } = useCart();

  return (
    <article className="book-card">
      <div className="book-card__image-wrapper">
        <img className="book-card__image" src={book.image} alt={`Cover of ${book.title}`} loading="lazy" />
      </div>
      <div className="book-card__body">
        <p className="book-card__category">{book.category}</p>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">by {book.author}</p>
        <div className="book-card__footer">
          <span className="book-card__price">{formatCurrency(book.price)}</span>
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={() => addToCart(book)}
            aria-label={`Add ${book.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
