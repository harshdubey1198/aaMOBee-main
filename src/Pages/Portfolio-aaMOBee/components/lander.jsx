import React, { useEffect } from "react";

function Lander({scrollToPricing}) {
 useEffect(() => {
  if (window.particlesJS) {
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 120,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: ["#ffffff", "#00c9ff", "#92fe9d"], // subtle multicolor
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: 0.8,
          random: true,
        },
        size: {
          value: 4,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 120,
          color: "#ffffff",
          opacity: 0.3,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "bubble", // visually engaging
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 200,
            size: 8,
            duration: 2,
            opacity: 0.8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });
  }
}, []);

  return (
    <div
      id="Home"
      className="lander"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Particles background */}
      <div
        id="particles-js"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: "#00303f",
          pointerEvents: "auto", // allows mouse interaction
        }}
      />

      {/* Main content */}
      <div
        className="lander-content"
        style={{ position: "relative", zIndex: 1 }}
      >
        <img
          src="https://res.cloudinary.com/harshdubey1198/image/upload/v1738647390/website_adv_banner_1_xlzomb.png"
          //  loading="lazy"
          alt="aaMOBee Logo"
          className="adv-banner"
        />
        <div className="info-1">
          <span className="banner-txt">
            Accounting Software that makes the hard part easy
          </span>
          <br />
          <br />
          <div className='content'>
          <a className="bns" onClick={scrollToPricing} style={{ cursor: "pointer" }}>
            Buy Now & Save
          </a>
          <div className="bfs">
            Black Friday sale 🎁 <br />
            80% off for 4 months
          </div>
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
