import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import BookGrid from '../components/BookGrid.jsx';
import { books, categories } from '../data/books.js';

export default function HomePage() {
  const featured = books.filter((book) => book.featured);

  return (
    <>
      <Hero />

      <section className="section container">
        <div className="section__header">
          <h2>Featured Books</h2>
          <Link to="/books">View all books</Link>
        </div>
        <BookGrid books={featured} />
      </section>

      <section className="section container">
        <div className="section__header">
          <h2>Shop by Category</h2>
          <Link to="/categories">All categories</Link>
        </div>
        <div className="category-tiles">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/books?category=${encodeURIComponent(category)}`}
              className="category-tile"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
