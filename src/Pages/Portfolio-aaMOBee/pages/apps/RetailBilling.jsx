import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaRupeeSign, FaRocket } from "react-icons/fa";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function RetailBilling() {
  const [showProducts, setShowProducts] = useState(false);
  const [triggeredExternally, setTriggeredExternally] = useState(false);

  useEffect(() => {
    const faviconElement = document.querySelector("link[rel~='icon']");
    if (faviconElement) {
      faviconElement.href = '/favicon.png'; // File must be in public folder
    }
  }, []);

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
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} triggeredExternally={triggeredExternally} />

      {/* Hero Section */}
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
          Retail Billing Software – Simple, Fast Billing for Shops & Service Counters
        </h1>
        <p className="lead text-muted mt-2" style={{ maxWidth: "800px" }}>
          aaMOBee’s Retail Billing software helps you generate and manage customer
          bills with speed and precision—perfect for busy stores, small businesses,
          and service counters.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/choose-plan/signup" className="btn btn-success px-4 py-2 fw-semibold">
            START BILLING
          </Link>
          <a className="btn btn-outline-primary px-4 py-2 fw-semibold" onClick={(e) => { e.preventDefault(); setTriggeredExternally(true); setTimeout(() => setTriggeredExternally(false), 500); }}>
            View Other Modules
          </a>
        </div>
      </div>

      {/* Feature Sections */}
      <div
        className="py-5 fade-section"
        style={{
          background:
            "linear-gradient(185deg, rgb(1, 60, 106) 0%, rgb(3, 3, 26) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          {/* Row 1 */}
          <div className="row g-4 justify-content-center mb-5">
            {[
              {
                title: "Quick Item Search & Billing",
                desc: `Speed up your checkout process using aaMOBee’s retail billing software, which offers real-time product search and instant billing. Instantly locate products by name, category, or barcode—even in large inventories. Staff can easily adjust prices, apply discounts, change quantities, and complete billing—all within seconds. Every update is synced with your inventory, ensuring real-time stock accuracy. This feature is perfect for high-footfall counters or fast-paced sales environments, where minimizing waiting time is critical. It reduces human error, improves efficiency, and provides a seamless billing experience for both staff and customers. It’s designed to keep your business moving—fast and smooth.`,
                iconColor: "info",
              },
              {
                title: "GST/Tax Inclusive Pricing",
                desc: `Handle GST billing the smart way using retail billing software that comes with built-in support for SGST, CGST, and IGST. Whether your pricing is inclusive or exclusive of tax, the system auto-calculates totals without any manual effort. Create item-wise or category-level tax structures, customize rates, and ensure compliance with Indian tax norms. This removes the burden of manual tax calculation and prevents errors in invoice generation. It’s especially useful for businesses operating across state lines or offering multiple tax-exempt services. With accurate, real-time tax computation, your bills remain compliant, transparent, and ready for audit—always.`,
                iconColor: "warning",
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
                  <h2 className={`fw-bold mb-3 text-${block.iconColor}`}>
                    ✅ {block.title}
                  </h2>
                  <p className="mb-0">{block.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                title: "Print & Digital Receipts",
                desc: (
                  <>
                    Generate professional-looking receipts instantly at checkout. Whether your customer wants a printed bill, a digital PDF, or a WhatsApp/email copy, you can provide it in seconds. Each receipt includes your store's branding, invoice number, contact details, tax breakdown, discounts, and itemized billing. Easily configurable formats ensure compliance and a premium customer experience. It's ideal for businesses that want to go paperless or build brand trust through organized, transparent{" "}
                    <a href="https://en.wikipedia.org/wiki/Billing" target="_blank" rel="noopener noreferrer" style={{color: '#8a91ab'}}>
                      billing
                    </a>. You can also maintain digital logs for every transaction, making it easier to access past records, process returns, or resolve customer queries quickly and professionally.
                  </>
                ),
                iconColor: "success",
              }
              ,
              {
                title: "Daily Sales Summary",
                desc: `Stay on top of your daily performance with auto-generated sales summaries. Quickly track total revenue, item-wise sales, category performance, or even customer-specific purchases. Export the report in Excel or PDF and use it for accounting, analysis, or GST filing. Whether you’re running one counter or multiple billing stations, this feature gives you real-time data to evaluate what’s selling, what’s not, and how your day stacked up against targets. No more end-of-day guesswork or manual tallying—just clean, insightful data that helps you make better decisions for tomorrow’s business.`,
                iconColor: "primary",
              },
              {
                title: "Multi-Item & Multi-Tax Support",
                desc: `Handle complex billing with ease—whether you’re selling items with varied GST slabs or handling multiple quantities in one transaction. This feature allows you to add several items with different tax rates and discounts into one seamless invoice. Perfect for grocery stores, pharmacies, hardware shops, or any business dealing with bundled products. You can also split quantities across SKUs or apply item-specific rates, making it flexible for bulk, wholesale, or custom orders. This reduces the need for multiple bills and keeps your checkout efficient, accurate, and GST-compliant—all in one go.`,
                iconColor: "danger",
              },
            ].map((block, idx) => (
              <div className="col-md-4" key={idx}>
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
                    <h3 className={`fw-bold mb-3 text-${block.iconColor}`}>
                      ✅ {block.title}
                    </h3>
                    <p className="text-muted">{block.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>


      {/* Global Use + Pricing */}
      <div className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container fade-section">
          <div className="row g-4">
            {/* Global Use Block */}
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
                        Billing Made for Every Business
                      </text>
                    </svg>
                  </div>

                  {/* Title & Description */}
                  <h4 className="fw-bold text-primary mb-3">
                    🛍️ Cross-Industry Billing Compatibility
                  </h4>
                  <p className="mb-4">
                    aaMOBee Retail Billing adapts seamlessly to various industries — whether
                    you're selling products, offering services, or doing both.
                  </p>
                  <p className="mt-3 text-muted">
                    From retail outlets to repair shops and clinics, this billing module
                    supports quick checkouts, accurate tax calculations, and multi-product
                    flexibility — all without needing POS hardware.
                  </p>

                  {/* Industry List */}
                  <p className="fw-semibold text-secondary mt-4 mb-2">
                    Supported Billing Scenarios:
                  </p>
                  <ul className="row list-unstyled w-100 px-3">
                    {[
                      "🛒 General Stores – groceries, electronics, fashion",
                      "✂️ Salons & Clinics – service with itemized billing",
                      "🔧 Repair Shops – parts and labor billing together",
                      "🏬 Mobile Shops – IMEI-based sales & service",
                      "🎓 Coaching Centers – material + session billing",
                      "💼 Freelancers – on-spot sales or consultation",
                      "📦 Traders – walk-in orders and bulk entries",
                      "🍴 Cafes & Kiosks – quick multi-item billing",
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


          </div>

          {/* Audience Block */}
          <div className="row mt-5">

            <div className="col-md-6 ">
              <div
                className="p-4 shadow-sm h-100 animated-bg"
                style={{
                  // background: "rgba(255,255,255,0.9)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#000",
                }}
              >
                <h5 className="fw-bold text-success mb-1">
                  <FaRupeeSign className="me-2" />
                  Simple Pricing
                </h5>
                <ul className="list-unstyled">
                  {[
                    "₹125/month – full access",
                    <>
                      Use standalone or bundle with{" "}
                      <Link to="/inventory-management-software" className="text-primary">
                        Inventory
                      </Link>{" "}
                      & CRM
                    </>,
                    "Instant setup, cancel anytime",
                  ].map((item, idx) => (
                    <li key={idx} className="mb-2 d-flex align-items-start">
                      <FaCheckCircle className="me-2 text-success mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col">
              <div
                className="p-4 shadow-sm animated-bg"
                style={{
                  // background: "linear-gradient(to right, #f9f9f9, #e3f2fd)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <h5 className="text-warning fw-bold mb-3">👤 Who Can Use It?</h5>
                <ul className="row list-unstyled">
                  {[
                    "Retail stores – apparel, electronics, grocery",
                    "Service counters – repair shops, salons, clinics",
                    "Freelancers & small biz with walk-in clients",
                    "Traders and vendors",
                  ].map((item, idx) => (
                    <li
                      key={idx}
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

          {/* Coming Soon */}
          <div className="row mt-5">
            <div className="col">
              <div className="p-4 shadow-sm shimmer-bg">
                <h5 className="text-info fw-bold mb-1">
                  <FaRocket className="me-2" /> Coming Soon
                </h5>
                <small className="text-muted d-block mb-3">
                  No extra charge for future enhancements!
                </small>
                <ul className="row list-unstyled">
                  {[
                    "POS-style touchscreen interface",
                    "Barcode scanning & label printing",
                    "Returns and refund flow",
                    "Loyalty & discount programs",
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

          <div className="text-center mt-4">
            <p className="fw-semibold">
              Get started now—no hardware, no contracts, just smarter billing.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RetailBilling;
