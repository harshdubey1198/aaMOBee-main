import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCalendarAlt, FaUserClock, FaClipboardList, FaCogs, FaRocket, FaRupeeSign, FaListAlt, FaBalanceScaleLeft, FaCalendarCheck, FaUsers, } from "react-icons/fa";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function LeaveManagement() {
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

      <div className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #e0f7fa)",
          padding: "6rem 1rem 3rem",
          marginTop: "80px",
          textAlign: "center",
          minHeight: "calc(100vh - 80px)",
        }}>
        <h1 className="fw-bold display-5 mb-3">Leave Management</h1>
        <p className="lead text-muted mb-4">
          Empower teams with smooth, automated leave tracking – from request to approval.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap mb-5">
          <span className="badge bg-primary text-white fw-semibold px-4 py-2 fs-6">Coming Soon</span>
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

        {/* Mini Cards */}
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                  icon: <FaCalendarAlt className="text-primary fs-3 mb-3" />,
                  title: "Apply & Approve",
                  desc: "Employees can apply for leave through a self-service portal. Managers get real-time notifications and can approve or reject requests with one click. No paperwork, no follow-ups — it's fast, clear, and fully trackable.",
                },
                {
                  icon: <FaBalanceScaleLeft className="text-success fs-3 mb-3" />,
                  title: "Track Balances",
                  desc: "HR and employees can view accurate leave balances at any time. See earned leaves, pending approvals, used leaves, and carry-forwards — all auto-calculated and visible in a clean dashboard.",
                },
                {
                  icon: <FaListAlt className="text-warning fs-3 mb-3" />,
                  title: "Custom Leave Types",
                  desc: "Define your own leave types like Casual Leave, Sick Leave, Earned Leave, Maternity, or Work From Home. Assign limits, approval rules, and holidays per policy — flexible for every organization.",
                },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
                    color: "#333",
                  }}>
                  <div className="d-flex flex-column align-items-center text-center">
                    {item.icon}
                    <h6 className="fw-bold mb-2">{item.title}</h6>
                    <p className="mb-0 text-muted">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What It Does */}
      <div className="py-5 fade-section" style={{
        background: "linear-gradient(185deg, #013c6a 0%, #03031a 35%, #03181c 100%)",
        color: "#fff"
      }}>
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "What It Does",
                points: [
                  "Employees request leave online or via app",
                  "Managers approve/reject with reasons",
                  "Leave balances updated in real time",
                  "Supports full-day, half-day, or hourly leaves",
                  "Automated holiday calendars & leave rules"
                ],
                iconColor: "success"
              },
              {
                title: "Real-Time Sync",
                desc: "Leaves auto-sync across HR dashboard, payroll, and calendars. Managers see who’s on leave instantly and plan better.",
                iconColor: "info"
              }
            ].map((block, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff",
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

          <div className="row g-4 justify-content-center fade-section">
              {[
                {
                  icon: <FaCalendarCheck className="text-primary fs-3" />,
                  title: "One-Click Leave Requests",
                  desc:
                    "Let employees submit leave requests quickly with custom dates, reasons, and file attachments. Managers receive real-time alerts for easy approval or rejection with full history logging.",
                },
                {
                  icon: <FaUsers className="text-success fs-3" />,
                  title: "Role-Based Visibility",
                  desc:
                    "Configure visibility for employees, managers, and HR. While staff see personal leave history and balance, managers view team availability to avoid scheduling conflicts.",
                },
                {
                  icon: <FaListAlt className="text-warning fs-3" />,
                  title: "Policy Management & Automation",
                  desc:
                    "Define leave types like CL, SL, EL, or Work From Home. Automate accruals, carry forwards, lapses, and holiday exclusions. Make compliance effortless across regions or departments.",
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

      {/* Pricing & Audience */}
      <div className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container fade-section">
          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <div className="p-4 shadow-sm h-100 animated-bg"
                style={{
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#000"
                }}>
                <h5 className="fw-bold text-success mb-1">
                  <FaRupeeSign className="me-2" />
                  ₹125/month – Simple Pricing
                </h5>
                <ul className="list-unstyled mt-3">
                  {[
                    "Flat pricing per module – No hidden fees",
                    "All features included – No tiers",
                    "Add or remove anytime",
                    "Works on mobile & desktop",
                    "No contracts – cancel anytime"
                  ].map((line, i) => (
                    <li key={i} className="mb-2 d-flex align-items-start">
                      <FaCheckCircle className="text-success me-2 mt-1" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 shadow-sm h-100 animated-bg"
                style={{
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#000"
                }}>
                <h5 className="text-warning fw-bold mb-3">👤 Who Is It For?</h5>
                <ul className="list-unstyled">
                  {[
                    "Startups with growing teams",
                    "HRs managing remote staff",
                    "SMEs shifting from manual records",
                    "Companies with complex leave rules",
                    "Organizations wanting HR automation"
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
              <div className="p-4 shadow-sm shimmer-bg">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  Future upgrades to enhance your leave workflow — included free!
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Leave encashment tracking",
                    "Multi-level approval workflows",
                    "Mobile leave request reminders",
                    "Geo-tagged leave applications",
                    "Leave analytics & reports"
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

export default LeaveManagement;