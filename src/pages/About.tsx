import { Link } from 'react-router-dom';
import { useInView } from '../hooks/useInView';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import './About.css';

const VALUES = [
  { icon: '🌿', title: 'Quality First', body: 'We hand-select every product. Our buyers visit farms, taste batches, and reject anything that doesn\'t meet our standard.' },
  { icon: '🤝', title: 'Honest Service', body: 'We tell you what we think. If one product is better for you than another, we\'ll say so — even if it\'s cheaper.' },
  { icon: '🏘️', title: 'Community Roots', body: 'We live here. We shop here. We\'re invested in making Ashburnham a better place — not just a place to do business.' },
  { icon: '📚', title: 'Education', body: 'Cannabis is complex. We take the time to explain terpenes, cannabinoids, and consumption methods so you can make informed choices.' },
];

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`about-fadein${inView ? ' about-fadein--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function About() {
  return (
    <main className="page-about">

      {/* Hero */}
      <section className="about__hero">
        <div className="about__hero-bg" aria-hidden="true" />
        <div className="container about__hero-inner">
          <span className="section-tag" style={{ color: '#8fd458' }}>Our Story</span>
          <RevealText as="h1" className="about__hero-title">
            Born in Ashburnham, Built for You
          </RevealText>
          <p className="about__hero-sub">
            Eddie's Flowers isn't just another dispensary. It's a neighborhood institution
            built on the belief that cannabis should be personal, approachable, and honest.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container about__story">
          <FadeIn className="about__story-text">
            <span className="section-tag">The Beginning</span>
            <h2 className="section-title">Where It All Started</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.9', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Eddie's Flowers was founded on a simple idea: the best cannabis experience
              should feel like walking into your favorite local shop — where someone knows your name,
              asks how you've been, and actually helps you find what you need.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.9', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              We looked at the cannabis retail landscape and saw too many sterile, clinical environments
              that felt nothing like the warm, welcoming spaces that the best local businesses create.
              So we set out to build something different. Something rooted in Ashburnham.
              Something that feels like it belongs here.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.9', color: 'var(--color-text-muted)' }}>
              The result is Eddie's Flowers — a dispensary that blends the warmth of a country store
              with the expertise of a specialty retailer. Every detail, from the deli-style service counter
              to the hand-selected product lineup, was designed with our community in mind.
            </p>
          </FadeIn>
          <FadeIn delay={0.15} className="about__story-visual">
            <div className="about__story-card">
              <div className="about__story-icon">🌸</div>
              <blockquote className="about__story-quote">
                "The best dispensary experience isn't about having the most products.
                It's about helping each person find exactly what they need."
              </blockquote>
              <p className="about__story-cite">— Eddie's Flowers Team</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Deli Philosophy */}
      <section className="section section--beige">
        <div className="container">
          <FadeIn>
            <div className="about__deli-header">
              <span className="section-tag">Our Philosophy</span>
              <RevealText as="h2" className="section-title">The Deli Philosophy</RevealText>
              <p className="section-subtitle">
                Deli-style service isn't just a model — it's a mindset.
              </p>
            </div>
          </FadeIn>
          <div className="about__deli-grid">
            <FadeIn delay={0.05}>
              <div className="about__deli-block">
                <h3>See Before You Buy</h3>
                <p>
                  Like the best cheese counter or butcher shop, we believe you should see
                  what you're buying before you commit. Our display case shows off the day's
                  flower selection — color, structure, trichomes and all.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="about__deli-block">
                <h3>Fresh Every Time</h3>
                <p>
                  Flower is weighed and packaged in front of you at the counter.
                  No pre-packaged mystery bags. No sitting on shelves for weeks.
                  Just fresh product, handled with care.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="about__deli-block">
                <h3>Real Conversations</h3>
                <p>
                  Our budtenders aren't sales clerks — they're enthusiasts who genuinely
                  want to talk about what they carry. Ask about terpenes, ask about effects,
                  ask about that one strain you've been curious about.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="about__values-header">
              <span className="section-tag">What We Stand For</span>
              <RevealText as="h2" className="section-title">Our Values</RevealText>
            </div>
          </FadeIn>
          <div className="grid-2 about__values-grid">
            {VALUES.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="about__value-card">
                  <span className="about__value-icon">{v.icon}</span>
                  <div>
                    <h4 className="about__value-title">{v.title}</h4>
                    <p className="about__value-body">{v.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Operations */}
      <section className="section section--charcoal">
        <div className="container about__legacy">
          <FadeIn>
            <div className="about__legacy-text">
              <span className="section-tag" style={{ color: 'var(--color-green)' }}>Our Family</span>
              <h2 style={{ color: '#fff', marginBottom: '16px' }}>Part of Legacy Operations</h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '24px' }}>
                Eddie's Flowers is proudly part of the Legacy Operations family —
                the same team behind{' '}
                <a href="https://erva-site-iamderekd.replit.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-green)' }}>Erva</a>
                {' '}and{' '}
                <a href="https://beantown-greentown.replit.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-green)' }}>Beantown Greentown</a>.
                We're a multi-site cannabis operator with deep roots in Massachusetts,
                building dispensary experiences that put community and quality first.
              </p>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '32px' }}>
                Across all our locations, the mission is the same: create the kind of cannabis
                retail experience that makes people proud to be customers, and proud to be
                part of our community.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href="https://legacy-prime-navy.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Visit Legacy Operations →
                </a>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="about__legacy-brands">
            {[
              { name: 'Erva', url: 'https://erva-site-iamderekd.replit.app', desc: 'Premium cannabis in MA' },
              { name: 'Beantown Greentown', url: 'https://beantown-greentown.replit.app', desc: 'Cannabis for Boston' },
              { name: "Eddie's Flowers", url: '/', desc: 'You are here — Ashburnham' },
            ].map(brand => (
              <a
                key={brand.name}
                href={brand.url}
                target={brand.url.startsWith('http') ? '_blank' : undefined}
                rel={brand.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="about__brand-card"
              >
                <span className="about__brand-initial">{brand.name[0]}</span>
                <div>
                  <strong className="about__brand-name">{brand.name}</strong>
                  <span className="about__brand-desc">{brand.desc}</span>
                </div>
                {brand.url.startsWith('http') && <span className="about__brand-arrow">↗</span>}
              </a>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <FadeIn>
            <span className="section-tag">Come Say Hi</span>
            <h2 className="section-title">Ready to See What We're About?</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 32px' }}>
              The best way to understand Eddie's Flowers is to visit us.
              We're open seven days a week and would love to meet you.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <MagneticButton>
                <Link to="/menu" className="btn btn--primary">View Our Menu</Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/contact" className="btn btn--outline">Get Directions</Link>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
