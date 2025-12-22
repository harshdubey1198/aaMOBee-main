import React, { useEffect, useState } from "react";
import { FaUserTie, FaCalendarCheck, FaBuilding, FaBell, FaCheckCircle, FaRocket, FaRupeeSign, } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function Hrms() {
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
      <div
          className="d-flex flex-column justify-content-center align-items-center fade-section"
          style={{
            background: "linear-gradient(to right, #fefcea, #d5fefd)",
            textAlign: "center",
            marginTop: "80px",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          <h1 className="fw-bold display-5 mb-3">aaMOBee HRMS</h1>
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
          Your all-in-one <strong>Human Resource Management System</strong> to
          centralize employee data, automate HR tasks, track attendance, and simplify
          leave & role management — <span style={{ color: "#0077b6" }}>built for modern businesses</span>.
        </div>


  <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
    {/* <Link to="/choose-plan/signup" className="btn btn-danger px-4 py-2 fw-semibold">
      GET STARTED
    </Link> */}
    <span className="badge bg-primary d-flex align-items-center text-white fw-semibold px-4 py-2" style={{ fontSize: "1.1rem" , textAlign: "center"}}>
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

  {/* Glass Cards for Hero Value Props */}
  <div className="container">
  <div className="row g-4 justify-content-center">
    {[
      {
        title: "Automated HR Notifications",
        desc: "Receive instant alerts for birthdays, work anniversaries, new joiners, pending approvals, document expiries, and policy updates — so your HR never misses a beat.",
      },
      {
        title: "Smart Role & Department Mapping",
        desc: "Organize your workforce with custom departments and multi-role assignments. Build team hierarchies, reporting chains, and access rights in minutes.",
      },
      {
        title: "Secure Employee Document Vault",
        desc: "Upload and manage resumes, offer letters, ID proofs, contracts, and more in a centralized digital locker — encrypted, searchable, and always available.",
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


      <div className="py-5 fade-section" style={{ background:"linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)"}} >
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              {
                icon: <FaUserTie className="text-primary fs-3" />,
                title: "Employee Profiles",
                desc: "Centralized employee data including personal info, job roles, documents, and work history – all in one digital file."
              },
              {
                icon: <FaCalendarCheck className="text-success fs-3" />,
                title: "Attendance & Leave",
                desc: "Track punch-in/out, late marks, half-days. Approve or reject leave requests with full history and balance visibility."
              },
              {
                icon: <FaBuilding className="text-info fs-3" />,
                title: "Roles & Departments",
                desc: "Create roles and departments. Assign employees, manage teams, and streamline internal operations effortlessly."
              },
              {
                icon: <FaBell className="text-warning fs-3" />,
                title: "Automated Notifications",
                desc: "Auto alerts for birthdays, joining anniversaries, leave approvals, and compliance document reminders."
              },
            ].map((item, i) => (
              // <div className="col-md-6" key={i}>
              //   <div className="p-4 h-100 bg-white text-dark shadow-sm rounded card-shimmer card-futuristic" data-aos="fade-up" style={{
              //     borderRadius: "20px",
              //     transition: "transform 0.3s ease, box-shadow 0.3s ease",
              //   }}
              //   onMouseEnter={(e) => {
              //     e.currentTarget.style.boxShadow = "0 20px 30px rgba(0, 0, 0, 0.1)";
              //   }}
              //   onMouseLeave={(e) => {
              //     e.currentTarget.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.05)";
              //   }}>
              //     {item.icon}
              //     <h5 className="fw-bold mt-3">{item.title}</h5>
              //     <p className="text-muted">{item.desc}</p>
              //   </div>
              // </div>
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

      <div className="py-5 fade-section"
        style={{
          background: "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff"
        }}>
        <div className="container">
          <div className="text-center mb-5">
            <h3 className="fw-bold text-success">Why aaMOBee HRMS?</h3>
            <p className="text-light mt-3">
              Automate the routine and focus on what matters most — your people.
            </p>
          </div>
          <div className="row g-4">
            {[
              "Streamline hiring and onboarding with digital records",
              "Flexible attendance rules – daily or shift-based",
              "Custom leave policies and real-time balance tracking",
              "Role-wise data visibility and access management",
              "Self-service for employees: leave, documents, info",
              "Track performance and schedule appraisals (Coming Soon)"
            ].map((point, i) => (
              <div className="col-md-6 d-flex" key={i}>
                <FaCheckCircle className="text-success me-3 mt-1" />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-5" style={{ background: "#fff" }}>
        <div className="container fade-section">
          <div className="row mb-4 ">
            <div className="col-md-6 mt-2 mt-sm-0">
              <div className="p-4 shadow-sm rounded animated-bg h-100">
                <h5 className="text-success fw-bold mb-2">
                  <FaRupeeSign className="me-2" />
                  Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month per user",
                    "No setup fee or contract",
                    "Includes all HRMS features",
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
                    "Startups managing remote teams",
                    "SMEs with growing headcount",
                    "HR professionals needing digital HR tools",
                    "Organizations shifting from spreadsheets",
                    "Companies needing attendance + leave automation"
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
                  Upcoming HRMS upgrades (included in your plan)
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Performance Reviews & Appraisals",
                    "Asset Allocation Management",
                    "Payroll Integration",
                    "Training & Certification Tracking",
                    "Exit & Resignation Workflows"
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

export default Hrms;