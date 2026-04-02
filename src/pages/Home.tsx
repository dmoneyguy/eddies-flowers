import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import { useTiltEffect } from '../hooks/useTiltEffect';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import './Home.css';

const CATEGORIES = [
  { icon: '🌸', name: 'Flower', desc: 'Premium indoor & outdoor cultivars', link: '/menu' },
  { icon: '💎', name: 'Concentrates', desc: 'Live rosin, wax, shatter & more', link: '/menu' },
  { icon: '🍫', name: 'Edibles', desc: 'Gummies, chocolates & infused treats', link: '/menu' },
  { icon: '🔥', name: 'Pre-Rolls', desc: 'Ready to spark, perfectly rolled', link: '/menu' },
  { icon: '💨', name: 'Vapes', desc: 'Cartridges, disposables & batteries', link: '/menu' },
  { icon: '🧰', name: 'Accessories', desc: 'Pipes, papers, grinders & more', link: '/menu' },
];

const WHYS = [
  { icon: '🌿', title: 'Curated Quality', body: 'We hand-select every product on our shelves. If we wouldn\'t smoke it ourselves, we won\'t sell it.' },
  { icon: '🤝', title: 'Personal Service', body: 'Our budtenders are passionate, knowledgeable, and genuinely want to help you find the perfect product.' },
  { icon: '🏪', title: 'Deli-Style Experience', body: 'Come to the counter, see what we have, and let us walk you through every option. No rush, no pressure.' },
  { icon: '❤️', title: 'Local Community', body: 'We\'re rooted in Ashburnham. We support local growers, local causes, and our local neighbors.' },
];

