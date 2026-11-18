import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import { filterBooks } from '../hooks/useBookSearch.js';
import { books } from '../data/books.js';

function ControlledSearch() {
  const [value, setValue] = useState('');
  return <SearchBar value={value} onChange={setValue} />;
}

describe('SearchBar', () => {
  it('renders an accessible search input', () => {
    render(<ControlledSearch />);
    expect(screen.getByRole('searchbox', { name: 'Search books' })).toBeInTheDocument();
  });

  it('updates its value as the user types', async () => {
    const user = userEvent.setup();
    render(<ControlledSearch />);
    const input = screen.getByRole('searchbox', { name: 'Search books' });
    await user.type(input, 'stars');
    expect(input).toHaveValue('stars');
  });
});

describe('filterBooks', () => {
  it('returns all books when query and category are empty', () => {
    expect(filterBooks(books)).toHaveLength(books.length);
  });

  it('matches titles case-insensitively', () => {
    const results = filterBooks(books, { query: 'STARS' });
    expect(results.map((b) => b.title)).toEqual(['A Field Guide to Stars']);
  });

  it('matches authors', () => {
    const results = filterBooks(books, { query: 'okafor' });
    expect(results).toHaveLength(1);
    expect(results[0].author).toBe('Daniel Okafor');
  });

  it('filters by category', () => {
    const results = filterBooks(books, { category: 'Science' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((b) => b.category === 'Science')).toBe(true);
  });

  it('combines query and category filters', () => {
    const results = filterBooks(books, { query: 'the', category: 'Fiction' });
    expect(results.every((b) => b.category === 'Fiction')).toBe(true);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterBooks(books, { query: 'zzz-no-match' })).toEqual([]);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(filterBooks(books, { query: '   stars  ' })).toHaveLength(1);
  });
});
