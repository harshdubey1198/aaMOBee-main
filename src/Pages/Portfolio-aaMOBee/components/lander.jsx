import React, { useEffect, useRef } from "react";

function runOnIdle(cb) {
  if ("requestIdleCallback" in window) {
    // @ts-ignore
    return requestIdleCallback(cb, { timeout: 2000 });
  }
  return setTimeout(cb, 300);
}

let particlesScriptPromise;
let particlesScriptFailed = false;
function ensureParticlesScript() {
  if (particlesScriptFailed)
    return Promise.reject(new Error("particles failed previously"));
  if (particlesScriptPromise) return particlesScriptPromise;
  particlesScriptPromise = new Promise((resolve, reject) => {
    if (window.particlesJS) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = (e) => {
      particlesScriptFailed = true;
      reject(e);
    };
    document.head.appendChild(s);
  });
  return particlesScriptPromise;
}

function Lander({ scrollToPricing }) {
  const containerRef = useRef(null);
  const particlesRef = useRef(null);
  const ioRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    ioRef.current = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e.isIntersecting) return;

        ioRef.current?.disconnect();
        if (prefersReducedMotion) return;

        // === (1) scale work by device capability + mobile ===
        const mem = navigator.deviceMemory || 2;
        const scale = mem >= 4 ? 1 : mem >= 2 ? 0.75 : 0.5;
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const PARTICLE_COUNT = Math.round((isMobile ? 50 : 100) * scale);

        // === (2) pause/resume helpers ===
        function pauseParticles() {
          const dom = window.pJSDom && window.pJSDom[0];
          if (!dom) return;
          dom.pJS.particles.move.enable = false;
        }
        function resumeParticles() {
          const dom = window.pJSDom && window.pJSDom[0];
          if (!dom) return;
          const p = dom.pJS;
          p.particles.move.enable = true;
          p.fn.particlesRefresh();
        }

        runOnIdle(async () => {
          try {
            await ensureParticlesScript();
            if (!window.particlesJS || !particlesRef.current) return;

            window.particlesJS(particlesRef.current.id, {
              particles: {
                number: {
                  value: PARTICLE_COUNT,
                  density: { enable: true, value_area: 800 },
                },
                color: { value: ["#ffffff", "#00c9ff", "#92fe9d"] },
                shape: { type: "circle" },
                opacity: { value: 0.6, random: true },
                size: { value: isMobile ? 2.5 : 3.5, random: true },
                line_linked: {
                  enable: !isMobile,
                  distance: 120,
                  color: "#ffffff",
                  opacity: 0.25,
                  width: 1,
                },
                move: {
                  enable: true,
                  speed: isMobile ? 1.2 : 1.8,
                  out_mode: "out",
                },
              },
              interactivity: {
                detect_on: "canvas",
                events: {
                  onhover: { enable: !isMobile, mode: "grab" },
                  onclick: { enable: false },
                  resize: true,
                },
                modes: {
                  grab: { distance: 140, line_linked: { opacity: 0.6 } },
                },
              },
              retina_detect: true,
            });

            // === (3) pause on tab hidden / off-screen ===
            const onVis = () =>
              document.hidden ? pauseParticles() : resumeParticles();
            document.addEventListener("visibilitychange", onVis);

            const viewIO = new IntersectionObserver(
              (entries) => {
                const e2 = entries[0];
                if (e2.intersectionRatio === 0) pauseParticles();
                else resumeParticles();
              },
              { threshold: [0, 0.01] }
            );
            viewIO.observe(containerRef.current);

            // keep refs for cleanup
            particlesRef.current._onVis = onVis;
            particlesRef.current._viewIO = viewIO;
          } catch (err) {
            console.warn("particles.js failed to load", err);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    ioRef.current.observe(el);

    return () => {
      ioRef.current?.disconnect();
      document.removeEventListener(
        "visibilitychange",
        particlesRef.current?._onVis
      );
      particlesRef.current?._viewIO?.disconnect();
      const canvases = particlesRef.current
        ? particlesRef.current.getElementsByTagName("canvas")
        : [];
      if (canvases && canvases[0]) canvases[0].remove();
    };
  }, []);

  return (
    <div
      id="Home"
      ref={containerRef}
      className="lander"
      style={{ position: "relative", overflow: "hidden" }}
    > 
      <div
        id="particles-js"
        ref={particlesRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: "#00303f",
          // (4) disable hit-testing to avoid mousemove work unless you need hover on desktop
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        className="lander-content"
        style={{ position: "relative", zIndex: 1 }}
      >
        <style>
          {`
      @media (max-width: 768px) {
        .adv-banner {
          height: auto !important;
        }
      }
    `}
        </style>

        <img
          src="https://res.cloudinary.com/harshdubey1198/image/upload/drilldown_vi38ia.webp"
          srcSet="
      https://res.cloudinary.com/harshdubey1198/image/upload/f_auto,q_auto,w_640/drilldown_vi38ia.webp 640w,
      https://res.cloudinary.com/harshdubey1198/image/upload/f_auto,q_auto,w_960/drilldown_vi38ia.webp 960w,
      https://res.cloudinary.com/harshdubey1198/image/upload/f_auto,q_auto,w_1280/drilldown_vi38ia.webp 1280w,
      https://res.cloudinary.com/harshdubey1198/image/upload/f_auto,q_auto,w_1920/drilldown_vi38ia.webp 1920w
    "
          sizes="(max-width: 768px) 90vw, 70vw"
          fetchpriority="high"
          decoding="async"
          width="1280"
          height="540"
          alt="aaMOBee Logo"
          className="adv-banner"
          style={{ width: "100%", height: "540px", objectFit: "cover" }}
        />

        <div className="info-1">
          <span className="banner-txt">
            Accounting Software that makes the hard part easy
          </span>
          <br />
          <br />
          <div className="content">
            <a
              className="bns"
              onClick={scrollToPricing}
              style={{ cursor: "pointer" }}
            >
              Start Free Trial
            </a>                                                                                                
            {/* <a className="bns" onClick={scrollToPricing} style={{ cursor: "pointer" }}>
            Buy Now & Save
                </a> */}
            {/* <div className="bfs">
            Black Friday sale 🎁 <br />
            80% off for 4 months
          </div> */}
          </div>
        </div>

        <div className="review-div">
          <h4>Customers and experts recommend aaMOBee</h4>
          <br />
          <div className="row1">
            <div className="review-class">
              4.5 Excellent ⭐⭐⭐⭐
              <br />
              TakeApp.com
            </div>
            <div className="review-class">
              5 Excellent ⭐⭐⭐⭐⭐
              <br />
              SoftwareID.com
            </div>
            <div className="review-class">
              4.5 Excellent ⭐⭐⭐⭐
              <br />
              PCMag.com
            </div>
            <div className="review-class">
              4.5 Excellent ⭐⭐⭐⭐
              <br />
              Goto.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lander;
