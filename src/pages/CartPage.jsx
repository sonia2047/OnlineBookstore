import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import CartSummary from '../components/CartSummary.jsx';
import { useCart } from '../hooks/useCart.js';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container section empty-cart">
        <h1>Your cart is empty</h1>
        <p>Looks like you have not added any books yet.</p>
        <Link to="/books" className="btn btn--primary">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <header className="page-header">
        <h1>Shopping Cart</h1>
        <p>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </header>

      <div className="cart-layout">
        <ul className="cart-list" aria-label="Cart items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </ul>

        <CartSummary totalItems={totalItems} totalPrice={totalPrice} onClear={clearCart} />
      </div>
    </div>
  );
}
