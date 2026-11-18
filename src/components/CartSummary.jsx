import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency.js';
import './CartSummary.css';

const SHIPPING_NOTE = 'Demo store: no shipping, taxes or payment details are collected.';

export default function CartSummary({ totalItems, totalPrice, onClear }) {
  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-heading">
      <h2 id="cart-summary-heading" className="cart-summary__heading">
        Order Summary
      </h2>

      <dl className="cart-summary__rows">
        <div className="cart-summary__row">
          <dt>Items</dt>
          <dd>{totalItems}</dd>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <dt>Total</dt>
          <dd data-testid="cart-total">{formatCurrency(totalPrice)}</dd>
        </div>
      </dl>

      <p className="cart-summary__note">{SHIPPING_NOTE}</p>

      <Link to="/checkout" className="btn btn--primary btn--block">
        Checkout
      </Link>
      <button type="button" className="btn btn--text" onClick={onClear}>
        Clear cart
      </button>
    </aside>
  );
}
