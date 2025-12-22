import React, { useEffect, useState } from "react";
import { FaFileInvoiceDollar, FaBalanceScale, FaReceipt, FaRupeeSign, FaCheckCircle, FaRocket, } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";

gsap.registerPlugin(ScrollTrigger);

function BookKeeping() {
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
        <h1 className="fw-bold display-5 mb-3">aaMOBee Bookkeeping</h1>
        <div className="glass-highlight p-3 px-4 mb-4"
          style={{
            maxWidth: "850px",
            background: "rgba(255, 255, 255, 0.35)",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#2c3e50",
            fontWeight: 500,
            fontSize: "1.1rem",
          }}>
          Record and manage your business finances with ease. Track income, expenses, and financial health with complete accuracy—perfect for business owners and accountants alike.
        </div>

        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <span className="badge bg-primary text-white fw-semibold px-4 py-2" style={{ fontSize: "1.1rem" }}>Coming Soon</span>
          <a className="btn btn-outline-primary px-4 py-2 fw-semibold"  onClick={(e) => { e.preventDefault(); setTriggeredExternally(true);  setTimeout(() => setTriggeredExternally(false), 500); }}>
            Explore More Products
          </a>
        </div>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                icon: <FaFileInvoiceDollar className="text-primary fs-3 mb-3" />,
                title: "Auto-Link to Invoices",
                desc: "Every invoice and payment entry gets auto-recorded in your books, so nothing slips through the cracks.",
              },
              {
                icon: <FaBalanceScale className="text-success fs-3 mb-3" />,
                title: "Trial Balance & Reconciliation",
                desc: "Effortlessly reconcile accounts and generate accurate trial balances to ensure financial integrity.",
              },
              {
                icon: <FaReceipt className="text-warning fs-3 mb-3" />,
                title: "Ledger & Reports",
                desc: "Maintain clean ledgers, generate profit-loss, and balance sheet reports—ready for audits or investor reviews.",
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
                    transition: "transform 0.3s ease, boxShadow 0.3s ease",
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

      <div className="py-5 fade-section"
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "linear-gradient(185deg,#013c6a 0%, #03031a 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}>
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "What It Does",
                points: [
                  "Record every income and expense manually or automatically",
                  "Auto-capture invoices and receipts",
                  "Maintain clean ledgers and transaction trails",
                  "Run audit-ready reports like P&L, Balance Sheet",
                  "Assist with monthly and annual closing",
                ],
                iconColor: "success",
              },
              {
                title: "For Accountants & Owners",
                desc: "Whether you’re managing your books solo or have a professional CA on board, aaMOBee makes bookkeeping effortless. Grant role-based access, automate recurring entries, and export reports in seconds.",
                iconColor: "info",
              },
            ].map((block, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}>
                  <h5 className={`fw-bold mb-3 text-${block.iconColor}`}>✅ {block.title}</h5>
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

          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />
                  Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per module",
                    "All standard features included",
                    "Role-based access for teams",
                    "Quick setup – start instantly",
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
                    "Business owners managing finances manually",
                    "Accountants and CA firms",
                    "Startups needing audit-ready reports",
                    "Retail or service businesses",
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

          {/* Coming Soon Block */}
          <div className="row mb-5">
            <div className="col">
              <div className="p-4 shadow-sm shimmer-bg rounded">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  These upcoming features will be added at no extra cost:
                </small>
                <ul className="row list-unstyled">
                  {[
                    "GST-ready ledgers and reports",
                    "CA access with read-only audit view",
                    "Advanced reconciliation tools",
                    "Cash Flow Forecasting Dashboard",
                    "Multi-currency Bookkeeping",
                  ].map((item, i) => (
                    <li key={i} className="col-md-6 mb-2 text-black d-flex align-items-start">
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

export default BookKeeping;
