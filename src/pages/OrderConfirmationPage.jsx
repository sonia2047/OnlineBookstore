import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './CheckoutPage.css';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <div className="container section empty-cart">
        <h1>No recent order</h1>
        <p>There is no order to confirm. Browse books to start a new order.</p>
        <Link to="/books" className="btn btn--primary">
          Browse Books
        </Link>
      </div>
    );
  }

  const placedAt = new Date(lastOrder.placedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="container section">
      <section className="confirmation" aria-labelledby="confirmation-heading">
        <p className="confirmation__badge" aria-hidden="true">
          ✓
        </p>
        <h1 id="confirmation-heading">Thank you for your order!</h1>
        <p className="confirmation__message">
          Your demo order has been placed. No payment was taken.
        </p>
        <dl className="confirmation__meta">
          <div>
            <dt>Order number</dt>
            <dd data-testid="order-number">{lastOrder.orderNumber}</dd>
          </div>
          <div>
            <dt>Placed</dt>
            <dd>{placedAt}</dd>
          </div>
        </dl>
      </section>

      <section className="checkout-panel confirmation__summary" aria-labelledby="order-summary-heading">
        <h2 id="order-summary-heading" className="checkout-panel__heading">
          Order summary
        </h2>
        <ul className="checkout-items">
          {lastOrder.items.map((item) => (
            <li key={item.id} className="checkout-item">
              <span className="checkout-item__title">{item.title}</span>
              <span className="checkout-item__qty">× {item.quantity}</span>
              <span className="checkout-item__subtotal">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="confirmation__total">
          <span>
            Total ({lastOrder.totalItems} {lastOrder.totalItems === 1 ? 'item' : 'items'})
          </span>
          <strong data-testid="order-total">{formatCurrency(lastOrder.totalPrice)}</strong>
        </div>
      </section>

      <div className="confirmation__actions">
        <Link to="/books" className="btn btn--primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
