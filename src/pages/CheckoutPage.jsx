import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, placeOrder } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container section empty-cart">
        <h1>Nothing to check out</h1>
        <p>Your cart is empty. Add a book before checking out.</p>
        <Link to="/books" className="btn btn--primary">
          Browse Books
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    placeOrder();
    navigate('/order-confirmation');
  };

  return (
    <div className="container section">
      <header className="page-header">
        <h1>Checkout</h1>
        <p>Review your order. This is a demo, so no payment details are collected.</p>
      </header>

      <div className="checkout-layout">
        <section className="checkout-panel" aria-labelledby="checkout-items-heading">
          <h2 id="checkout-items-heading" className="checkout-panel__heading">
            Items in your order
          </h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id} className="checkout-item">
                <span className="checkout-item__title">{item.title}</span>
                <span className="checkout-item__qty">× {item.quantity}</span>
                <span className="checkout-item__subtotal">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="checkout-panel" aria-labelledby="checkout-total-heading">
          <h2 id="checkout-total-heading" className="checkout-panel__heading">
            Total
          </h2>
          <p className="checkout-total__count">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
          <p className="checkout-total__amount" data-testid="checkout-total">
            {formatCurrency(totalPrice)}
          </p>
          <button type="button" className="btn btn--primary btn--block" onClick={handlePlaceOrder}>
            Place demo order
          </button>
          <Link to="/cart" className="btn btn--secondary btn--block checkout-back">
            Back to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
