import React, { useEffect, useState } from "react";
import { FaLightbulb, FaTasks, FaClipboardList, FaChartBar, FaUsers, FaChartLine, FaCheckCircle, FaRocket, FaRupeeSign, } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function ProductManagement() {
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
        textAlign: "center",
        marginTop: "80px",
        minHeight: "100vh",
        padding: "4rem 1rem",
      }}
    >
      <h1 className="fw-bold display-5 mb-3">aaMOBee Product Management</h1>
      <div
        className="glass-highlight p-3 px-4 mb-5"
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
        }}
      >
        Plan, assign, and track product or project work across your team with full
        visibility and control — all inside aaMOBee.
      </div>

      <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
        <span
          className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2"
          style={{ fontSize: "1.1rem" }}
        >
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
          Explore Products
        </a>
      </div>

      {/* Cards Section */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {[
            {
              icon: <FaTasks className="text-success fs-3" />,
              title: "Task Planning & Assignment",
              desc:
                "Create tasks, assign owners, set deadlines and define subtasks. All team activity stays in sync.",
            },
            {
              icon: <FaClipboardList className="text-primary fs-3" />,
              title: "Project Milestones",
              desc:
                "Break large projects into milestones, monitor timelines, and track progress effortlessly.",
            },
            {
              icon: <FaChartBar className="text-danger fs-3" />,
              title: "Performance Dashboard",
              desc:
                "Analyze project metrics, resource usage, and completion rates through clean visual dashboards.",
            },
          ].map((card, i) => (
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
                  {card.icon}
                  <h6 className="fw-bold mt-3 text-black">{card.title}</h6>
                  <p className="text-muted">{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      <div
        className="py-5 fade-section"
        style={{
          background:
            "linear-gradient(185deg, rgb(1, 60, 106) 0%, rgb(3, 3, 26) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "What It Does",
                points: [
                  "Create and assign product or project-based tasks",
                  "Set timelines, priorities, and deadlines",
                  "Visualize overall progress at every stage",
                  "Facilitate team communication and updates",
                  "Keep everything aligned toward milestones",
                ],
                iconColor: "success",
              },
              {
                title: "Live Progress Tracking",
                desc:
                  "Track progress, tasks, delays, and contributions from one unified dashboard. Keep your team accountable, projects on time, and goals measurable—real-time and on any device.",
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

          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                icon: <FaClipboardList className="text-warning fs-3" />,
                title: "Task Creation & Assignment",
                desc:
                  "Break down product goals into tasks, assign them to team members, and track them with deadlines and comments.",
              },
              {
                icon: <FaChartLine className="text-info fs-3" />,
                title: "Project Timeline Views",
                desc:
                  "Gantt-style or list views of timelines help teams plan, avoid bottlenecks, and maintain clarity on priorities.",
              },
              {
                icon: <FaUsers className="text-success fs-3" />,
                title: "Team Collaboration Tools",
                desc:
                  "Enable chat threads, real-time updates, and shared notes to boost coordination across departments.",
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
                    <h6 className="fw-bold mt-3 text-black">
                      {feature.title}
                    </h6>
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
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />
                  Transparent Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per user",
                    "All project features included",
                    "No contracts or installation fees",
                    "Instant access — zero setup time",
                    "Cancel anytime — no hidden charges",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="mb-2 d-flex align-items-start"
                    >
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
                    "Startups building digital products",
                    "Marketing or creative agencies",
                    "SaaS or software development teams",
                    "Operations teams handling daily projects",
                    "Managers overseeing multi-phase projects",
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
                  Future upgrades included in your subscription
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Kanban Boards & Drag-n-Drop UI",
                    "Burndown Charts & Analytics",
                    "Recurring Tasks & Templates",
                    "Project Budget & Resource Planning",
                    "Client-specific task views",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="col-md-6 mb-2 d-flex align-items-start"
                    >
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

export default ProductManagement;
