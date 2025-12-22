import React, { useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaBookOpen,
  FaGraduationCap,
  FaClipboardCheck,
  FaCheckCircle,
  FaRocket,
  FaRupeeSign,
} from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function Lms() {
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
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">aaMOBee LMS</h1>
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
          A powerful Learning Management System to create, deliver, and monitor
          employee or student training with ease —{" "}
          <span style={{ color: "#0077b6" }}>designed for modern teams.</span>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
          <span
            className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2"
            style={{ fontSize: "1.1rem", textAlign: "center" }}
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

        {/* Feature Highlights */}
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[                
             {
                  title: "Advanced Course Management",
                  desc: "Easily upload videos, documents, and quizzes to build structured learning modules. Assign personalized learning paths, schedule course releases, and track user completion in real-time from a central dashboard.",
                },
                {
                  title: "Flexible User Roles & Access",
                  desc: "Define and manage multiple user roles like Admin, Trainer, and Learner. Set custom access rights, control content visibility, and streamline responsibilities across departments or teams.",
                },
                {
                  title: "Automated Certification System",
                  desc: "Boost learner motivation with auto-generated certificates upon course completion. Customize certificate templates with your branding, course details, and learner credentials—all in one click.",
                }              
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div
                  className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
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

      {/* Glassmorphism Feature Cards */}
      <div
        className="py-5 fade-section"
        style={{
          background:
            "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
        }}
      >
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
                {
                  icon: <FaChalkboardTeacher className="text-primary fs-3" />,
                  title: "Interactive Learning Modules",
                  desc: "Create rich learning experiences by combining video lectures, PDFs, slide decks, and interactive quizzes into a seamless course journey. Perfect for onboarding, training, or upskilling across departments.",
                },
                {
                  icon: <FaBookOpen className="text-warning fs-3" />,
                  title: "Real-Time Progress Tracking",
                  desc: "Track user progress at every step — know who’s learning, what they’ve completed, and where they’re stuck. Access detailed reports on lesson views, quiz attempts, scores, and completion rates.",
                },
                {
                  icon: <FaGraduationCap className="text-success fs-3" />,
                  title: "Smart Certification Engine",
                  desc: "Auto-generate personalized certificates upon course completion — with your logo, user name, date, and unique certificate ID. Encourage participation and reward learning milestones instantly.",
                },
                {
                  icon: <FaClipboardCheck className="text-info fs-3" />,
                  title: "Multi-Role Access Control",
                  desc: "Assign access levels to learners, trainers, and admins. Each role gets a tailored interface — learners see their courses, trainers track performance, and admins manage the system effortlessly.",
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
                    e.currentTarget.style.boxShadow =
                      "0 20px 30px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px rgba(0, 0, 0, 0.05)";
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
      <div
        className="py-5 fade-section"
        style={{
          background:
            "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-success">Why aaMOBee LMS?</h3>
            <p className="text-light mt-3">
              Empower your team to learn, grow, and stay certified from anywhere.
            </p>
          </div>
          <div className="row g-4">
            {[
              "Train new employees faster and consistently",
              "Provide self-paced learning for remote teams",
              "Create custom courses tailored to roles",
              "Track learner progress and analytics",
              "Maintain compliance with mandatory learning",
              "Certify & validate learning outcomes",
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
                  <FaRupeeSign className="me-2" />
                  Just ₹125/month per user
                </h5>
                <ul className="list-unstyled">
                  {[
                    "Includes all LMS features",
                    "No setup or onboarding charges",
                    "Instant setup in minutes",
                    "Use standalone or bundle with HRMS & CRM",
                    "Cancel anytime – no commitments",
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
                <h5 className="text-warning fw-bold mb-3">👥 Who Should Use LMS?</h5>
                <ul className="list-unstyled">
                  {[
                    "HR teams onboarding new hires",
                    "Coaching centers & training firms",
                    "Startups scaling internal skill dev",
                    "Remote-first teams enabling self-paced learning",
                    "Companies needing learning compliance",
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
                  New updates included in your plan
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Gamification (badges, points)",
                    "Zoom integration for live classes",
                    "Interactive quizzes and scoring",
                    "Feedback system for trainers",
                    "Multi-language support",
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

export default Lms;
