import React, { useEffect ,useState} from "react";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import { FaCheckCircle, FaChartLine,FaBoxOpen,FaPlug,FaCogs, FaUserPlus, FaBell, FaListAlt, FaUsers, FaRupeeSign, FaRocket } from "react-icons/fa";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function CrmLeads() {
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

  const features = [
    {
      title: "Lead Capture & Categorization",
      icon: <FaUserPlus className="text-warning fs-3" />,
      iconColor: "text-success",
      desc:
        "Effortlessly add new leads into your system—either manually, via integrated web forms, or by importing from Excel sheets. Capture essential information like name, contact, source, and interest level. Categorize leads into segments such as hot, warm, cold, or follow-up-ready using intuitive tags. This makes it easy for your sales or marketing team to prioritize high-potential leads and maintain a structured, searchable lead database. You’ll never lose track of an opportunity again—every inquiry gets recorded and managed from day one, ensuring maximum conversion efficiency through organized outreach and filtering.",
    },
    {
      title: "Follow-Up Reminders",
      icon: <FaBell className="text-success fs-3" />,
      iconColor: "text-info",
      desc:
        "Ensure no lead slips through the cracks with customizable follow-up reminders. Whether it’s a callback, meeting, demo, or email—set reminders that pop up directly in your dashboard. Choose from one-time or recurring schedules to suit your sales cycle. The system tracks and displays pending tasks for each day, helping your team stay consistent and punctual in their communication. Timely follow-ups dramatically improve conversion rates, build trust with potential clients, and show your professionalism. With aaMOBee’s CRM, staying connected and nurturing leads becomes part of your automated daily workflow.",
    },
  ];
  
  
  return (
    <>
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} triggeredExternally={triggeredExternally}/>
      <div
        className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #e0ecff, #fefcea)",
          padding: "6rem 1rem 3rem",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">CRM & Leads Management</h1>
        <p className="lead text-muted mt-2">
          Capture, Track & Convert Leads Smarter with aaMOBee
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/choose-plan/signup" className="btn btn-danger px-4 py-2 fw-semibold">
            START NOW
          </Link>
          <a className="btn btn-outline-primary px-4 py-2 fw-semibold"  onClick={(e) => { e.preventDefault(); setTriggeredExternally(true);  setTimeout(() => setTriggeredExternally(false), 500); }}>
            Explore More Modules
          </a>
        </div>

        <div
          className="card my-5 shadow-sm border-0 fade-section"
          style={{
            maxWidth: "600px",
            background: " rgb(255 255 255 / 48%)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            color: "#565252",
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-primary fw-semibold mb-3">Why It Matters</h5>
            <p>
              In any business, leads are opportunities. aaMOBee’s CRM & Leads
              module helps you organize and convert leads efficiently, track
              communication, and boost conversion rates—all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: CRM Features */}
      <div
        className="py-5 fade-section"
        style={{
          background: "linear-gradient(185deg, #013c6a 0%, #03031a 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          <div className="row justify-content-center g-4 mb-4">
            {[0, 1].map((i) => (
              <div className="col-md-6" key={i}>
                <div
                   className="p-4 h-100 shadow-sm"
                   style={{
                     borderRadius: "20px",
                     background: "rgba(255, 255, 255, 0.05)",
                     boxShadow: "0 8px 32px 0 rgba(255, 255, 255, 0.05)",
                     backdropFilter: "blur(10px)",
                     WebkitBackdropFilter: "blur(10px)",
                     border: "1px solid rgba(255, 255, 255, 0.1)",
                     color: "#ffffff",}}
                >
                  <div className="d-flex align-items-center gap-3">
                    {features[i].icon}
                    <h6 className={`${features[i].iconColor} m-0`}>{features[i].title}</h6>
                  </div>
                  <p className="text-white">{features[i].desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                icon: <FaChartLine className="text-warning fs-3" />,
                title: "Sales Pipeline View",
                desc:
                  "Visualize the entire journey of your leads—from the initial inquiry to the final deal closure. Move leads through different pipeline stages like New, Contacted, Interested, Negotiation, and Closed. Identify where leads are dropping off, manage follow-ups accordingly, and prioritize the right deals at the right time. Ideal for teams that want clarity, focus, and faster conversions.",
              },
              {
                icon: <FaUsers className="text-secondary fs-3" />,
                title: "Assign to Teams",
                desc:
                  "Distribute leads across your sales reps, marketing team, or business units with complete access control. Each team member only sees their assigned leads, ensuring focus and data privacy. Perfect for multi-region teams, departments, or external consultants managing different lead categories. Maintain clear ownership and accountability across your organization.",
              },
              {
                icon: <FaListAlt className="text-danger fs-3" />,
                title: "Communication Logs",
                desc:
                  "Never lose track of any interaction. With CRM Communication Logs, every call, meeting, message, and email gets stored under the respective lead profile. Add follow-up notes, attach files, and use tags for easy filtering. Create a reliable timeline of interactions so any team member can pick up where the last left off—without confusion.",
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
                    <h6 className="fw-bold mt-3 text-black">{feature.title}</h6>
                    <p className="text-muted">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
{/* SECTION 2: Cross-Industry Compatibility */}
<div className="py-5" style={{ background: "#f0f2f5" }}>
  <div className="container fade-section">
    <div className="row mb-2">
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
          <h5 className="fw-bold text-primary mb-3">
            🌍 Cross-Industry CRM Compatibility
          </h5>
          <p className="mb-4">
            Whether you’re managing real estate clients, coaching leads,
            corporate prospects, or service queries—aaMOBee adapts to your
            process.
          </p>
          <p className="text-muted">
            Designed to be flexible, scalable, and simple for every industry’s
            workflow.
          </p>
          <ul className="row list-unstyled w-100 px-3 mt-4">
            {[
              "🏠 Real Estate – client follow-up & site visit tracking",
              "🎓 EdTech – lead nurture for demo calls and enrollments",
              "📞 Agencies – campaign lead management & performance",
              "👨‍⚕️ Clinics – inquiry logging and appointment CRM",
              "🛍️ E-Commerce – B2B distributor relationship tracking",
            ].map((item, i) => (
              <li
                key={i}
                className="col-md-6 mb-2 d-flex align-items-start"
              >
                <FaCheckCircle className="me-2 text-success mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<div style={{ background: "#f0f2f5" }}>
  <div className="container fade-section">
    {/* Pricing and Audience */}
    <div className="row g-4 mb-3">
      <div className="col-md-6">
        <div
          className="p-4 shadow-sm h-100 animated-bg"
          style={{
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.1)",
            color: "#000",
            // background: "#fff",
          }}
        >
          <h5 className="fw-bold text-success mb-1">
            <FaRupeeSign className="me-2" />
            Simple & Transparent Pricing
          </h5>
          <small className="text-muted">Just what you need. Nothing extra.</small>
          <ul className="list-unstyled mt-3">
            <li>
              <FaCheckCircle className="text-success me-2" />
              ₹125/month – all features included
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              No hidden fees, no hardware dependency
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Works standalone or with Inventory & Billing
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Instant setup, intuitive interface
            </li>
            <li>
              <FaCheckCircle className="text-success me-2" />
              Cancel anytime, no lock-ins
            </li>
          </ul>
        </div>
      </div>

      <div className="col-md-6">
        <div
          className="p-4 shadow-sm h-100 animated-bg"
          style={{
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,0,0,0.1)",
            color: "#000",
            // background: "#fff",
          }}
        >
          <h5 className="text-warning fw-bold mb-3">👤 Who Is It For?</h5>
          <ul className="list-unstyled">
            {[
              "Sales Teams & Executives",
              "Marketing Departments",
              "Business Consultants",
              "Freelancers & Agencies",
              "Startups & SMEs",
              "Franchise Managers",
              "Customer Success Teams",
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
          Ready to convert more leads and grow faster? Start today in under 2 minutes.
        </p>
      </div>
    </div>

    {/* Coming Soon */}
    <div className="row mb-5">
      <div className="col">
        <div className="p-4 shadow-sm shimmer-bg rounded-4">
          <h5 className="text-info fw-bold mb-1">
            <FaRocket className="me-2" /> Coming Soon
          </h5>
          <small className="text-muted mb-3 d-block">
            New updates rolling out soon – included in your plan.
          </small>
          <ul className="row list-unstyled">
            {[
              "WhatsApp Lead Capture Integration",
              "Website Form & CRM Sync",
              "Email/SMS Automation Workflows",
              "Lead Scoring & Priority Tags",
              "Activity Timeline View for Each Lead",
              "Multi-Channel Source Reporting",
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
<Footer/>
    </>
  );
}

export default CrmLeads;
