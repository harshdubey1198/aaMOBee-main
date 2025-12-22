import React, { useEffect, useState } from "react";
import {
  FaChartLine,
  FaLightbulb,
  FaBullseye,
  FaDatabase,
  FaRocket,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function BusinessAnalyticsTool() {
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
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} triggeredExternally={triggeredExternally} />

      <div className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #d5fefd)",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}>
        <h1 className="fw-bold display-5 mb-3">aaMOBee Business Analytics</h1>
        <div className="glass-highlight p-3 px-4 mb-5"
          style={{
            maxWidth: "850px",
            background: "rgba(255, 255, 255, 0.35)",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#2c3e50",
            fontWeight: 500,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
            fontSize: "1.1rem",
          }}>
          Turn raw data into actionable business insights. Visualize KPIs, track revenue trends, and make smarter decisions with aaMOBee's intuitive dashboards.
        </div>

        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <span className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2" style={{ fontSize: "1.1rem" }}>
            Coming Soon
          </span>
          <a className="btn btn-outline-primary px-4 py-2 fw-semibold"
            onClick={(e) => {
              e.preventDefault();
              setTriggeredExternally(true);
              setTimeout(() => setTriggeredExternally(false), 500);
            }}>
            Explore Products
          </a>
        </div>

        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                icon: <FaChartLine className="text-info fs-3" />,
                title: "Real-Time Dashboards",
                desc: "Monitor sales, leads, and operational metrics live. Get real-time data to act quickly and stay ahead of market changes.",
              },
              {
                icon: <FaLightbulb className="text-warning fs-3" />,
                title: "Insights & Alerts",
                desc: "Get proactive insights and custom alerts based on thresholds or trends. Know what needs attention before it’s too late.",
              },
              {
                icon: <FaBullseye className="text-danger fs-3" />,
                title: "Target vs Achievement",
                desc: "Compare team or branch performance against defined targets. Track deviations, plan strategy, and boost accountability.",
              },
            ].map((card, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="p-4 h-100 shadow-sm glass-card"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#333",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 30px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}>
                  {card.icon}
                  <h6 className="fw-bold mt-3 text-black">{card.title}</h6>
                  <p className="text-muted">{card.desc}</p>
                </div>
              </div>
            ))}
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
    {/* What It Does + Real-Time Insights */}
    <div className="row g-4 justify-content-center mb-5">
      {[
        {
          title: "What It Does",
          points: [
            "Aggregate data from multiple sources",
            "Visualize key business metrics in real time",
            "Track sales, revenue, and conversion funnels",
            "Filter reports by branch, product, or date range",
            "Get clarity on performance, trends, and gaps",
          ],
          iconColor: "success",
        },
        {
          title: "Live Insight Generation",
          desc:
            "Stay informed with dashboards that update as your business moves. Whether you're tracking revenue goals, conversion rates, or collection targets — get visual intelligence instantly. Make confident decisions backed by real-time analytics and drill-down reporting.",
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
              WebkitBackdropFilter: "blur(10px)",
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
                    <FaCheckCircle
                      className={`me-2 text-${block.iconColor}`}
                    />
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

    {/* Feature Cards Section */}
    <div className="row g-4 justify-content-center fade-section">
      {[
        {
          icon: <FaChartLine className="text-warning fs-3" />,
          title: "KPI Tracking",
          desc:
            "Track sales, performance, and financial KPIs in real time. View company-wide trends or drill down to team-specific goals with live dashboard filters.",
        },
        {
          icon: <FaBullseye className="text-secondary fs-3" />,
          title: "Target vs Actual Reports",
          desc:
            "Get automated comparisons between planned vs achieved numbers. Perfect for monitoring revenue targets, sales quotas, and staff-wise performance.",
        },
        {
          icon: <FaDatabase className="text-danger fs-3" />,
          title: "Unified Data View",
          desc:
            "Pull data from CRMs, invoicing, collections, and other modules into one powerful dashboard. No more switching tabs or managing Excel sheets.",
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
              e.currentTarget.style.boxShadow =
                "0 20px 30px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 10px 15px rgba(0, 0, 0, 0.05)";
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


      {/* Footer Section */}
      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row mb-4 gap-sm-2 gap-md-0">
            <div className="col-md-6">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />
                  Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per module",
                    "Unlimited dashboards",
                    "Includes report exports and alerts",
                    "Instant setup – no training needed",
                    "Cancel anytime – no lock-in",
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
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-warning fw-bold mb-3">👥 Who Is It For?</h5>
                <ul className="list-unstyled">
                  {[
                    "Founders & Business Owners",
                    "Sales & Marketing Teams",
                    "Finance and Revenue Teams",
                    "Branch or Territory Heads",
                    "Operations & Logistics Teams",
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
              <div className="p-4 shadow-sm shimmer-bg rounded">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  These future updates will be available at no extra cost:
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Google Sheets Integration",
                    "AI-powered Data Forecasting",
                    "Custom Email & WhatsApp Reports",
                    "Graph Builder & Drag-n-Drop Layouts",
                    "Cross-Module Report Composer",
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

export default BusinessAnalyticsTool;
