# OnlineBookstore

A responsive eCommerce bookstore front end built with **React**, **Vite** and **JavaScript**, with plain **CSS** styling. It was built as an Applied AI Specialist capstone project.

## Features

- Homepage with a hero banner, featured books and category shortcuts
- Navigation: Home, Books, Categories and Cart (with live item count); collapsible menu on mobile
- Book search by title or author, with the query stored in the URL (`/books?q=...`)
- Category filtering (`/books?category=...`) and a dedicated Categories page
- Book cards showing cover, title, author, category and price
- Add to Cart, with quantity steppers, remove, and a running total
- Cart persisted in `localStorage`, so it survives page reloads
- Demo checkout: Cart → Checkout review → Order confirmation with order number and order summary
- "Continue Shopping" button on the confirmation screen
- Responsive layouts for desktop, tablet and mobile
- Unit tests for cart logic, checkout, components, search filtering and the cart page

## Technologies

- [React](https://react.dev/) 19 with hooks, Context and `useReducer`
- [React Router](https://reactrouter.com/) 7 for client-side routing
- [Vite](https://vite.dev/) 8 for the dev server and production build
- Plain CSS with custom properties (design tokens) and media queries
- [Vitest](https://vitest.dev/), React Testing Library and jsdom for testing

## Requirements

- Node.js 22.12+ (required by Vitest 5 and Vite 8)
- npm 10+

Check your versions:

```bash
node -v
npm -v
```

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (http://127.0.0.1:5173)
npm run dev
```

To try the checkout flow: add a book, open the Cart, click **Checkout**, then **Place demo order**.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server on `127.0.0.1:5173` |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Serve the production build on `127.0.0.1:4173` |
| `npm test` | Run the unit test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Testing

```bash
npm test
```

The suite uses **Vitest** with **React Testing Library** and **jsdom**:

| File | Covers |
|---|---|
| `src/test/CartContext.test.jsx` | Add, increment, update, remove, clear, totals, localStorage persistence |
| `src/test/BookCard.test.jsx` | Book details rendering and Add to Cart integration with the navbar badge |
| `src/test/SearchBar.test.jsx` | Search input behavior and the `filterBooks` search/category logic |
| `src/test/CartPage.test.jsx` | Empty state, cart line items, displayed total after quantity changes and removals, Checkout link |
| `src/test/checkout.test.jsx` | `calculateTotals`, `createOrder`, totals after changes, `placeOrder` and order persistence |
| `src/test/Checkout.flow.test.jsx` | End-to-end flow: cart → checkout → confirmation, cart emptied, Continue Shopping, empty states |

Currently 47 tests in 6 files.

## Project structure

```
OnlineBookstore/
├── index.html                 # HTML shell; mounts the React app into #root
├── package.json               # Dependencies and npm scripts
├── vite.config.js             # Vite + React plugin, Vitest config, 127.0.0.1 binding
├── .gitignore
├── README.md
└── src/
    ├── main.jsx               # Entry point: StrictMode, BrowserRouter, CartProvider
    ├── App.jsx                # Layout (Navbar, routed main content, Footer) and route table
    ├── index.css              # Design tokens (CSS variables), base styles, shared utilities, layout breakpoints
    ├── data/
    │   └── books.js           # Sample catalog (12 books, 5 categories) and derived category list
    ├── context/
    │   └── CartContext.jsx    # Cart state via useReducer; localStorage persistence; totals; placeOrder
    ├── hooks/
    │   ├── useCart.js         # Consumes CartContext with an error if used outside the provider
    │   └── useBookSearch.js   # filterBooks() pure function + memoized hook
    ├── utils/
    │   ├── cartTotals.js      # calculateTotals(): item count and total, rounded to cents
    │   ├── createOrder.js     # Builds the demo order snapshot (order number, items, totals)
    │   ├── coverImage.js      # Generates SVG book-cover data URIs (no external images)
    │   └── formatCurrency.js  # USD formatting via Intl.NumberFormat
    ├── components/            # Reusable presentational components (each with its own CSS)
    │   ├── Navbar.jsx/.css        # Navigation, cart badge, mobile toggle menu
    │   ├── Footer.jsx/.css        # Site footer
    │   ├── Hero.jsx/.css          # Homepage banner
    │   ├── SearchBar.jsx/.css     # Controlled search input
    │   ├── CategoryFilter.jsx/.css# Category chips (All + each category)
    │   ├── BookCard.jsx/.css      # One book: cover, title, author, price, Add to Cart
    │   ├── BookGrid.jsx/.css      # Responsive grid of BookCards, or an empty message
    │   ├── CartItem.jsx/.css      # One cart line: quantity stepper, remove, subtotal
    │   └── CartSummary.jsx/.css   # Items count, total, Checkout link, clear cart
    ├── pages/                 # Route-level screens composed from components
    │   ├── HomePage.jsx           # Hero, featured books, category links
    │   ├── BooksPage.jsx          # Search + category filter + grid (state in URL)
    │   ├── CategoriesPage.jsx     # Category cards with book counts
    │   ├── CartPage.jsx           # Cart list + summary, or empty state
    │   ├── CheckoutPage.jsx/.css  # Order review and "Place demo order"
    │   ├── OrderConfirmationPage.jsx/.css # Confirmation message, order summary, Continue Shopping
    │   └── NotFoundPage.jsx       # 404 page
    └── test/                  # Vitest + React Testing Library suites
        ├── setup.js               # Loads jest-dom matchers
        ├── CartContext.test.jsx
        ├── BookCard.test.jsx
        ├── SearchBar.test.jsx
        ├── CartPage.test.jsx
        ├── checkout.test.jsx
        └── Checkout.flow.test.jsx
```

### How the pieces fit together

1. `main.jsx` wraps the app in `BrowserRouter` and `CartProvider`, so every component can read the cart.
2. `App.jsx` renders the shared layout and maps URLs to pages.
3. Pages own data selection (for example, `BooksPage` reads `q` and `category` from the URL). Components receive props and stay reusable.
4. `CartContext` is the single source of truth for the cart. Components call `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart` or `placeOrder` through the `useCart()` hook. Totals are derived from the items, so they always match the cart.
5. Sample data in `data/books.js` is the only data source. To add a book, append an entry with `id`, `title`, `author`, `category`, `price`, `featured` and `color`. The cover is generated automatically.

## Responsive breakpoints

| Breakpoint | Behavior |
|---|---|
| Desktop (> 1024px) | Multi-column book grid, cart and checkout with side summary |
| Tablet (≤ 1024px) | Narrower grid columns, narrower cart and checkout summary |
| Tablet portrait (≤ 768px) | Navbar collapses into a menu, cart and checkout summaries stack below items |
| Mobile (≤ 480px) | Two-column book grid, compact cards and typography, stacked checkout rows, full-width Continue Shopping |

## Notes

- Checkout is a demo only. No payment details are collected and no payment gateway is integrated. Placing an order stores a summary in `localStorage` (`bookstore-last-order`) and empties the cart.
- This is a front-end demo. There is no backend or authentication, and no secrets are required.
- `npm audit` reports advisories in development tooling (`picomatch` via Vite/Vitest). Production dependencies have none (`npm audit --omit=dev`).
- The dev server and preview server bind to `127.0.0.1` only.
