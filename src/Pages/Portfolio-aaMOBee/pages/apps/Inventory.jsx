import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCogs, FaBoxOpen, FaChartLine, FaPlug, FaRupeeSign, FaRocket, } from "react-icons/fa";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function Inventory() {
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
    AOS.init({
      duration: 800,
      once: true,
    });
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
        <h1 className="fw-bold display-5 mb-3">
          Inventory Management Software
        </h1>
        {/* <h3 className="text-dark">Designed for Indian Businesses</h3> */}
        <p className="lead text-muted mt-2">
          Built for Every Industry, Flexible for Every Business{" "}
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/choose-plan/signup" className="btn btn-danger px-4 py-2 fw-semibold">
            SIGN UP - IT'S FREE
          </Link>
          <a  className="btn btn-outline-primary px-4 py-2 fw-semibold"  onClick={(e) => { e.preventDefault(); setTriggeredExternally(true);  setTimeout(() => setTriggeredExternally(false), 500); }}>
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
          <div className="card-body p-4 ">
            <h5 className="text-primary fw-semibold mb-3">Why It Matters</h5>
            <p>
              In any business that deals with goods—whether it's trading,
              retail, manufacturing, or services—inventory is key. aaMOBee’s
              Inventory module makes it simple to track, control, and plan stock
              operations across any business size.
            </p>
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
                points: [
                  "Enter and track stock manually",
                  "Monitor quantity in and out across items",
                  "Handle raw materials and finished goods",
                  "Adjust inventory based on usage",
                  "Keep item-wise invoicing history",
                ],
                iconColor: "success",
              },
              {
                title: "Real-Time Tracking",
                // desc: "Get live updates of what’s in stock, what’s used, and what’s sold. Invoices automatically adjust the inventory. Say goodbye to guesswork—know your actual stock always.",
                desc:
                  "Get live updates of what’s in stock, what’s used, and what’s sold. Invoices automatically adjust the inventory. Say goodbye to guesswork—know your actual stock always. From raw materials to finished products, track movement across warehouses, stores, and sales channels—all in one dashboard. Receive low-stock alerts, set reorder points, and prevent overstock or shortages. Make smarter purchase decisions backed by real-time inventory insights.",

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

          {/* Feature Cards Section */}
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                icon: <FaBoxOpen className="text-warning fs-3" />,
                title: "Manual Inventory Entry",
                // desc: "Add products, raw materials, rates, and units without needing any barcode or integration. Total control, your way."
                desc:
                  "Easily add products, raw materials, pricing, and units—no barcode or automation required. Perfect for small businesses or custom operations where flexibility matters most. Track stock adjustments, set opening balances, and define unit conversions as needed. You’re in full control—simple, intuitive, and built for manual workflows.",
              },
              {
                icon: <FaCogs className="text-secondary fs-3" />,
                title: "Raw to Finished Tracking",
                // desc: "Define recipes (e.g. 3kg raw = 1 product). Auto adjust raw materials during conversion."
                desc:
                  "Track the entire journey from raw materials to final products with intelligent conversion logic. Define custom recipes (e.g., 3kg raw = 1 finished item) and let the system auto-deduct raw stock during production. Monitor wastage, improve accuracy, and ensure nothing goes unaccounted for in your manufacturing process.",
              },
              {
                icon: <FaPlug className="text-danger fs-3" />,
                title: "Integrated With Invoicing",
                // desc: "Whenever you create an invoice, stock is auto-updated. No manual duplication needed."
                desc:
                  "Seamlessly link sales with stock. Every time you create an invoice, your inventory auto-updates—no double entry, no errors. This real-time sync between billing and inventory ensures accurate stock levels, reduces manual work, and keeps your operations smooth and efficient.",
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
                {/* SVG Icon */}
                <div
                  className="mb-3"
                  style={{ width: "100px", height: "100px" }}
                >
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
                      text-anchor="middle"
                      fill="#4A4A4A"
                      font-family="Arial"
                      font-size="12"
                    >
                      Adapts to Any Industry
                    </text>
                  </svg>
                </div>

                {/* Title & Description */}
                <h5 className="fw-bold text-primary mb-3">
                  🌍 Cross-Industry Compatibility
                </h5>
                <p className="mb-4">
                  Whether you're selling, servicing, or producing — we’ve built
                  this to flex with your industry’s unique needs.
                </p>
                <p className="mt-3 text-muted">
                  From managing SKUs in retail stores to tracking
                  raw-to-finished conversions in manufacturing, this module
                  adapts with zero extra setup. It’s designed to support the way
                  your business operates — no matter how simple or complex.
                </p>

                {/* Industry List */}
                <p className="fw-semibold text-secondary mt-4 mb-2">
                  {/* Supported Industries: */}
                </p>
                <ul className="row list-unstyled w-100 px-3">
                  {[
                    "🛒 Retail – manage groceries, apparel, and electronics",
                    "🧰 Services – handle parts, tools, and field jobs",
                    "🏥 Healthcare – track medicines and equipment",
                    "🎓 Education – manage uniforms, books, and inventory",
                    "🛠️ Construction – monitor materials and vendor-wise usage",
                    "🏭 Manufacturing – track raw-to-finished conversions",
                    "🏨 Hospitality – manage rooms, food, and consumables",
                    "🔧 Automotive – handle spares and consumables",
                    "📦 Warehousing – multi-location tracking (Coming Soon)",
                  ].map((industry, i) => (
                    <li
                      key={i}
                      className="col-md-6 mb-2 d-flex align-items-start"
                    >
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
                  // background: "rgba(255,255,255,0.7)",
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
                  No fluff. Just the tools you need.
                </small>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <FaCheckCircle className="text-success me-2" />
                    Just ₹125/month – all features included
                  </li>
                  <li className="mb-2">
                    <FaCheckCircle className="text-success me-2" />
                    No hidden fees or hardware dependencies
                  </li>
                  <li className="mb-2">
                    <FaCheckCircle className="text-success me-2" />
                    Use standalone or bundle with CRM & Invoicing
                  </li>
                  <li className="mb-2">
                    <FaCheckCircle className="text-success me-2" />
                    Instant setup – start using in minutes
                  </li>
                  <li className="mb-2">
                    <FaCheckCircle className="text-success me-2" />
                    Cancel anytime – no lock-ins, no pressure
                  </li>
                </ul>
              </div>
            </div>

            {/* Target Audience Block */}
            <div className="col-md-6">
              <div
                className="p-4 shadow-sm h-100 animated-bg "
                style={{
                  // background: "rgba(255,255,255,0.7)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#000",
                }}
              >
                <h5 className="text-warning fw-bold mb-3">👤 Who Is It For?</h5>
                <ul className="list-unstyled">
                  {[
                    "SMEs looking to streamline inventory",
                    "Retailers managing fast-moving stock",
                    "Wholesalers handling bulk orders",
                    "Manufacturers tracking raw to finished goods",
                    "Service providers needing part/tool tracking",
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
                Explore full features or get started in under 2 minutes.
              </p>
            </div>
          </div>

          {/* Coming Soon Section */}
          {/* <div className="row mb-5 ">
            <div className="col">
              <div
                className="p-4 shadow-sm"
                style={{
                  background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#000",

                  
                }}
              >
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  These features are under active development and will be
                  available in upcoming updates — no extra cost.
                </small>

                <ul className="row list-unstyled">
                  {[
                    "Batch Tracking",
                    "Expiry Alerts",
                    "Barcode Integration",
                    "Stock Transfers",
                    "Auto-purchase Suggestions",
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
          </div> */}
          <div className="row mb-5">
            <div className="col">
              <div className="p-4 shadow-sm shimmer-bg">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted mb-3 d-block">
                  These features are under active development and will be
                  available in upcoming updates — no extra cost.
                </small>

                <ul className="row list-unstyled">
                  {[
                    "Batch Tracking",
                    "Expiry Alerts",
                    "Barcode Integration",
                    "Stock Transfers",
                    "Auto-purchase Suggestions",
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
      <Footer/>
    </>
  );
}

export default Inventory;
