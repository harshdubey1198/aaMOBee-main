import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaRupeeSign, FaRocket, FaUserTie, FaEnvelopeOpenText, FaBalanceScale, FaCogs } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function PayrollManagement() {
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

      <div className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #d5fefd)",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">aaMOBee Payroll Management</h1>
        <div className="glass-highlight p-3 px-4 mb-5"
          style={{
            maxWidth: "800px",
            background: "rgba(255, 255, 255, 0.35)",
            borderRadius: "16px",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "#2c3e50",
            fontWeight: 500,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
            fontSize: "1.1rem",
          }}>
          Automate salary processing, generate payslips, and ensure compliance — <strong>all from a single dashboard</strong>. Built for HRs, accountants & founders.
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
                title: "Salary Structure Setup",
                desc: "Customize pay components like basic, HRA, PF, and ESI for each role or department.",
              },
              {
                title: "Auto Salary Generation",
                desc: "Set rules and let the system calculate net salaries for every employee each month.",
              },
              {
                title: "Tax and Deduction Management",
                desc: "Define deductions like TDS, PF, ESI and let aaMOBee handle the math—accurate and fast.",
              },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
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

      <div className="py-5 fade-section"
        style={{
          background: "linear-gradient(185deg, #013c6a 0%, #03031a 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff"
        }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                icon: <FaEnvelopeOpenText className="text-success fs-3" />,
                title: "Payslip Generation",
                desc: "Automatically generate PDF payslips for all employees. Download or send via email in one click.",
              },
              {
                icon: <FaBalanceScale className="text-warning fs-3" />,
                title: "Month-End Summary",
                desc: "Get consolidated reports of salary distribution, taxes, and pending payouts instantly.",
              },
              {
                icon: <FaCogs className="text-info fs-3" />,
                title: "Customizable Deductions",
                desc: "Tweak PF, gratuity, or bonus settings to suit your company policy — no dev needed.",
              },
            ].map((item, i) => (
              <div className="col-md-6" key={i}>
                <div className="bg-white text-dark p-4 shadow-sm h-100 card-shimmer card-futuristic"
                  style={{
                    borderRadius: "20px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}>
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

      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row mb-4">
            <div className="col-md-6 mt-2 mt-sm-0">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" /> Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per employee",
                    "Includes payslips + salary automation",
                    "No setup fees or hidden charges",
                    "Add/remove users any time",
                    "Cancel anytime — no lock-ins",
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
                <h5 className="text-warning fw-bold mb-3">👤 Who Needs It?</h5>
                <ul className="list-unstyled">
                  {[
                    "Startups paying monthly salaries",
                    "SMEs with manual payroll headaches",
                    "HRs managing 5 to 500 staff",
                    "Accountants needing auto-payslip & tax reports",
                    "Companies transitioning from Excel-based salary",
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
                  New features in pipeline – included in your subscription
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Full & Final Settlement Generator",
                    "Loan & Advance Management",
                    "Statutory Compliance Reports (PF/ESI)",
                    "Payroll Calendar View",
                    "Salary Arrears Adjustments",
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

export default PayrollManagement;
