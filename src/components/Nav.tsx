import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Nav.css';

const LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/deals', label: 'Deals' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change / resize
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" onClick={() => setOpen(false)}>
          <span className="nav__logo-mark">E</span>
          <div className="nav__logo-text">
            <span className="nav__logo-name">Eddie's Flowers</span>
            <span className="nav__logo-sub">Ashburnham, MA</span>
          </div>
        </Link>

        <nav className={`nav__links${open ? ' nav__links--open' : ''}`} aria-label="Main navigation">
          {LINKS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `nav__link${isActive ? ' nav__link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link to="/menu" className="btn btn--primary nav__cta" onClick={() => setOpen(false)}>
            Order Now
          </Link>
        </nav>

        <button
          className={`nav__burger${open ? ' nav__burger--open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && (
        <div className="nav__overlay" aria-hidden="true" onClick={() => setOpen(false)} />
      )}
    </header>
  );
}
