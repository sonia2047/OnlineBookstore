import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">OnlineBookstore</p>
        <p className="footer__copy">
          &copy; {new Date().getFullYear()} OnlineBookstore. Capstone demo project.
        </p>
      </div>
    </footer>
  );
}
