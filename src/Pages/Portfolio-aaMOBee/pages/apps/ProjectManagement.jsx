import React, { useEffect, useState } from "react";
import { FaTasks, FaUsers, FaClock, FaChartLine, FaCheckCircle, FaRocket, FaRupeeSign } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function ProjectManagement() {
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
            background: "linear-gradient(to right, #fff0f0, #d6e4ff)",
            textAlign: "center",
            marginTop: "80px",
            minHeight: "calc(100vh - 80px)",
          }}>
          <h1 className="fw-bold display-5 mb-3">aaMOBee Project Management</h1>

          <div className="glass-highlight p-3 px-4 mb-5"
            style={{
              maxWidth: "850px",
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
            Plan, assign, and track team efforts — from simple tasks to complex projects — <span style={{ color: "#0077b6" }}>everything in one intuitive space</span>.
          </div>

          <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
            <span className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2"
              style={{ fontSize: "1.1rem" }}>
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

          {/* Interactive Mini Cards */}
          <div className="container">
            <div className="row g-4 justify-content-center">
              {[
                  {
                    title: "Task Assignment",
                    desc: "Break down projects into clear, manageable tasks. Assign responsibilities to team members with due dates, checklists, attachments, and status labels. Get full visibility on who's doing what, avoid overlaps, and ensure accountability at every level of your project.",
                  },
                  {
                    title: "Kanban View",
                    desc: "Organize your workflow visually with interactive Kanban boards. Drag and drop tasks between stages like 'To Do', 'In Progress', and 'Completed'. Customize columns to match your process, prioritize tasks, and spot bottlenecks instantly—all in one glance.",
                  },
                  {
                    title: "Timeline Tracking",
                    desc: "Map your entire project lifecycle with Gantt-style timelines. Track task durations, set dependencies, and identify overlaps or delays. Make proactive decisions by monitoring project milestones, resource allocation, and delivery timelines in real-time.",
                  } 
              ].map((card, idx) => (
                <div className="col-md-4" key={idx}>
                  <div
                    className="p-4 h-100 shadow-sm glass-card"
                    style={{
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.3)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
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
                    }}
                  >
                    <h6 className="fw-bold mb-2">{card.title}</h6>
                    <p className="mb-0 text-muted">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


      {/* What it Does & Real-Time Section */}
      <div className="py-5 fade-section"
        style={{
          minHeight: "calc(100vh - 80px)",
          background: "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}>
        <div className="container">
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "What It Does",
                points: [
                  "Create tasks and assign team members",
                  "Define project milestones",
                  "Visualize timelines and dependencies",
                  "Enable real-time team updates",
                  "Generate productivity and delay reports",
                ],
                iconColor: "success",
              },
              {
                title: "Track Everything In Real-Time",
                desc: "Whether you're managing marketing campaigns or IT sprints — track status, assign roles, update timelines, and monitor progress collaboratively. All updates reflect instantly across the board for maximum visibility.",
                iconColor: "info",
              },
            ].map((block, idx) => (
              <div className="col-md-6" key={idx}>
                <div className="p-4 h-100 shadow-sm" style={{
                  borderRadius: "20px",
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
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

          {/* Feature Cards */}
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                icon: <FaTasks className="text-primary fs-3" />,
                title: "Collaborative Task Management",
                desc: "Create and assign tasks to individuals or teams. Add descriptions, deadlines, and track every update from a unified view.",
              },
              {
                icon: <FaClock className="text-warning fs-3" />,
                title: "Timeline Visuals",
                desc: "Visualize timelines with interactive progress charts. Spot delays, overlaps, and stay on track effortlessly.",
              },
              {
                icon: <FaChartLine className="text-danger fs-3" />,
                title: "Milestones & Insights",
                desc: "Break big goals into milestones. Track status, generate reports, and ensure nothing slips through.",
              },
            ].map((feature, i) => (
              <div className="col-md-4" key={i}>
                <div className="bg-white text-dark p-4 shadow-sm h-100 card-shimmer card-futuristic" style={{
                  borderRadius: "20px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 20px 30px rgba(0, 0, 0, 0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.05)"}
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

      {/* Pricing & Target Section */}
      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row mb-4 gap-sm-2 gap-md-0">
            <div className="col-md-6 mt-2 mt-sm-0">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />
                  Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per user",
                    "No setup or maintenance charges",
                    "Access to all project tools",
                    "Quick setup within 2 mins",
                    "Cancel anytime — no lock-ins"
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
                <h5 className="text-warning fw-bold mb-3">👥 Who Should Use This?</h5>
                <ul className="list-unstyled">
                  {[
                    "Teams managing multiple projects",
                    "Product startups and dev agencies",
                    "Project leads and task managers",
                    "Marketing or design coordination teams",
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
                <small className="text-muted mb-3 d-block">
                  Future updates included in your subscription
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Gantt Chart Integration",
                    "Drag & Drop Task Board",
                    "Time Estimation Tools",
                    "Client View Dashboard",
                    "Auto Reminders & Escalation Flow",
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

export default ProjectManagement;
