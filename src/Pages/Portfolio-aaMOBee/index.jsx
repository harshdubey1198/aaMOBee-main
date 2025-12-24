import React, { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import './assets/css/styles.css';
import { useNavigate } from 'react-router-dom';

import Header from './components/headerWithDashboard';
import Footer from './components/footer';
import Lander from './components/lander';

// Lazy-load below-the-fold sections
const Starter = React.lazy(() => import('./components/starter'));
const Bookkeeping = React.lazy(() => import('./components/bookkeeping'));
const UserFavourites = React.lazy(() => import('./components/userFavourites'));
const Pricing = React.lazy(() => import('./components/pricing'));
const Testimonial = React.lazy(() => import('./components/testimonial'));
const FaqSection = React.lazy(() => import('./components/faqSection'));
const ClientSection = React.lazy(() => import('./components/clientSection'));
const RiseaaMOBee = React.lazy(() => import('./components/riseaaMOBee'));


// Run a callback once when an element becomes visible (and stop observing).
function useOnVisible(ref, { rootMargin = '200px', once = true }, onVisible) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!seen && e.isIntersecting) {
          seen = true;
          onVisible?.(el);
          if (once) io.disconnect();
        }
      });
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once, onVisible]);
}

// Defer some work until the browser is idle.
function runOnIdle(cb) {
  if ('requestIdleCallback' in window) {
    // @ts-ignore
    return requestIdleCallback(cb, { timeout: 2000 });
  }
  return setTimeout(cb, 300);
}


function LazySection({ children, rootMargin = '200px' }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  // Mount the section once it’s near the viewport
  useOnVisible(ref, { rootMargin, once: true }, () => setShow(true));

  // Load GSAP only when THIS section appears; scope animation to the section
  useOnVisible(
    ref,
    { rootMargin, once: true },
    async (el) => {
      // Delay GSAP import to the idle period of this frame to reduce TBT
      runOnIdle(async () => {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        gsap.registerPlugin(ScrollTrigger);
        // Animate the wrapper (cheap) – avoid touching deep trees
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  );

  return (
    <div ref={ref} className="animate-on-scroll below-fold">
      {show ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
}


function Index() {
  const navigate = useNavigate();
  // Parse once (not on every render)
  const authuser = (() => {
    try { return JSON.parse(localStorage.getItem('authUser') || 'null'); }
    catch { return null; }
  })();

  // Refs
  const pricingRef = useRef(null);
  const testimonialRef = useRef(null);
  const FAQRef = useRef(null);
  const productTrayRef = useRef(null);

  // Redirect if logged in
  useEffect(() => {
    if (authuser !== null) navigate('/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once – value won’t change during session

  // Smooth scroll helpers
  const smoothTo = useCallback((ref, offset = 100) => {
    if (!ref?.current) return;
    const top = ref.current.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);
  const scrollToPricing = () => smoothTo(pricingRef);
  const scrollToTestimonial = () => smoothTo(testimonialRef);
  const scrollToFAQ = () => smoothTo(FAQRef, 80);

  const [showProducts, setShowProducts] = useState(false);
  const [shouldScrollToProducts, setShouldScrollToProducts] = useState(false);

  const openAndScrollToProducts = () => {
    setShowProducts(true);
    setShouldScrollToProducts(true);
  };

  // Once the tray is mounted, perform the scroll (no fixed timeouts)
  useEffect(() => {
    if (showProducts && shouldScrollToProducts) {
      productTrayRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScrollToProducts(false);
    }
  }, [showProducts, shouldScrollToProducts]);

  // Optional global hook preserved (but without timeouts)
  useEffect(() => {
    window.scrollToProducts = () => {
      setShowProducts(true);
      setShouldScrollToProducts(true);
    };
    return () => { delete window.scrollToProducts; };
  }, []);

  // Load stable CSS once. Don’t remove them on unmount (keep them cached).
  useEffect(() => {
    const ensureLink = (href) => {
      if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';
      document.head.appendChild(link);
    };
    ensureLink('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
    ensureLink('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css');

    // Bootstrap JS is only needed for components with interactivity (collapse, dropdown)
    // Defer loading to an idle slot to reduce TBT.
    if (!document.querySelector('script[data-bootstrap-bundle]')) {
      runOnIdle(() => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
        s.defer = true;
        s.setAttribute('data-bootstrap-bundle', 'true');
        document.body.appendChild(s);
      });
    }
  }, []);

  return (
    <div>
      <Header
        showProducts={showProducts}
        setShowProducts={setShowProducts}
        scrollToPricing={scrollToPricing}
        scrollToTestimonial={scrollToTestimonial}
        scrollToFAQ={scrollToFAQ}
        productTrayRef={productTrayRef}
      />

      {/* LCP should be in here; ensure the Lander’s hero <img> uses fetchpriority="high" and next-gen srcset */}
      <div className="animate-on-scroll">
        <Lander scrollToPricing={scrollToPricing} />
      </div>

      <LazySection><Starter /></LazySection>
      <LazySection><Bookkeeping /></LazySection>
      <LazySection><UserFavourites openProductTray={openAndScrollToProducts} /></LazySection>

      <div ref={pricingRef} className="scroll-anchor" />
      <LazySection><Pricing /></LazySection>

      <div ref={testimonialRef} className="scroll-anchor" />
      <LazySection><Testimonial /></LazySection>

      <div ref={FAQRef} className="scroll-anchor" />
      <LazySection><FaqSection /></LazySection>

      <LazySection><ClientSection /></LazySection>
      <LazySection><RiseaaMOBee /></LazySection>

      <Footer />
    </div>
  );
}

export default Index;
