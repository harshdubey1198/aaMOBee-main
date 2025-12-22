import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaChartLine,
  FaMobileAlt,
  FaUserTie,
  FaBullseye,
  FaRupeeSign,
  FaRocket,
} from "react-icons/fa";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function DailySalesTracker() {
  const [showProducts, setShowProducts] = useState(false);
  const [triggeredExternally, setTriggeredExternally] = useState(false);

  useEffect(() => {
    gsap.utils.toArray(".fade-section").forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <HeaderWithDashboard
        showProducts={showProducts}
        setShowProducts={setShowProducts}
        triggeredExternally={triggeredExternally}
      />
      <div
        className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #d5fefd)",
          padding: "6rem 1rem 3rem",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">Daily Sales Tracker</h1>
        <p className="lead text-muted mt-2">
          Track daily sales and collections at your shop, branch, or by field agents.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <span className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2" style={{ fontSize: "1.1rem" }}>
            Coming Soon
          </span>
          <a
            className="btn btn-outline-primary px-4 py-2 fw-semibold"
            onClick={(e) => {
              e.preventDefault();
              setTriggeredExternally(true);
              setTimeout(() => setTriggeredExternally(false), 500);
            }}
          >
            Explore More Products
          </a>
        </div>

        <div
          className="card my-5 shadow-sm border-0 fade-section"
          style={{
            maxWidth: "600px",
            background: "rgb(255 255 255 / 48%)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            color: "#565252",
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-primary fw-semibold mb-3">Why It Matters</h5>
            <p>
              Sales tracking is the pulse of any business. aaMOBee’s Daily Sales Tracker makes it easy for shopkeepers, branch managers, and field agents to log sales, monitor daily collections, and match against set targets — all from their mobile devices.
            </p>
          </div>
        </div>
      </div>

      <div
        className="py-5 fade-section"
        style={{
          minHeight: "calc(100vh - 80px)",
          background:
            "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "What It Does",
                points: [
                  "Record daily sales and collections",
                  "Capture sales by staff, location or team",
                  "Track cash, card, UPI or credit sales",
                  "Generate day-end reports",
                  "View target vs achievement stats",
                ],
                iconColor: "success",
              },
              {
                title: "Real-Time Visibility",
                desc:
                  "Get real-time visibility into your sales operations — whether from a shop floor, remote branch, or field agent’s mobile. aaMOBee’s tracker helps you monitor revenue flow, staff activity, and daily summaries in one connected dashboard.",
                iconColor: "info",
              },
            ].map((block, idx) => (
              <div className="col-md-6" key={idx}>
                <div
                  className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                  }}
                >
                  <h5 className={`fw-bold mb-3 text-${block.iconColor}`}>
                    ✅ {block.title}
                  </h5>
                  {block.points ? (
                    <ul className="list-unstyled mb-0">
                      {block.points.map((item, i) => (
                        <li key={i} className="mb-2 d-flex align-items-start">
                          <FaCheckCircle className={`me-2 text-${block.iconColor}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mb-0">{block.desc}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                icon: <FaMobileAlt className="text-warning fs-3" />,
                title: "Mobile-Based Entries",
                desc: "Allow your staff or field agents to record sales on-the-go — anytime, anywhere. Fast, offline-capable, and fully secure.",
              },
              {
                icon: <FaChartLine className="text-secondary fs-3" />,
                title: "Day-End Reporting",
                desc: "Summarized reports sent at end of the day with breakdowns by staff, payment mode, and product category.",
              },
              {
                icon: <FaBullseye className="text-danger fs-3" />,
                title: "Target vs Achievement",
                desc: "Set daily or monthly targets per branch or staff. Track performance in real-time and boost accountability.",
              },
            ].map((feature, i) => (
              <div className="col-md-4" key={i}>
                <div
                  className="bg-white text-dark p-4 shadow-sm h-100 card-shimmer card-futuristic"
                  style={{
                    borderRadius: "20px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 30px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="content">
                    {feature.icon}
                    <h6 className="fw-bold mt-3 text-black">{feature.title}</h6>
                    <p className="text-muted">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container fade-section">
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="p-4 shadow-sm h-100 animated-bg" style={{
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#000"
              }}>
                <h5 className="fw-bold text-success mb-1">
                  <FaRupeeSign className="me-2" />
                  Just ₹125/month/module
                </h5>
                <small className="text-muted">Affordable for every business</small>
                <ul className="list-unstyled mt-3">
                  {[
                    "Pay only for the module you need",
                    "No setup charges or contracts",
                    "Switch modules anytime",
                    "Use with any currency or region",
                    "Multi-company access in one login",
                  ].map((item, i) => (
                    <li key={i} className="mb-2 d-flex align-items-start">
                      <FaCheckCircle className="text-success me-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 shadow-sm h-100 animated-bg" style={{
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#000"
              }}>
                <h5 className="text-warning fw-bold mb-3">👤 Who Is It For?</h5>
                <ul className="list-unstyled">
                  {[
                    "Retail shops with daily sales activity",
                    "Field sales teams tracking collections",
                    "Branches reporting revenue per shift",
                    "Managers wanting real-time team updates",
                    "Owners tracking business health remotely",
                  ].map((item, i) => (
                    <li key={i} className="mb-2 d-flex align-items-start">
                      <FaCheckCircle className="text-success me-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="col">
              <div className="p-4 shadow-sm shimmer-bg">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  These enhancements will be available in future updates:
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Daily auto-summary via WhatsApp",
                    "Custom sales KPIs dashboard",
                    "Geo-tagging for field entries",
                    "QR-based staff login",
                    "Offline-first mode for remote agents",
                  ].map((item, i) => (
                    <li key={i} className="col-md-6 mb-2 d-flex align-items-start">
                      <FaCheckCircle className="text-secondary me-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default DailySalesTracker;
