import { useCart } from '../hooks/useCart.js';
import { formatCurrency } from '../utils/formatCurrency.js';
import './CartItem.css';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <li className="cart-item">
      <img className="cart-item__image" src={item.image} alt={`Cover of ${item.title}`} />

      <div className="cart-item__details">
        <h3 className="cart-item__title">{item.title}</h3>
        <p className="cart-item__author">by {item.author}</p>
        <p className="cart-item__unit-price">{formatCurrency(item.price)} each</p>

        <div className="cart-item__controls">
          <div className="quantity" role="group" aria-label={`Quantity for ${item.title}`}>
            <button
              type="button"
              className="quantity__btn"
              aria-label={`Decrease quantity of ${item.title}`}
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              −
            </button>
            <span className="quantity__value" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              className="quantity__btn"
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-item__remove"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      </div>

      <p className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</p>
    </li>
  );
}
