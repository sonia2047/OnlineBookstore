import { useSearchParams } from 'react-router-dom';
import BookGrid from '../components/BookGrid.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useBookSearch } from '../hooks/useBookSearch.js';

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  const results = useBookSearch({ query, category });

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="container section">
      <header className="page-header">
        <h1>Books</h1>
        <p>
          {results.length} {results.length === 1 ? 'book' : 'books'} available
        </p>
      </header>

      <div className="books-toolbar">
        <SearchBar value={query} onChange={(value) => updateParam('q', value)} />
        <CategoryFilter value={category} onChange={(value) => updateParam('category', value)} />
      </div>

      <BookGrid books={results} emptyMessage="No books match your search. Try another title, author or category." />
    </div>
  );
}
