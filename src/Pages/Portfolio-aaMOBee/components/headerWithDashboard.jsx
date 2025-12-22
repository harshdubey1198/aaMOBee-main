import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LogoBig from "../assets/Logo-big.webp";
import LogoSmall from "../assets/small-logo.webp";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import InventoryImage from "../assets/img/inventory.svg";
import InvoiceImage from "../assets/img/invoice.webp";
import CrmImage from "../assets/img/CRM.webp";
import ClientImage from "../assets/img/ClientMgmt.svg";
import RetailImage from "../assets/img/retail.svg";
import HrmsImage from "../assets/img/HRMS.webp";
import ProjectImage from "../assets/img/projectMgmt.webp";
import ProductImage from "../assets/img/productMgmt.svg";
import PayrollImage from "../assets/img/payroll.webp";
import LeaveImage from "../assets/img/leaveMgmt.webp";
import BusinessImage from "../assets/img/businessAtools.webp";
import BookImage from "../assets/img/bookKeeping.webp";
import ExpenseImage from "../assets/img/expense.svg";
import LearningImage from "../assets/img/lms.webp";
import ContentImage from "../assets/img/content.webp";
import DailySales from "../assets/img/Daily-Sales.webp";
import ERP from "../assets/img/ERP.webp";
import Affiliate from "../assets/img/Affiliate-business-system.webp"
import gsap from "gsap";
import { FaChevronDown } from "react-icons/fa";
import MobileProductTray from "./MobileProductTray";
const apps = [
  { name: "Inventory", slug: "inventory-management-software", available: true, img: InventoryImage },
  { name: "Invoicing", slug: "apps/invoicing", available: true, img: InvoiceImage },
  { name: "CRM Leads", slug: "apps/crm-leads", available: true, img: CrmImage },
  { name: "Client Management", slug: "apps/client-management", available: true, img: ClientImage },
  { name: "Retail Billing", slug: "apps/retail-billing", available: true, img: RetailImage },
  { name: "HRMS", slug: "apps/hrms", available: false, img: HrmsImage },
  { name: "Learning Management System", slug: "apps/lms", available: false, img: LearningImage },
  { name: "Content Management System", slug: "apps/cms", available: false, img: ContentImage },
  { name: "Project Management", slug: "apps/project-management", available: false, img: ProjectImage },
  { name: "Product Management", slug: "apps/product-management", available: false, img: ProductImage },
  { name: "Payroll Management", slug: "apps/payroll-management", available: false, img: PayrollImage },
  { name: "Leave Management", slug: "apps/leave-management", available: false, img: LeaveImage },
  { name: "Business Analytics Tool", slug: "apps/business-analytics-tool", available: false, img: BusinessImage },
  { name: "BookKeeping", slug: "apps/bookkeeping", available: false, img: BookImage },
  { name: "Expense Tracker", slug: "apps/expense-tracker", available: false, img: ExpenseImage },
  { name: "Daily Sales Tracker", slug: "apps/daily-sales-tracker", available: false, img: DailySales },
  { name: "ERP", slug: "apps/erp", available: false, img: ERP },
  { name: "Affiliate Business System", slug: "apps/affiliate-business-system", available: false, img: Affiliate },
];


