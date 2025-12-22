import React, { useEffect ,useState} from "react";
import { FaCheckCircle, FaFolderOpen, FaStickyNote, FaLink, FaSearch, FaShieldAlt, FaRupeeSign, FaRocket, } from "react-icons/fa";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function ClientsManagement() {
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
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} triggeredExternally={triggeredExternally}/>
      <div
        className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #d5fefd)",
          padding: "6rem 1rem 3rem",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">Client Management System</h1>
        <p className="lead text-muted mt-2">
          Organize Smarter. Serve Better. Grow Stronger.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/choose-plan/signup" className="btn btn-danger px-4 py-2 fw-semibold">
            SIGN UP
          </Link>
          <a  className="btn btn-outline-primary px-4 py-2 fw-semibold" onClick={(e) => { e.preventDefault(); setTriggeredExternally(true);  setTimeout(() => setTriggeredExternally(false), 500); }}>
            Explore More Products
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
              Whether you're a service provider, consultant, or growing business, organizing your client data is essential. aaMOBee’s Client Management module ensures everything—from contacts to transactions—is securely accessible and always up-to-date.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Block Section */}
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
            {/* First Row – 2 Cards */}
            <div className="row g-4 justify-content-center mb-4">
                {[
                  {
                    title: "Client Profiles & Documents",
                    desc: `Maintain detailed client profiles with everything from basic contact details to tax IDs, company info, communication preferences, and billing addresses—all in one place. You can also securely upload and store essential documents such as contracts, service agreements, identity proofs, KYC files, and more. For every client, you get a centralized timeline of invoices, transaction history, outstanding payments, and services delivered. This helps reduce manual tracking, eliminates duplication, and ensures nothing falls through the cracks. The system is built for growing businesses that need secure, structured, and instant access to every client detail—whenever needed.`,
                    iconColor: "warning",
                  },
                  {
                    title: "Notes, Tags & Reminders",
                    desc: `Add internal notes after every meeting, email, or phone call—so your team stays aligned on every client’s history. Create context-based tags like “VIP client,” “Pending KYC,” or “Follow-up in 7 days” to organize and filter contacts effortlessly. You can also set automatic reminders for important dates like renewals, follow-up calls, document requests, or payment alerts. These features help teams stay proactive, not reactive. Even if a different person handles the client tomorrow, they’ll have full clarity of what’s been discussed and what needs to happen next. This is how relationship-driven businesses build client trust and loyalty.`,
                    iconColor: "info",
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
                      <p className="mb-0">{block.desc}</p>
                    </div>
                  </div>
                ))}
              </div>


            {/* Second Row – 3 Cards */}
            <div className="row g-4 justify-content-center">
              {[
                {
                  title: "Link to Invoices & Projects",
                  desc:
                    "Automatically link clients to past invoices, open leads, and active projects. Gain a 360° view of every transaction and task—accessible from one single screen.",
                  icon: <FaLink className="text-danger fs-3" />,
                },
                {
                  title: "Smart Search & Filters",
                  desc:
                    "Find clients instantly using name, email, phone number, tags, city, or outstanding status. Smart filters help you analyze activity, payments, and client segments with ease.",
                  icon: <FaSearch className="text-info fs-3" />,
                },
                {
                  title: "Secure Access & Audit Logs",
                  desc:
                    "All client records are encrypted and accessible only to authorized roles. Admins can view audit logs to see who changed what and when—ensuring data integrity and transparency.",
                  icon: <FaShieldAlt className="text-success fs-3" />,
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


      {/* Pricing + Audience + Coming Soon */}
      <div className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container fade-section">
          <div className="row g-4 mb-5">
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
                  Simple & Transparent Pricing
                </h5>
                <small className="text-muted">
                  No hidden charges. Full access.
                </small>
                <ul className="list-unstyled mt-3">
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    ₹125/month – all features included
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    Seamlessly works with CRM, Invoicing, Projects
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    Encrypted & role-based access
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    Cancel anytime – no lock-in
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
                }}
              >
                <h5 className="text-warning fw-bold mb-3">👤 Who Is It For?</h5>
                <ul className="list-unstyled">
                  {[
                    "Consultants and Agencies",
                    "Service-based businesses",
                    "Legal & Real Estate firms",
                    "Retailers & Wholesalers",
                    "Accountants and Freelancers",
                  ].map((item, i) => (
                    <li key={i}>
                      <FaCheckCircle className="text-success me-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
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
                  These upgrades are on the way:
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Client communication tracking (Email/SMS)",
                    "Contract expiry alerts & renewals",
                    "Auto-rating based on payment history",
                    "Custom fields & segmentation options",
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

export default ClientsManagement;
