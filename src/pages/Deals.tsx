import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import './Deals.css';

const DAILY_DEALS = [
  { day: 'Monday', label: 'Mellow Monday', desc: '20% off all tinctures & capsules', icon: '🧘', badge: 'Every Week' },
  { day: 'Tuesday', label: 'Terp Tuesday', desc: 'Dollar off every gram of top-shelf flower', icon: '🌸', badge: 'Weekly' },
  { day: 'Wednesday', label: 'Wax Wednesday', desc: '15% off concentrates — live rosin, wax, shatter', icon: '💎', badge: 'Weekly' },
  { day: 'Thursday', label: 'Throwback Thursday', desc: '10% off select classics — ask your budtender', icon: '⭐', badge: 'Weekly' },
  { day: 'Friday', label: 'Feel-Good Friday', desc: '2 for $25 pre-rolls all day', icon: '🔥', badge: 'Weekly' },
  { day: 'Weekend', label: 'Weekend Special', desc: 'Rotating weekend deals — follow us on IG', icon: '🎉', badge: 'Rotating' },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`deals-fadein${inView ? ' deals-fadein--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Deals() {
  return (
    <main className="page-deals">

      {/* Hero */}
      <section className="deals__hero">
        <div className="deals__hero-bg" aria-hidden="true" />
        <div className="container deals__hero-inner">
          <span className="section-tag" style={{ color: '#FFD00F' }}>Save More</span>
          <RevealText as="h1" className="deals__hero-title">
            Deals & Specials
          </RevealText>
          <p className="deals__hero-sub">
            From first-time discounts to weekly specials — there's always a reason
            to visit Eddie's Flowers.
          </p>
        </div>
      </section>

      {/* First-Time Customer */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="deals__first-time">
              <div className="deals__first-time-badge">🎁 First-Time Offer</div>
              <div className="deals__first-time-content">
                <h2>First-Time Customer Discount</h2>
                <p>
                  Welcome to the family. First-time customers at Eddie's Flowers receive
                  <strong> 15% off their entire first purchase</strong>. Just mention this
                  website at checkout — no code needed.
                </p>
                <ul className="deals__first-time-list">
                  <li>✅ Valid on any product category</li>
                  <li>✅ No minimum purchase required</li>
                  <li>✅ One use per customer</li>
                  <li>✅ Valid ID required — must be 21+</li>
                </ul>
                <MagneticButton>
                  <Link to="/contact" className="btn btn--primary">Plan Your Visit</Link>
                </MagneticButton>
              </div>
              <div className="deals__first-time-visual" aria-hidden="true">
                <div className="deals__discount-badge">
                  <span className="deals__discount-pct">15%</span>
                  <span className="deals__discount-off">OFF</span>
                  <span className="deals__discount-sub">First Visit</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Daily Deals */}
      <section className="section section--beige">
        <div className="container">
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="section-tag">Every Week</span>
              <RevealText as="h2" className="section-title">Daily Deals</RevealText>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Something special every day of the week. Check back regularly —
                specials rotate seasonally.
              </p>
            </div>
          </FadeIn>
          <div className="deals__daily-grid">
            {DAILY_DEALS.map((deal, i) => (
              <FadeIn key={deal.day} delay={i * 0.07}>
                <div className="deals__daily-card">
                  <span className="deals__daily-icon">{deal.icon}</span>
                  <span className="deals__daily-badge">{deal.badge}</span>
                  <div className="deals__daily-day">{deal.day}</div>
                  <h3 className="deals__daily-label">{deal.label}</h3>
                  <p className="deals__daily-desc">{deal.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program */}
      <section className="section section--charcoal">
        <div className="container deals__loyalty">
          <FadeIn className="deals__loyalty-text">
            <span className="section-tag" style={{ color: 'var(--color-yellow)' }}>Coming Soon</span>
            <h2 style={{ color: '#fff', marginBottom: '16px' }}>Loyalty Rewards Program</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '20px' }}>
              We're building a loyalty program that rewards you for every visit.
              Earn points on every purchase, redeem for discounts, and get early access
              to new products and exclusive deals.
            </p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7', marginBottom: '28px' }}>
              Powered by the Legacy Operations ACADEMY platform — the same loyalty system
              used across our family of brands.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#text-signup" className="btn btn--yellow">
                Get Notified When We Launch
              </a>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="deals__loyalty-visual">
            <div className="deals__loyalty-card">
              <div className="deals__loyalty-icon">⭐</div>
              <h4 style={{ color: '#fff', marginBottom: '16px' }}>Earn Points On Every Visit</h4>
              <div className="deals__points-preview">
                <div className="deals__points-row">
                  <span>$1 spent</span>
                  <span className="deals__points-val">= 1 point</span>
                </div>
                <div className="deals__points-row">
                  <span>100 points</span>
                  <span className="deals__points-val">= $5 off</span>
                </div>
                <div className="deals__points-row">
                  <span>Birthday month</span>
                  <span className="deals__points-val">= 2× points</span>
                </div>
                <div className="deals__points-row">
                  <span>Referral bonus</span>
                  <span className="deals__points-val">= 50 pts</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Text Alerts Signup */}
      <section className="section" id="text-signup">
        <div className="container">
          <FadeIn>
            <div className="deals__text-signup">
              <div className="deals__text-signup-icon">📱</div>
              <div className="deals__text-signup-content">
                <span className="section-tag">Stay in the Loop</span>
                <h2 className="section-title">Sign Up for Text Alerts</h2>
                <p className="section-subtitle">
                  Be the first to know about flash sales, new arrivals, and exclusive
                  text-only deals. We'll never spam you — just the good stuff.
                </p>
                <form className="deals__text-form" onSubmit={e => e.preventDefault()}>
                  <div className="deals__text-input-row">
                    <input
                      type="tel"
                      placeholder="(555) 555-5555"
                      aria-label="Phone number"
                      className="deals__text-input"
                    />
                    <button type="submit" className="btn btn--primary">
                      Sign Me Up
                    </button>
                  </div>
                  <p className="deals__text-disclaimer">
                    By signing up you agree to receive recurring automated marketing texts.
                    Reply STOP to unsubscribe. Msg & data rates may apply. 21+ only.
                  </p>
                </form>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
