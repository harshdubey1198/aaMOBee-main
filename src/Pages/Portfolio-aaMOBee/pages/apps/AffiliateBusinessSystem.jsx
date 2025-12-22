import React, { useEffect, useState } from "react";
import { FaChartLine, FaUsers, FaBullhorn, FaHandshake, FaRupeeSign, FaRocket, FaCheckCircle, } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function AffiliateManagementSystem() {
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
          background: "linear-gradient(to right, #e0f7fa, #f0fff0)",
          padding: "6rem 1rem 3rem",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">aaMOBee Affiliate Management System</h1>
        <div
          className="glass-highlight p-3 px-4 mb-5"
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
          }}
        >
          Track, reward, and grow your affiliate partners with ease. Automate payouts, monitor campaigns, and scale your referral network with aaMOBee AMS.
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
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                icon: <FaUsers className="text-info fs-3" />,
                title: "Affiliate Onboarding",
                desc: "Easily onboard affiliates with customizable registration forms, approval workflows, and role-based access.",
              },
              {
                icon: <FaBullhorn className="text-warning fs-3" />,
                title: "Campaign Management",
                desc: "Set up marketing campaigns with referral links, promo codes, and tracking parameters for better reach.",
              },
              {
                icon: <FaHandshake className="text-success fs-3" />,
                title: "Commission Automation",
                desc: "Automate commission calculations and generate reports based on successful conversions or sales.",
              },
            ].map((item, idx) => (
              <div className="col-md-4" key={idx}>
                <div
                  className="bg-white text-dark p-4 shadow-sm h-100 card-shimmer card-futuristic"
                  style={{
                    borderRadius: "20px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "0 20px 30px rgba(0, 0, 0, 0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.05)")
                  }
                >
                  {item.icon}
                  <h6 className="fw-bold mt-3 text-black">{item.title}</h6>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="py-5 fade-section"
        style={{
        //   minHeight: "calc(100vh - 80px)",
          background: "linear-gradient(185deg, #013c6a 0%, #03031a 35%, #03181c 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "What It Does",
                points: [
                  "Register and manage affiliate partners",
                  "Track referral traffic and conversions",
                  "Assign tier-based commissions",
                  "Generate automated earnings reports",
                  "Integrate with CRM and invoicing tools",
                ],
                iconColor: "success",
              },
              {
                title: "Live Performance Tracking",
                desc:
                  "Get real-time data on which affiliate is driving traffic, leads, or purchases. View consolidated dashboards with ROI analytics and earnings breakdown.",
                iconColor: "info",
              },
            ].map((block, idx) => (
              <div className="col-md-6" key={idx}>
                <div
                  className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
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

          <div className="row g-4 justify-content-center fade-section">
            {[
                {
                icon: <FaUsers className="text-info fs-3" />,
                title: "Affiliate Onboarding",
                desc:
                    "Easily add and manage affiliates with a simple registration process, approval workflow, and tier assignment. Keep your network organized and scalable.",
                },
                {
                icon: <FaBullhorn className="text-warning fs-3" />,
                title: "Campaign Tracking",
                desc:
                    "Launch and monitor campaigns using unique referral links, promo codes, or banners. Track every click, lead, and conversion with transparent analytics.",
                },
                {
                icon: <FaHandshake className="text-success fs-3" />,
                title: "Commission Automation",
                desc:
                    "Define payout rules and let the system auto-calculate earnings. Generate downloadable reports and process payments securely without manual errors.",
                },
            ].map((feature, i) => (
                <div className="col-md-4" key={i}>
                <div
                    className=" text-dark p-4 shadow-sm h-100 card-shimmer card-futuristic"
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

      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />
                  Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per module",
                    "Unlimited affiliates & campaigns",
                    "Includes all automation tools",
                    "Easy onboarding – no training needed",
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
                    "Businesses using influencer or referral models",
                    "Startups running affiliate campaigns",
                    "Marketing teams needing transparent tracking",
                    "Franchise chains or channel partners",
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

          {/* Coming Soon */}
          <div className="row mt-5">
            <div className="col">
              <div className="p-4 shadow-sm shimmer-bg rounded">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  These features are under active development:
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Affiliate Payout via UPI/Bank",
                    "Automated Tax Report Generation",
                    "Multi-language Affiliate Portal",
                    "White-labeled Dashboard Branding",
                    "Affiliate Leaderboards and Incentives",
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

export default AffiliateManagementSystem;
