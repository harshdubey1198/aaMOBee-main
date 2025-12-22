import React, { useEffect, useState } from "react";
import {
  FaCogs,
  FaProjectDiagram,
  FaUsers,
  FaChartPie,
  FaCheckCircle,
  FaRocket,
  FaRupeeSign,
    FaBoxOpen,
    FaPlug,
} from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function ERPModule() {
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
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">aaMOBee ERP</h1>
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

     <div
             className="py-5 fade-section"
             style={{
               minHeight: "calc(100vh - 80px)",
               background:
                 "linear-gradient(185deg,rgb(1, 60, 106) 0%, rgba(3, 3, 26, 1) 35%, rgba(3, 24, 28, 0.63) 100%)",
               color: "#fff",
             }}
           >
             <div className="container">
               {/* What It Does + Real-Time Tracking */}
               <div className="row g-4 justify-content-center mb-5">
                 {[
                   {
                    title: "What It Does",
                    iconColor: "success",
                    points: [
                      "Manage departments, roles, and multi-level workflows",
                      "Unify HR, finance, operations, and sales into one platform",
                      "Automate inter-departmental data sync",
                      "Enable smarter decisions with unified analytics",
                      "Track performance, tasks, and team milestones",
                    ],
                  },
                  {
                    title: "Real-Time Control",
                    iconColor: "info",
                    desc:
                      "With live data updates across your departments, you’ll never have to guess again. Whether it's finance figures, HR data, or sales metrics, get instant visibility and control with centralized dashboards and dynamic reports. ERP eliminates silos and brings total organizational alignment.",
                  }
                  
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
     
               {/* Feature Cards Section */}
               <div className="row g-4 justify-content-center fade-section">
                 {[
                    {
                        icon: <FaChartPie className="text-warning fs-3" />,
                        title: "Unified Dashboard",
                        desc: "Bring sales, HR, operations, and finance into one cohesive interface. View trends, KPIs, and alerts in real-time for smarter decision making."
                    },
                    {
                        icon: <FaCogs className="text-secondary fs-3" />,
                        title: "Module Interlinking",
                        desc: "ERP isn't just software—it's a system. Payroll affects accounting. Sales update inventory. Every module is interconnected for effortless sync."
                    },
                    {
                        icon: <FaProjectDiagram className="text-danger fs-3" />,
                        title: "Process Automation",
                        desc: "Automate repetitive tasks: from salary processing and billing approvals to inventory alerts and leave workflows—ERP handles it all."
                    }
                    ]
                .map((feature, i) => (
                   <div className="col-md-4" key={i}>
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
     
           <div className="py-5" style={{ background: "#f0f2f5" }}>
                <div className="container fade-section">
                    <div className="row mb-5">
                    <div className="col">
                        <div
                        className="p-4 shadow-sm h-100 d-flex flex-column align-items-center text-center"
                        style={{
                            background: "linear-gradient(135deg, #ffffff, #e6f7f1)",
                            borderRadius: "16px",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#000",
                        }}
                        >
                        <div className="mb-3" style={{ width: "100px", height: "100px" }}>
                            <svg
                            width="100"
                            height="100"
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <rect width="200" height="200" rx="24" fill="#F0F4FF" />
                            <circle cx="100" cy="100" r="60" fill="#E0ECFF" />
                            <g fill="#4A90E2">
                                <path d="M60 85h15v30H60z" />
                                <path d="M85 70h15v45H85z" />
                                <path d="M110 60h15v55h-15z" />
                                <path d="M135 75h15v40h-15z" />
                            </g>
                            <circle cx="100" cy="40" r="10" fill="#4A90E2" />
                            <text
                                x="50%"
                                y="180"
                                textAnchor="middle"
                                fill="#4A4A4A"
                                fontFamily="Arial"
                                fontSize="12"
                            >
                                Built for Complex Organizations
                            </text>
                            </svg>
                        </div>

                        <h5 className="fw-bold text-primary mb-3">
                            🏢 Enterprise-Ready Compatibility
                        </h5>
                        <p className="mb-4">
                            Whether you're running finance, HR, sales, or supply chain—aaMOBee ERP adapts to your structure.
                        </p>
                        <p className="mt-3 text-muted">
                            From centralized control for multi-department teams to real-time collaboration across branches, our ERP is designed for complex, growing, and distributed organizations. Automate, analyze, and align.
                        </p>

                        <p className="fw-semibold text-secondary mt-4 mb-2">
                            Perfect For:
                        </p>
                        <ul className="row list-unstyled w-100 px-3">
                            {[
                            "🏢 Large Enterprises – unify departments and data",
                            "💼 Consulting Firms – manage billing, clients, and payroll",
                            "🏥 Healthcare – integrate finance, HR & operations",
                            "🏭 Manufacturing – align production, inventory & sales",
                            "🏨 Hospitality – HR, procurement & facility ops in one place",
                            "🎓 Education – sync academics, staff, and finance units",
                            "🔧 Logistics – centralize invoicing, teams, and vendor ops",
                            "📦 Warehousing – control stock + HR + accounts",
                            "🌐 Multi-branch Businesses – full transparency, real-time",
                            ].map((industry, i) => (
                            <li key={i} className="col-md-6 mb-2 d-flex align-items-start">
                                <FaCheckCircle className="me-2 text-success mt-1" />
                                <span>{industry}</span>
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                    </div>

                    <div className="row g-4 mb-5">
                    {/* Pricing Block */}
                    <div className="col-md-6">
                        <div
                        className="p-4 shadow-sm h-100 animated-bg"
                        style={{
                            borderRadius: "16px",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#000",
                        }}
                        >
                        <h5 className="fw-bold text-success mb-1">
                            <FaRupeeSign className="me-2" />
                            ₹125/User – Enterprise Access
                        </h5>
                        <small className="text-muted">
                            Flexible pricing for growing businesses and multi-department teams.
                        </small>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                            <FaCheckCircle className="text-success me-2" />
                            ₹125/month per user – all features included
                            </li>
                            <li className="mb-2">
                            <FaCheckCircle className="text-success me-2" />
                            Scalable to 1000+ users & multiple branches
                            </li>
                            <li className="mb-2">
                            <FaCheckCircle className="text-success me-2" />
                            No hidden charges or contracts
                            </li>
                            <li className="mb-2">
                            <FaCheckCircle className="text-success me-2" />
                            Easy onboarding – no training required
                            </li>
                            <li className="mb-2">
                            <FaCheckCircle className="text-success me-2" />
                            Cancel anytime – zero lock-in
                            </li>
                        </ul>
                        </div>
                    </div>

                    {/* Target Audience Block */}
                    <div className="col-md-6">
                        <div
                        className="p-4 shadow-sm h-100 animated-bg"
                        style={{
                            borderRadius: "16px",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(0,0,0,0.1)",
                            color: "#000",
                        }}
                        >
                        <h5 className="text-warning fw-bold mb-3">👤 Who Should Use ERP?</h5>
                        <ul className="list-unstyled">
                            {[
                            "Enterprises with 2+ departments",
                            "Organizations needing unified dashboards",
                            "Firms seeking centralized workflow automation",
                            "Teams with separate finance, HR, and sales processes",
                            "Companies aiming for process visibility & alignment",
                            ].map((item, i) => (
                            <li key={i} className="mb-2 d-flex align-items-start">
                                <FaCheckCircle className="text-success me-2 mt-1" />
                                <span>{item}</span>
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="fw-semibold mt-4">
                        Scale smarter. Build faster. Manage better—with aaMOBee ERP.
                        </p>
                    </div>
                    </div>
                </div>
            </div>


      <Footer />
    </>
  );
}

export default ERPModule;