function HeaderWithDashboard({ showProducts, setShowProducts, triggeredExternally, scrollToPricing, scrollToFAQ, scrollToTestimonial, productTrayRef }) {
  // const [showProducts, setShowProducts] = useState(false);
  const [showMobileProducts, setShowMobileProducts] = useState(false);
  const trayRef = useRef();
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const clickedOnProductsRef = useRef(false);
  const [activeSection, setActiveSection] = useState("all");
  const [searchApp, setSearchApp] = useState(null);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  const isHome = currentPath === "/";
  const isBlog = currentPath.includes("/blogs");
  const isContact = currentPath.includes("/contact-us");
  const isPricing = currentPath.includes("/choose-plan/signup");
  const isSupport = currentPath.includes("/support");
  const handleProductsClick = () => {
    if (typeof setShowProducts !== "function") return;
    clickedOnProductsRef.current = true;
    setShowProducts((prev) => !prev);
  };

  useEffect(() => {
    if (triggeredExternally) {
      setShowProducts(true);
    }
  }, [triggeredExternally, setShowProducts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedOnProductsRef.current) {
        clickedOnProductsRef.current = false;
        return;
      }

      if (trayRef.current && !trayRef.current.contains(event.target)) {
        setShowProducts(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const filteredApps = apps
    .filter((app) => {
      if (activeSection === "launched") return app.available;
      if (activeSection === "coming") return !app.available;
      return true;
    })
    .sort((a, b) => {
      if (activeSection === "coming") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const searchOptions = apps.map((app) => ({
    label: app.name,
    value: app.name.toLowerCase().replace(/\s+/g, "-"),
    isDisabled: !app.available,
    slug: app.slug,
  }));

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const clickedOutsideNav =
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target);

      const clickedToggleButton =
        mobileToggleRef.current &&
        mobileToggleRef.current.contains(e.target);

      if (clickedOutsideNav && !clickedToggleButton) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <header
        className="navbar navbar-expand-lg bg-white shadow-sm fixed-top py-3"
        style={{ zIndex: 1050 }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={LogoBig} alt="aaMOBee Logo" style={{ height: "40px" }} />
          </Link>

          <nav className="d-none d-lg-flex gap-4 align-items-center">
            {!isHome && (
              <Link
                to="/"
                className="nav-link custom-nav"
                style={{ marginLeft: "20px" }}
              >
                Home
              </Link>
            )}

            <a
              className="
              d-flex align-items-center
              nav-link custom-nav"
              onClick={handleProductsClick}

            >
              Products
              <FaChevronDown
                style={{
                  marginLeft: "8px",
                  transition: "transform 0.5s ease",
                  transform: showProducts ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </a>
            {isHome ? (
              <a className="nav-link custom-nav" onClick={scrollToPricing}>
                Pricing
              </a>
            ) : (
              <Link className="nav-link custom-nav" to="/choose-plan/signup">
                Pricing
              </Link>
            )
            }

            {isHome && (
              <><a className="nav-link custom-nav" onClick={scrollToTestimonial}>
                Testimonial
              </a><a className="nav-link custom-nav" onClick={scrollToFAQ}>
                  FAQs
                </a></>
            )}
            {!isBlog && (
              <Link className="nav-link custom-nav" to="/blogs">
                Blogs
              </Link>
            )}
            {!isSupport && (
              <Link className="nav-link custom-nav" to="/support">
                Support
              </Link>
            )}

            {!isContact && (
              <Link className="nav-link custom-nav" to="/contact-us">
                Contact Us
              </Link>
            )}

            <Link to="/login-forwarding" className="btn btn-primary btn-sm px-4 rounded-pill" >
              Login
            </Link>
          </nav>


          <button
            className="navbar-toggler"
            ref={mobileToggleRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>


        </div>
      </header>

      {showProducts && (
        <div
          ref={productTrayRef}
          className="position-fixed start-0 w-100 h-100 d-none d-lg-flex "
          style={{
            top: "80px",
            bottom: "0",
            height: "calc(100vh - 80px)",
            background: "#f8f9fa",
            zIndex: 1040,
            overflowY: "auto",
            transition: "opacity 0.4s ease",
          }}
        >
          <aside
            className=" border-end p-3"
            style={{
              width: "25%",
              minHeight: "100vh",
              position: "sticky",
              top: "70px",
              backgorund: "white",
            }}
          >
            <div style={{ padding: "0 10px", marginBottom: "20px" }}>
              <label
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  marginBottom: "6px",
                  display: "block",
                }}
              >
                Search Product Module
              </label>
              <Select
                placeholder="Search apps..."
                options={searchOptions}
                value={searchApp}
                onChange={(selected) => {
                  setSearchApp(selected);
                  if (!selected.isDisabled) {
                    navigate(`/${selected.slug}`);
                  }
                }}
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#dae9f4",
                    minHeight: "38px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#b5d6f1" },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "#056cb8"
                      : state.isFocused
                        ? "#f0f8ff"
                        : "white",
                    color: state.isSelected ? "white" : "#333",
                    opacity: state.data.isDisabled ? 0.5 : 1,
                    cursor: state.data.isDisabled ? "not-allowed" : "pointer",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 999,
                  }),
                }}
              />
            </div>

            <div
              className="p-3 border-round "
              style={{ background: "#f8fcff", border: "1px solid #dae9f4" }}
            >
              <h6 className="text-muted text-center">Navigation</h6>
              <ul
                className="product-filter-nav d-flex flex-column gap-2"
                style={{ paddingLeft: "0" }}
              >
                {[
                  { label: "All Products", value: "all" },
                  { label: "Launched Products", value: "launched" },
                  { label: "Upcoming Products", value: "coming" },
                ].map((item) => (
                  <li
                    key={item.value}
                    style={{ listStyle: "none", marginBottom: "8px" }}
                  >
                    <button
                      style={{
                        minWidth: "100%",
                        borderRadius: "5px",
                        border: "2px solid #dae9f4",
                        padding: "8px 12px 8px 20px",
                        backgroundColor:
                          activeSection === item.value ? "#e6f0fa" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      className={activeSection === item.value ? "active" : ""}
                      onClick={() => setActiveSection(item.value)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="flex-grow-1 p-4 pb-5" style={{ width: "75%", overflowY: "auto", maxHeight: "100%", marginBottom: "80px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold">Recent Launches</h4>
              <a href="#" className="text-primary fw-semibold">
                Explore All Products &gt;
              </a>
            </div>

            <div className="row g-3">
              {filteredApps.map((app, index) => (
                <div className="col-md-4" key={index}>
                  <div
                    className="card shadow-sm h-100 d-flex flex-column justify-content-between p-3"
                    style={{
                      background: "#f8fcff",
                      maxWidth: "350px",
                      border: "1px solid #dae9f4",
                    }}
                  >
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          background: "#eef1f5",
                          width: "60px",
                          height: "60px",
                          marginRight: "15px",
                          flexShrink: 0,
                        }}
                      >
                        {app.img && (
                          <img
                            src={app.img}
                            alt={app.name}
                            className="hide-bg"
                            style={{
                              maxWidth: "60px",
                              maxHeight: "60px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <h5 className="card-title text-start mb-1">{app.name}</h5>
                        <p
                          className="card-text text-muted"
                          style={{ fontSize: "14px", marginBottom: 0 }}
                        >
                          {generateDescription(app.name)}
                        </p>
                      </div>
                    </div>

                    {app.available ? (
                      <Link
                        to={`/${app.slug
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        style={{
                          fontSize: "13px",
                          color: "#056cb8",
                          textTransform: "uppercase",
                          fontFamily: "var(--zf-secondary-medium)",
                          textDecoration: "none",
                        }}
                      >
                        TRY NOW &gt;
                      </Link>
                    ) : (
                      <div className="d-flex justify-content-center  ">
                        <Link
                          className="badge bg-warning text-dark"
                          style={{ fontSize: "12px" }}
                          to={`/${app.slug.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          Coming Soon
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      <div
        className={`navbar-collapse bg-white shadow-sm d-lg-none ${isMobileMenuOpen ? 'show' : 'collapse'}`}
        ref={mobileMenuRef}
        id="navbarNav"
        style={{
          position: "fixed",
          overflowY: "scroll",
          top: "83px",
          left: 0,
          right: 0,
          zIndex: 1050,
          minHeight: "calc(95vh - 80px)",
          transition: "all 0.3s ease-in-out",
          padding: "20px 0"
        }}
      >
        <ul className="navbar-nav ms-auto gap-2 d-flex flex-column align-items-start px-3">
          <li className="nav-item w-100 text-center">
            <Link style={{ borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} className="nav-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          </li>
          <li className="nav-item w-100 text-center">
            {isHome ? (
              <a className="nav-link" style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} onClick={() => { scrollToPricing(); setIsMobileMenuOpen(false); }}>Pricing</a>
            ) : (
              <Link style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} className="nav-link" to="/choose-plan/signup" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            )}
          </li>
          <li className="nav-item w-100 text-center">
            <button
              className="nav-link"
              style={{
                minWidth: "100%",
                borderRadius: "5px",
                border: "2px solid #dae9f4",
                padding: "8px 12px",
                cursor: "pointer",
                textAlign: "left",
                paddingLeft: "40%",
                background: "none",
                outline: "none",
              }}
              onClick={() => setShowMobileProducts((prev) => !prev)}
            >
              Products{" "}
              <FaChevronDown
                style={{
                  marginLeft: "8px",
                  transition: "transform 0.3s ease",
                  transform: showMobileProducts ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {showMobileProducts && (
              <ul
                className="mt-2 pt-4 px-4"
                style={{
                  listStyle: "none",
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  paddingRight: "8px"
                }}
              >
                {apps.filter(app => app.available).map((app) => (
                  <li key={app.name} className="mb-2">
                    <Link
                      to={`/${app.slug}`}
                      onClick={() => {
                        setShowMobileProducts(false);
                        setIsMobileMenuOpen(false);
                      }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "14px",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        backgroundColor: "#f8fcff",
                        border: "1px solid #dae9f4",
                        color: "#000",
                        textDecoration: "none",
                      }}
                    >
                      {app.name}
                      <img
                        src={app.img}
                        alt={app.name}
                        style={{
                          width: "auto",
                          height: "50px",
                          marginLeft: "12px",
                          flexShrink: 0,
                        }}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {isHome && (
            <li className="nav-item w-100 text-center">
              <a className="nav-link" style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} onClick={() => { scrollToTestimonial(); setIsMobileMenuOpen(false); }}>Testimonial</a>
            </li>
          )}
          {isHome && (
            <li className="nav-item w-100 text-center">
              <a className="nav-link" style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} onClick={() => { scrollToFAQ(); setIsMobileMenuOpen(false); }}>FAQs</a>
            </li>
          )}
          {!isBlog && (
            <li className="nav-item w-100 text-center">
              <Link style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} className="nav-link" to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link>
            </li>
          )}

          {!isSupport && (
            <li className="nav-item w-100 text-center">
              <Link style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} className="nav-link" to="/support" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
            </li>
          )}

          {!isContact && (
            <li className="nav-item w-100 text-center">
              <Link style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", textAlign: "left", paddingLeft: "40%" }} className="nav-link" to="/contact-us" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
            </li>
          )}

          <li className="nav-item w-100 text-center">
            <Link style={{ minWidth: "100%", borderRadius: "5px", border: "2px solid #dae9f4", padding: "8px 12px 8px 20px", cursor: "pointer", paddingLeft: "40%" }} className="btn btn-primary btn-sm px-4 rounded-pill" to="/login-forwarding" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          </li>
        </ul>
      </div>



    </>
  );
}

function generateDescription(appName) {
  switch (appName) {
    case "Inventory":
      return "Track and manage your inventory in real-time.";
    case "Invoicing":
      return "Create and manage invoices easily.";
    case "HRMS":
      return "Manage your employees and HR operations.";
    case "Project Management":
      return "Track tasks, timelines, and productivity.";
    case "Product Management":
      return "Organize product catalogs and lifecycle.";
    case "Payroll Management":
      return "Automate employee salary and taxes.";
    case "Retail Billing":
      return "Manage retail transactions and billing.";
    case "Expense Tracker":
      return "Monitor and control your expenses.";
    case "BookKeeping":
      return "Maintain accurate financial records.";
    case "CRM Leads":
      return "Track leads and nurture relationships.";
    case "Client Management":
      return "Centralized data for client operations.";
    case "Leave Management":
      return "Handle leave requests and balances.";
    case "Business Analytics Tool":
      return "Make smarter decisions with data.";
    case "Learning Management System":
      return "Empower learning with smart technology.";
    case "Content Management System":
      return "Organize, manage, and publish content.";
    case "Daily Sales Tracker":
      return "Monitor daily sales and performance.";
    case "ERP":
      return "Integrate all business processes.";
    case "Affiliate Business System":
      return "Manage affiliate programs and commissions.";
    default:
      return "Powerful business tool.";
  }
}

export default HeaderWithDashboard;
