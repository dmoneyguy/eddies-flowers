import { useState } from 'react';
import type { FormEvent } from 'react';
import { useInView } from '../hooks/useInView';
import RevealText from '../components/RevealText';
import './Contact.css';

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`contact-fadein${inView ? ' contact-fadein--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="page-contact">

      {/* Hero */}
      <section className="contact__hero">
        <div className="contact__hero-bg" aria-hidden="true" />
        <div className="container contact__hero-inner">
          <span className="section-tag" style={{ color: '#8fd458' }}>Say Hello</span>
          <RevealText as="h1" className="contact__hero-title">
            Get in Touch
          </RevealText>
          <p className="contact__hero-sub">
            Questions, feedback, or just want to know what we have in stock?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact__grid">

          {/* Info */}
          <div className="contact__info">
            <FadeIn>
              <h2 style={{ marginBottom: '32px' }}>Find Us</h2>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="contact__info-block">
                <div className="contact__info-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <address>
                    123 Main Street<br />
                    Ashburnham, MA 01430
                  </address>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="contact__info-block">
                <div className="contact__info-icon">⏰</div>
                <div>
                  <h4>Hours of Operation</h4>
                  <table className="contact__hours-table">
                    <tbody>
                      <tr><td>Monday</td><td>10:00 AM – 8:00 PM</td></tr>
                      <tr><td>Tuesday</td><td>10:00 AM – 8:00 PM</td></tr>
                      <tr><td>Wednesday</td><td>10:00 AM – 8:00 PM</td></tr>
                      <tr><td>Thursday</td><td>10:00 AM – 8:00 PM</td></tr>
                      <tr><td>Friday</td><td>10:00 AM – 8:00 PM</td></tr>
                      <tr><td>Saturday</td><td>10:00 AM – 8:00 PM</td></tr>
                      <tr><td>Sunday</td><td>11:00 AM – 6:00 PM</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="contact__info-block">
                <div className="contact__info-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+19785550100" className="contact__phone">(978) 555-0100</a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="contact__info-block">
                <div className="contact__info-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:hello@eddiesflowers.com" className="contact__email">
                    hello@eddiesflowers.com
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div className="contact__info-block">
                <div className="contact__info-icon">📱</div>
                <div>
                  <h4>Follow Us</h4>
                  <div className="contact__social">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact__social-link">
                      Instagram
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact__social-link">
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form + Map */}
          <div className="contact__right">
            {/* Map */}
            <FadeIn>
              <div className="contact__map">
                {/* Google Maps embed placeholder */}
                <iframe
                  title="Eddie's Flowers Location Map"
                  src="https://maps.google.com/maps?q=Ashburnham,MA&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>

            {/* Contact Form */}
            <FadeIn delay={0.1}>
              <div className="contact__form-wrap">
                <h3 style={{ marginBottom: '20px' }}>Send Us a Message</h3>
                {submitted ? (
                  <div className="contact__success">
                    <span className="contact__success-icon">✅</span>
                    <h4>Message Sent!</h4>
                    <p>Thanks for reaching out. We'll get back to you within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact__form">
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="What's on your mind?"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

    </main>
  );
}
