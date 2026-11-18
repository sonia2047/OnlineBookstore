import { Link } from 'react-router-dom';
import { categories, books } from '../data/books.js';

export default function CategoriesPage() {
  return (
    <div className="container section">
      <header className="page-header">
        <h1>Categories</h1>
        <p>Choose a category to browse its books.</p>
      </header>

      <div className="categories-grid">
        {categories.map((category) => {
          const count = books.filter((book) => book.category === category).length;
          return (
            <Link
              key={category}
              to={`/books?category=${encodeURIComponent(category)}`}
              className="category-card"
            >
              <h2>{category}</h2>
              <p>
                {count} {count === 1 ? 'book' : 'books'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
