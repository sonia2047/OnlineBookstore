import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search by title or author' }) {
  return (
    <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="book-search" className="visually-hidden">
        Search books
      </label>
      <input
        id="book-search"
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  );
}
