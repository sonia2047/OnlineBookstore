import { useMemo } from 'react';
import { books } from '../data/books.js';

/**
 * Filters books by a free-text query (title or author) and an optional category.
 * An empty category means "all categories".
 */
export function filterBooks(list, { query = '', category = '' } = {}) {
  const term = query.trim().toLowerCase();

  return list.filter((book) => {
    const matchesCategory = !category || book.category === category;
    const matchesQuery =
      !term ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term);

    return matchesCategory && matchesQuery;
  });
}

export function useBookSearch({ query, category }) {
  return useMemo(() => filterBooks(books, { query, category }), [query, category]);
}
