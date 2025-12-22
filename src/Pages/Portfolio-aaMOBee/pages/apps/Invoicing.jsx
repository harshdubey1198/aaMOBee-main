import React, { useEffect ,useState} from "react";
import { FaCheckCircle, FaRupeeSign, FaRocket, FaBell, FaPalette, FaGlobe } from "react-icons/fa";
import HeaderWithDashboard from "../../components/headerWithDashboard";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

function Invoicing() {
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

      {/* HERO SECTION */}
      <div
        className="d-flex flex-column justify-content-center align-items-center fade-section"
        style={{
          background: "linear-gradient(to right, #fefcea, #e0f7fa)",
          padding: "6rem 1rem 3rem",
          textAlign: "center",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <h1 className="fw-bold display-5 mb-3">Invoicing – Smart, Simple & Global</h1>
        <p className="lead text-muted mt-2" style={{ maxWidth: "800px" }}>
          Bill faster, look professional, and stay compliant—across countries, currencies, and industries.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
          <Link to="/choose-plan/signup" className="btn btn-primary px-4 py-2 fw-semibold">
            TRY IT NOW
          </Link>
          <a className="btn btn-outline-dark px-4 py-2 fw-semibold"  onClick={(e) => { e.preventDefault(); setTriggeredExternally(true);  setTimeout(() => setTriggeredExternally(false), 500); }}>
            Explore Features
          </a>
        </div>

        <div
          className="card my-5 shadow-sm border-0 fade-section"
          style={{
            maxWidth: "600px",
            background: "rgba(255, 255, 255, 0.45)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
            color: "#333",
          }}
        >
          <div className="card-body p-4">
            <h5 className="text-primary fw-semibold mb-3">Why It Matters</h5>
            <p>
              Invoicing is core to every business—from freelancers to global exporters. aaMOBee lets you
              generate invoices with taxes, branding, currency flexibility, and payment tracking—all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div
        className="py-5 fade-section"
        style={{
          background:
            "linear-gradient(185deg, rgb(1, 60, 106) 0%, rgb(3, 3, 26) 35%, rgba(3, 24, 28, 0.63) 100%)",
          color: "#fff",
        }}
      >
        <div className="container">
          {/* 2 ROWS OF FEATURES */}
          <div className="row g-4 justify-content-center mb-5">
            {[
             {
              title: "GST-Ready & Global Tax Formats",
              desc: `Configure your invoices to comply with Indian GST (SGST, CGST, IGST) or international formats like VAT, Sales Tax, or region-based custom tax structures. The system supports HSN and SAC codes for item categorization, ensuring complete compliance for product and service-based businesses. Whether you're billing domestically or globally, you can choose pre-set tax templates or define your own multi-tiered tax rules. These settings are auto-applied to each invoice, so you never miss regulatory requirements. It’s perfect for businesses dealing with varied jurisdictions, exports, or cross-border transactions—all while keeping your invoicing accurate and tax-ready.`,
              iconColor: "success",
            },
            {
              title: "Instant WhatsApp & Email Sharing",
              desc: `Generate professional-looking invoices and instantly share them via WhatsApp, email, or SMS—without needing to download a PDF or switch platforms. With just one click, the system pulls client contact details from CRM and sends the invoice in your preferred format. It supports auto-generated messages, invoice links, and branding headers for a more personalized experience. Great for on-the-go teams or service providers who want to impress clients with real-time, digital delivery. No attachments, no delays—just fast, smart, and modern invoicing that keeps your communication smooth and your cashflow faster.`,
              iconColor: "info",
            }            
            ].map((block, idx) => (
              <div className="col-md-6" key={idx}>
                <div
                  className="p-4 h-100 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 8px 32px rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#fff",
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

          {/* 3 FUTURISTIC CARDS */}
          <div className="row g-4 justify-content-center fade-section">
            {[
              {
                title: "Track Payments & Send Reminders",
                icon: <FaBell className="text-success fs-3" />,
                desc: `Keep full control over your cash flow by marking invoices as paid, partially paid, or unpaid—along with the exact payment date and mode (cash, UPI, bank, card, etc.). For every client, view outstanding balances and generate payment aging reports to identify overdue accounts. You can also automate reminders via WhatsApp, SMS, or email to follow up on pending dues—customized with polite or firm messaging based on timeline. No need for manual checks or spreadsheets. The system keeps you alert, improves collection efficiency, and builds professionalism—so you get paid faster and reduce follow-up fatigue.`,
              },
              {
                title: "Multiple Templates & Branding",
                icon: <FaPalette className="text-warning fs-3" />,
                desc: `Make your invoices match your brand’s personality. Choose from professionally designed invoice templates—each customizable with your company logo, footer notes, colors, header layouts, and even watermark styles. Whether you’re sending a print invoice or a PDF, every document looks sharp and consistent. Include bank details, terms, disclaimers, and social media links for a polished finish. Perfect for service providers, freelancers, consultants, or retail businesses who want to make a strong impression. It’s not just about billing—it’s about making every touchpoint reflect your brand’s trust and quality.`,
              },
              {
                title: "Multi-Currency Support",
                icon: <FaGlobe className="text-info fs-3" />,
                desc: `Serve international clients without hassle by enabling multi-currency billing right from the dashboard. Choose from a wide range of currencies like INR, USD, AED, GBP, EUR, and more. Define your own exchange rates or let the system calculate based on the latest data. Taxes can be customized per country or region, ensuring compliance with both domestic and international standards. Each invoice clearly reflects currency, taxes, and totals—so your clients know exactly what they’re paying. It’s the ultimate tool for global-ready businesses, exporters, consultants, or agencies working across borders.`,
              },
            ].map((block, i) => (
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
                    {block.icon}
                    <h6 className="fw-bold mt-3">{block.title}</h6>
                    <p className="text-muted">{block.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* PRICING + COMING SOON */}
      <div className="py-5" style={{ background: "#f0f2f5" }}>
        <div className="container fade-section">
          <div className="row g-4 mb-5">
            <div className="col-md-6 ">
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
                  Just ₹125/month — No hidden fees.
                </small>
                <ul className="list-unstyled mt-3">
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    All features included
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    GST, VAT & multi-currency included
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    Instant setup, cancel anytime
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" />
                    Works standalone or with CRM & Inventory
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
                <h5 className="text-warning fw-bold mb-3">👤 Who Can Use It?</h5>
                <ul className="list-unstyled">
                  {[
                    "Freelancers & Consultants",
                    "Traders & Exporters",
                    "Service Businesses",
                    "E-commerce Sellers",
                    "Accountants",
                    "Multi-country Companies",
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
                <small className="text-muted d-block mb-3">
                  More power to you in the next updates—free.
                </small>
                <ul className="row list-unstyled">
                  {[
                    "Recurring Invoices",
                    "Credit/Debit Notes",
                    "Invoice Automation",
                    "Custom Reminders",
                    "Invoice-to-Payment Linking",
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

          <div className="text-center">
            <p className="fw-semibold">
              Start invoicing today — go global, stay local, look professional.
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Invoicing;
