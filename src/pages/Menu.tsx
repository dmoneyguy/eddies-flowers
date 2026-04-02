import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import RevealText from '../components/RevealText';
import './Menu.css';

const CATEGORIES = ['All', 'Flower', 'Concentrates', 'Edibles', 'Pre-Rolls', 'Vapes'];

export default function Menu() {
  const [activeTab, setActiveTab] = useState('All');
  const { ref, inView } = useInView();

  return (
    <main className="page-menu">
      <section className="menu__hero">
        <div className="menu__hero-bg" aria-hidden="true" />
        <div className="container menu__hero-inner">
          <span className="section-tag" style={{ color: '#8fd458' }}>SWEED-Powered Menu</span>
          <RevealText as="h1" className="menu__hero-title">
            Today's Menu
          </RevealText>
          <p className="menu__hero-sub">
            Our full product catalog, updated daily. Powered by SWEED POS.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Tabs */}
          <div className="menu__tabs" role="tablist" aria-label="Product categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeTab === cat}
                className={`menu__tab${activeTab === cat ? ' menu__tab--active' : ''}`}
                onClick={() => setActiveTab(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SWEED Embed Area */}
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`menu__embed-wrap fade-section${inView ? ' fade-section--visible' : ''}`}
          >
            <div className="menu__embed-header">
              <div className="menu__sweed-badge">
                <span className="menu__sweed-dot" />
                Live Menu — Powered by SWEED POS
              </div>
              <p className="menu__embed-note">
                Inventory updates in real time. Last synced: just now.
              </p>
            </div>

            {/* SWEED Menu Embed: Replace src with your SWEED dispensary menu URL */}
            {/* <!-- SWEED Menu Embed: Replace src with your SWEED dispensary menu URL --> */}
            <div className="menu__embed-placeholder">
              <div className="menu__embed-placeholder-inner">
                <div className="menu__sweed-logo">🌿 SWEED</div>
                <h3>Online Menu Coming Soon</h3>
                <p>
                  Our SWEED online menu embed will appear here once configured.
                  In the meantime, visit us in-store or call ahead.
                </p>
                <div className="menu__embed-ctas">
                  <a href="tel:+19785550100" className="btn btn--primary">
                    📞 Call to Check Inventory
                  </a>
                  <a href="/contact" className="btn btn--outline">
                    Get Directions
                  </a>
                </div>
                <p className="menu__sweed-info">
                  Powered by{' '}
                  <a
                    href="https://www.sweedpos.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SWEED POS
                  </a>
                  {' '}— The #1 cannabis retail platform.
                </p>
              </div>
            </div>
          </div>

          {/* Info section */}
          <div className="menu__info-grid">
            <div className="menu__info-card">
              <span className="menu__info-icon">🌿</span>
              <h4>Fresh Daily</h4>
              <p>Our flower selection changes regularly as we bring in new cultivars and seasonal harvests.</p>
            </div>
            <div className="menu__info-card">
              <span className="menu__info-icon">⚖️</span>
              <h4>Weighed Fresh</h4>
              <p>Flower is weighed and packaged in front of you at the counter. Deli-style, every time.</p>
            </div>
            <div className="menu__info-card">
              <span className="menu__info-icon">💬</span>
              <h4>Ask Us Anything</h4>
              <p>Not sure what to get? Our budtenders are here to help. Just ask — no judgment, no rush.</p>
            </div>
            <div className="menu__info-card">
              <span className="menu__info-icon">🔞</span>
              <h4>21+ Required</h4>
              <p>Valid ID required at the door. Must be 21 or older to purchase in Massachusetts.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
