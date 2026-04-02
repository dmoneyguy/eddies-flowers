import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import AgeGate from './components/AgeGate';
import AnnouncementBar from './components/AnnouncementBar';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Deals from './pages/Deals';
import Contact from './pages/Contact';
import './App.css';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    const id = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return <div ref={ref}>{children}</div>;
}

function AppLayout() {
  return (
    <>
      <AgeGate />
      <CustomCursor />
      <ScrollProgress />
      <AnnouncementBar />
      <Nav />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </PageTransition>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
