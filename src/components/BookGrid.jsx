import BookCard from './BookCard.jsx';
import './BookGrid.css';

export default function BookGrid({ books, emptyMessage = 'No books found.' }) {
  if (books.length === 0) {
    return <p className="book-grid__empty">{emptyMessage}</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
