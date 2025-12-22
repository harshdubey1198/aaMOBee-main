import React, { useEffect, useState } from "react";
import { FaChartLine, FaCheckCircle, FaCogs, FaPlug, FaRocket, FaRupeeSign } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function CMS() {
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
          background: "linear-gradient(to right, #fefcea, #e0f7fa)",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}>
        <h1 className="fw-bold display-5 mb-3">aaMOBee CMS</h1>
        <div className="glass-highlight p-3 px-4 mb-4" style={{
          maxWidth: "800px",
          background: "rgba(255, 255, 255, 0.35)",
          borderRadius: "16px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#2c3e50",
          fontWeight: 500,
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
          fontSize: "1.1rem"
        }}>
          A smart, flexible <strong>Content Management System</strong> to manage, publish, and organize your digital content across web, mobile, and internal apps — <span style={{ color: "#0077b6" }}>without code</span>.
        </div>

        <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
          <span className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2" style={{ fontSize: "1.1rem" }}>
            Coming Soon
          </span>
          <a className="btn btn-outline-primary px-4 py-2 fw-semibold"
            onClick={(e) => {
              e.preventDefault();
              setTriggeredExternally(true);
              setTimeout(() => setTriggeredExternally(false), 500);
            }}>Explore Products</a>
        </div>

        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                title: "Dynamic Content Blocks",
                desc: "Create reusable components like banners, FAQs, testimonials with zero coding. Update live content instantly.",
              },
              {
                title: "Team Publishing Control",
                desc: "Set who can publish, review or draft. Collaborate with content writers, marketers and designers easily.",
              },
              {
                title: "Centralized Media Vault",
                desc: "Upload, tag and reuse images, videos, documents in one centralized secure storage system.",
              },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#333",
                  }}>
                  <h6 className="fw-bold mb-2">{item.title}</h6>
                  <p className="mb-0 text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-5 fade-section" style={{
        background: "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
        color: "#fff"
      }}>
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-success">Why aaMOBee CMS?</h3>
            <p className="text-light mt-3">Empower your teams to build, manage and deploy content without tech bottlenecks.</p>
          </div>
          <div className="row g-4">
            {[
              "No-code page and section builder",
              "Real-time content updates",
              "Tagging, scheduling and role-based publishing",
              "Perfect for websites, internal portals & microservices",
              "Works seamlessly with your CRM, HRMS or LMS",
              "API-ready for developers to fetch content dynamically",
            ].map((point, i) => (
              <div className="col-md-6 d-flex" key={i}>
                <FaCheckCircle className="text-success me-3 mt-1" />
                <p>{point}</p>
              </div>
            ))}
          </div>
          <div className="row g-4 justify-content-center fade-section">
              {[
                {
                  icon: <FaCogs className="text-warning fs-3" />,
                  title: "Dynamic Content Editor",
                  desc:
                    "Create and manage rich text, images, videos, and dynamic widgets using a drag-and-drop interface. Perfect for updating landing pages, blogs, banners, and more without needing a developer.",
                },
                {
                  icon: <FaChartLine className="text-success fs-3" />,
                  title: "SEO & Meta Controls",
                  desc:
                    "Boost your online presence with built-in SEO tools. Add meta titles, descriptions, and alt tags, plus manage slugs and sitemaps—all from a single, easy-to-use panel.",
                },
                {
                  icon: <FaPlug className="text-danger fs-3" />,
                  title: "Role-Based Publishing",
                  desc:
                    "Control who can edit, review, or publish content with smart access roles. Set up approval workflows to ensure brand consistency and avoid accidental updates.",
                },
              ].map((feature, i) => (
                <div className="col-md-4" key={i}>
                  <div
                    className="bg-white text-dark p-4 shadow-sm h-100 card-shimmer card-futuristic"
                    style={{
                      borderRadius: "20px",
                      transition: "transform 0.3s ease, boxShadow 0.3s ease",
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

      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row mb-4">
            <div className="col-md-6 mt-2 mt-sm-0">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2"><FaRupeeSign className="me-2" />Simple Pricing</h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per admin user",
                    "No setup fee or contracts",
                    "Includes all CMS features",
                    "Instant setup in under 5 minutes",
                    "Cancel anytime — no strings attached"
                  ].map((item, i) => (
                    <li key={i} className="mb-2 d-flex align-items-start">
                      <FaCheckCircle className="text-success me-2 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6 mt-2 mt-sm-0">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-warning fw-bold mb-3">👤 Who Should Use This?</h5>
                <ul className="list-unstyled">
                  {[
                    "Agencies managing multiple websites",
                    "Startups publishing content regularly",
                    "Teams with non-tech editors",
                    "Businesses needing modular control",
                    "Organizations using React/Node needing headless CMS"
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
                <h5 className="text-info fw-bold mb-1"><FaRocket className="me-2" /> Coming Soon</h5>
                <small className="text-muted mb-3 d-block">Future upgrades included in your plan</small>
                <ul className="row list-unstyled">
                  {[
                    "Version control & rollback",
                    "Multi-language support",
                    "AI-assisted content writing",
                    "SEO optimization tools",
                    "Drag-drop layout designer",
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

export default CMS;
