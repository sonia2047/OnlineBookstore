import { categories as allCategories } from '../data/books.js';
import './CategoryFilter.css';

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`category-filter__chip ${value === '' ? 'category-filter__chip--active' : ''}`}
        aria-pressed={value === ''}
        onClick={() => onChange('')}
      >
        All
      </button>
      {allCategories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-filter__chip ${value === category ? 'category-filter__chip--active' : ''}`}
          aria-pressed={value === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
