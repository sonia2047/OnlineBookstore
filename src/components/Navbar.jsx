import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../hooks/useCart.js';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/books', label: 'Books' },
  { to: '/categories', label: 'Categories' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          OnlineBookstore
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <nav
          id="primary-navigation"
          className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}
          aria-label="Primary"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `navbar__link navbar__cart ${isActive ? 'navbar__link--active' : ''}`
            }
            onClick={closeMenu}
          >
            Cart
            <span className="navbar__badge" aria-label={`${totalItems} items in cart`}>
              {totalItems}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
