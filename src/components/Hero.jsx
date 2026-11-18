import { Link } from 'react-router-dom';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Welcome to OnlineBookstore</p>
        <h1 className="hero__title">Find your next great read</h1>
        <p className="hero__text">
          Browse fiction, science, technology, history and self-help. Pick a favorite, add it to
          your cart, and check out in seconds.
        </p>
        <div className="hero__actions">
          <Link to="/books" className="btn btn--primary">
            Browse Books
          </Link>
          <Link to="/categories" className="btn btn--secondary">
            Explore Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