function CategoryCard({ cat }: { cat: typeof CATEGORIES[0] }) {
  const tilt = useTiltEffect(4);
  return (
    <a
      href={cat.link}
      className="home__cat-card"
      ref={tilt.ref as React.RefObject<HTMLAnchorElement>}
      onMouseMove={tilt.onMouseMove as unknown as React.MouseEventHandler<HTMLAnchorElement>}
      onMouseLeave={tilt.onMouseLeave as unknown as React.MouseEventHandler<HTMLAnchorElement>}
    >
      <div className="home__cat-icon">{cat.icon}</div>
      <h3 className="home__cat-name">{cat.name}</h3>
      <p className="home__cat-desc">{cat.desc}</p>
      <span className="home__cat-arrow">Shop →</span>
    </a>
  );
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section fade-section${inView ? ' fade-section--visible' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

export default function Home() {
  const heroRef = useInView();
  const whyRef = useInView();

  return (
    <main className="home">

      {/* Hero */}
      <section className="home__hero leaf-pattern">
        <div className="home__hero-bg" aria-hidden="true" />
        <div className="container home__hero-inner">
          <div
            ref={heroRef.ref as React.RefObject<HTMLDivElement>}
            className={`home__hero-content${heroRef.inView ? ' hero-visible' : ''}`}
          >
            <span className="home__hero-badge">🌿 Now Open in Ashburnham, MA</span>
            <RevealText as="h1" className="home__hero-title">
              Ashburnham's Premier Cannabis Dispensary
            </RevealText>
            <p className="home__hero-sub">
              Fresh flower, friendly service, and a deli-style experience you won't find anywhere else.
              Come see what's behind the counter.
            </p>
            <div className="home__hero-ctas">
              <MagneticButton>
                <Link to="/menu" className="btn btn--primary btn--lg">View Our Menu</Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/contact" className="btn btn--outline-white btn--lg">Get Directions</Link>
              </MagneticButton>
            </div>
            <div className="home__hero-meta">
              <span>📍 Ashburnham, MA</span>
              <span>⏰ Open Today 10am–8pm</span>
              <span>🔞 21+ Only</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deli Experience */}
      <Section className="section--beige">
        <div className="container home__deli">
          <div className="home__deli-text">
            <span className="section-tag">Our Approach</span>
            <RevealText as="h2" className="section-title">The Deli Experience</RevealText>
            <p className="section-subtitle">
              Forget the clinical dispensary feel. Eddie's Flowers is built around a simple idea:
              come to the counter, tell us what you're looking for, and let our budtenders guide you.
            </p>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              We display our products behind the glass — fresh flower weighed and packaged right in front of you,
              just like the best deli in town. Every strain gets a story. Every product gets the attention it deserves.
              We're not here to rush you out the door. We're here to make sure you leave happy.
            </p>
            <MagneticButton>
              <Link to="/about" className="btn btn--primary">Learn Our Story</Link>
            </MagneticButton>
          </div>
          <div className="home__deli-visual">
            <div className="home__deli-card">
              <div className="home__deli-step">
                <div className="home__deli-num">01</div>
                <div>
                  <strong>Browse the Case</strong>
                  <p>See today's flower selection up close before you buy.</p>
                </div>
              </div>
              <div className="home__deli-step">
                <div className="home__deli-num">02</div>
                <div>
                  <strong>Talk to Your Budtender</strong>
                  <p>Ask questions. Get real answers. No upselling, just good advice.</p>
                </div>
              </div>
              <div className="home__deli-step">
                <div className="home__deli-num">03</div>
                <div>
                  <strong>Weighed Fresh</strong>
                  <p>Flower weighed and packaged right in front of you, every time.</p>
                </div>
              </div>
              <div className="home__deli-step">
                <div className="home__deli-num">04</div>
                <div>
                  <strong>Leave Happy</strong>
                  <p>We're not done until you've got exactly what you came for.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <div className="container">
          <div className="home__cats-header">
            <span className="section-tag">Shop by Category</span>
            <RevealText as="h2" className="section-title">Find What You're Looking For</RevealText>
            <p className="section-subtitle">
              From premium flower to edibles and accessories — curated for quality, every single time.
            </p>
          </div>
          <div className="home__cats-grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.name}
                className="home__cat-wrap fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <CategoryCard cat={cat} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Eddie's */}
      <Section className="section--charcoal">
        <div
          className="container"
          ref={whyRef.ref as React.RefObject<HTMLDivElement>}
        >
          <div className="home__why-header">
            <span className="section-tag" style={{ color: 'var(--color-green)' }}>Why Choose Us</span>
            <h2 className="section-title" style={{ color: '#fff' }}>Why Eddie's?</h2>
          </div>
          <div className="grid-2 home__why-grid">
            {WHYS.map((item, i) => (
              <div
                key={item.title}
                className={`home__why-item${whyRef.inView ? ' home__why-item--visible' : ''}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <span className="home__why-icon">{item.icon}</span>
                <div>
                  <h3 className="home__why-title">{item.title}</h3>
                  <p className="home__why-body">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Visit */}
      <Section className="section--beige">
        <div className="container home__visit">
          <div>
            <span className="section-tag">Find Us</span>
            <RevealText as="h2" className="section-title">Visit Us in Ashburnham</RevealText>
            <div className="home__visit-info">
              <div className="home__visit-block">
                <h4>📍 Address</h4>
                <p>123 Main Street<br />Ashburnham, MA 01430</p>
              </div>
              <div className="home__visit-block">
                <h4>⏰ Hours</h4>
                <p>Mon–Sat: 10:00 AM – 8:00 PM<br />Sunday: 11:00 AM – 6:00 PM</p>
              </div>
              <div className="home__visit-block">
                <h4>📞 Phone</h4>
                <p><a href="tel:+19785550100">(978) 555-0100</a></p>
              </div>
            </div>
            <div className="home__visit-ctas">
              <MagneticButton>
                <a
                  href="https://maps.google.com/?q=Ashburnham+MA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Get Directions
                </a>
              </MagneticButton>
              <MagneticButton>
                <Link to="/contact" className="btn btn--outline">Contact Us</Link>
              </MagneticButton>
            </div>
          </div>
          <div className="home__map-placeholder">
            {/* Google Maps placeholder */}
            <div className="home__map-embed">
              <iframe
                title="Eddie's Flowers Location"
                src="https://maps.google.com/maps?q=Ashburnham,MA&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Banner */}
      <Section className="section--green">
        <div className="container home__cta-banner">
          <div>
            <h2 style={{ color: '#fff', marginBottom: '8px' }}>Ready to Visit?</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
              First-time customers get a special welcome gift. Mention the website at checkout.
            </p>
          </div>
          <div className="home__cta-banner-btns">
            <MagneticButton>
              <Link to="/menu" className="btn btn--yellow">View Our Menu</Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/deals" className="btn btn--outline-white">See Deals</Link>
            </MagneticButton>
          </div>
        </div>
      </Section>

    </main>
  );
}
