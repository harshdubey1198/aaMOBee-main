import React, { useEffect, useState, useRef } from 'react';
import Footer from './components/footer';
import './assets/css/styles.css';
import Header from './components/headerWithDashboard';
import Lander from './components/lander';
import Starter from './components/starter';
import Bookkeeping from './components/bookkeeping';
import UserFavourites from './components/userFavourites';
import Pricing from './components/pricing';
import Testimonial from './components/testimonial';
import FaqSection from './components/faqSection';
import ClientSection from './components/clientSection';
import RiseaaMOBee from './components/riseaaMOBee';
import { useNavigate } from 'react-router-dom';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Index() {
  const navigate = useNavigate();
  const authuser = JSON.parse(localStorage.getItem('authUser')) || null;
  const pricingRef = useRef(null);
  const testimonialRef = useRef(null);
  const FAQRef = useRef(null);
  const productTrayRef = useRef(null);

  // Redirection
  useEffect(() => {
    if (authuser !== null) {
      navigate('/dashboard');
    }
  }, []);
  const scrollToPricing = () => {
    if (pricingRef.current) {
      const offset = 100;
      const topPosition = pricingRef.current.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      });
    }
  };
  const scrollToTestimonial = () => {
    if (testimonialRef.current) {
      const offset = 100;
      const topPosition = testimonialRef.current.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      });
    }
  };
  const scrollToFAQ = () => {
    if (FAQRef.current) {
      const offset = 80;
      const topPosition = FAQRef.current.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: topPosition,
        behavior: 'smooth',
      });
    }
  };
  const openAndScrollToProducts = () => {
  setShowProducts(true);

  setTimeout(() => {
    if (productTrayRef.current) {
      productTrayRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300); // Adjust delay if needed
};
useEffect(() => {
  window.scrollToProducts = () => {
    setShowProducts(true);
    setTimeout(() => {
      if (productTrayRef.current) {
        productTrayRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return () => {
    delete window.scrollToProducts;
  };
}, []);


  // Add styles & scripts
  useEffect(() => {
    const links = [
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/brands.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/fontawesome.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/regular.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/solid.min.css",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
    ];

    links.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      links.forEach(href => {
        const link = document.querySelector(`link[href="${href}"]`);
        if (link) document.head.removeChild(link);
      });

      if (script) document.body.removeChild(script);
    };
  }, []);

  // Scroll-trigger animation on all sections
  useEffect(() => {
    gsap.utils.toArray(".animate-on-scroll").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  const [showProducts, setShowProducts] = useState(false);
  return (
    <div>
      <Header showProducts={showProducts} setShowProducts={setShowProducts} scrollToPricing={scrollToPricing} scrollToTestimonial={scrollToTestimonial}
        scrollToFAQ={scrollToFAQ} productTrayRef={productTrayRef} />
      <div className="animate-on-scroll"><Lander scrollToPricing={scrollToPricing} /></div>
      <div className="animate-on-scroll"><Starter /></div>
      <div className="animate-on-scroll"><Bookkeeping /></div>
      <div className="animate-on-scroll"><UserFavourites openProductTray={openAndScrollToProducts} /></div>
      <div className="animate-on-scroll" ref={pricingRef}><Pricing /></div>
      <div className="animate-on-scroll" ref={testimonialRef}><Testimonial /></div>
      <div className="animate-on-scroll" ref={FAQRef}><FaqSection /></div>
      <div className="animate-on-scroll"><ClientSection /></div>
      <div className="animate-on-scroll"><RiseaaMOBee /></div>
      <Footer />
    </div>
  );
}

export default Index;
