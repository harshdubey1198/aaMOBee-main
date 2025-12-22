import React, { useEffect, useState } from "react";
import { FaWallet, FaTags, FaFileInvoice, FaRupeeSign, FaChartPie, FaCheckCircle, FaRocket } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function ExpenseTracker() {
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
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} triggeredExternally={triggeredExternally} />

      {/* Hero Section */}
      <div
        className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #d5fefd)",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">aaMOBee Expense Tracker</h1>
        <div
          className="glass-highlight p-3 px-4 mb-4"
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
          Track every rupee—know where your money goes. Monitor bills, salaries, rent, subscriptions, and analyze your financial flow with clarity.
        </div>

        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <span className="badge bg-primary text-white fw-semibold px-4 py-2" style={{ fontSize: "1.1rem" }}>Coming Soon</span>
          <a
            className="btn btn-outline-primary px-4 py-2 fw-semibold"
            onClick={(e) => {
              e.preventDefault();
              setTriggeredExternally(true);
              setTimeout(() => setTriggeredExternally(false), 500);
            }}
          >
            Explore Products
          </a>
        </div>

        {/* Mini Glass Cards */}
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                title: "Smart Expense Entry",
                desc: "Record office, utility, staff or one-off expenses in seconds.",
              },
              {
                title: "Attach Receipts & Bills",
                desc: "Upload files, photos or PDFs to any entry for record-keeping.",
              },
              {
                title: "Custom Tags & Categories",
                desc: "Label expenses by department, vendor or purpose.",
              },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div
                  className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#333",
                  }}
                >
                  <h6 className="fw-bold mb-2">{item.title}</h6>
                  <p className="mb-0 text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="py-5 fade-section" style={{ background: "linear-gradient(185deg, rgb(1,60,106) 0%, rgb(3,3,26) 35%, rgba(3,24,28,0.63) 100%)", color: "#fff" }}>
        <div className="container">
          <div className="row g-4">
            {[
              {
                icon: <FaWallet className="text-warning fs-3" />,
                title: "Track All Expenses",
                desc: "Record any spending—rent, marketing, subscriptions, fuel, supplies, and more.",
              },
              {
                icon: <FaTags className="text-success fs-3" />,
                title: "Categories & Tags",
                desc: "Use tags like marketing, admin, team, utilities to group and filter expenses.",
              },
              {
                icon: <FaFileInvoice className="text-danger fs-3" />,
                title: "Upload Receipts",
                desc: "Attach invoice copies, photos, or PDF bills with each entry.",
              },
              {
                icon: <FaChartPie className="text-info fs-3" />,
                title: "Visual Reports",
                desc: "Generate monthly reports, category-wise charts, and export statements.",
              },
            ].map((item, i) => (
              <div className="col-md-6" key={i}>
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
                  {item.icon}
                  <h6 className="fw-bold mt-3 text-black">{item.title}</h6>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-5 fade-section" style={{ background: "#f0f2f5" }}>
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-primary">Why Choose aaMOBee Expense Tracker?</h3>
            <p className="text-muted">Clarity, control and compliance—all in one simple tool.</p>
          </div>
          <div className="row g-4">
            {[
              "Capture every rupee spent—no more Excel errors",
              "Set spending limits for projects or departments",
              "Get insights by time, category, or user",
              "Upload and retrieve receipts in one click",
              "Improve budget discipline across your team",
              "Export reports for accounting and audits"
            ].map((point, i) => (
              <div className="col-md-6 d-flex" key={i}>
                <FaCheckCircle className="text-success me-3 mt-1" />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & Audience */}
      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row mb-4 ">
            <div className="col-md-6 mt-2 mt-sm-0">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />Transparent Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per user",
                    "Includes all expense features",
                    "No setup or hidden fees",
                    "Free updates forever",
                    "Cancel anytime"
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
                <h5 className="text-warning fw-bold mb-3">👥 Perfect For</h5>
                <ul className="list-unstyled">
                  {[
                    "Startups watching cash flow",
                    "SMEs needing basic expense tracking",
                    "Remote teams logging monthly spends",
                    "Teams managing field reimbursements",
                    "Anyone who wants expense clarity"
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
          <div className="row mb-5">
            <div className="col">
              <div className="p-4 shadow-sm shimmer-bg rounded">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">Planned upgrades (included for free):</small>
                <ul className="row list-unstyled">
                  {[
                    "Approval workflows for expenses",
                    "Petty cash management",
                    "Vendor-wise expense charts",
                    "Recurring expense templates",
                    "GST tagging & export to accounting tools"
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

export default ExpenseTracker;
