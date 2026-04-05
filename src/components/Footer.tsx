import { Link } from 'react-router-dom';
import './Footer.css';

const FAMILY_BRANDS = [
  { name: "Erva", url: "https://erva-site-iamderekd.replit.app", external: true },
  { name: "Beantown Greentown", url: "https://beantown-greentown.replit.app", external: true },
  { name: "Legacy Operations", url: "https://legacy-prime-navy.vercel.app", external: true },
  { name: "Eddie's Flowers", url: "/", external: false },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">

          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-mark">E</span>
              <div>
                <div className="footer__logo-name">Eddie's Flowers</div>
                <div className="footer__logo-sub">Ashburnham, MA</div>
              </div>
            </div>
            <p className="footer__tagline">
              Ashburnham's premier cannabis dispensary. Deli-style service,
              premium flower, good vibes.
            </p>
            <div className="footer__social">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/deals">Deals</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Visit */}
          <div className="footer__col">
            <h4 className="footer__heading">Visit Us</h4>
            <address className="footer__address">
              <p>123 Main Street</p>
              <p>Ashburnham, MA 01430</p>
            </address>
            <div className="footer__hours">
              <p><strong>Mon–Sat:</strong> 10am – 8pm</p>
              <p><strong>Sunday:</strong> 11am – 6pm</p>
            </div>
            <a href="tel:+19785550100" className="footer__phone">
              (978) 555-0100
            </a>
          </div>

          {/* Family of Brands */}
          <div className="footer__col">
            <h4 className="footer__heading">Our Family of Brands</h4>
            <ul className="footer__list footer__brands-list">
              {FAMILY_BRANDS.map(brand => (
                <li key={brand.name}>
                  {brand.external ? (
                    <a
                      href={brand.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`footer__brand-link${brand.name === "Eddie's Flowers" ? ' footer__brand-link--active' : ''}`}
                    >
                      {brand.name}
                      {brand.name !== "Eddie's Flowers" && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      )}
                    </a>
                  ) : (
                    <Link to={brand.url} className="footer__brand-link footer__brand-link--active">
                      {brand.name} <span className="footer__brand-you">(You are here)</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <a
              href="https://legacy-prime-navy.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__powered"
            >
              Powered by Legacy Operations
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} Eddie's Flowers. All rights reserved. &nbsp;·&nbsp; Part of the{' '}
            <a href="https://legacy-prime-navy.vercel.app" target="_blank" rel="noopener noreferrer">
              Legacy Operations
            </a>{' '}
            family.
          </p>
          <p className="footer__legal">
            Must be 21+ to purchase. Massachusetts recreational cannabis.
            Please consume responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
