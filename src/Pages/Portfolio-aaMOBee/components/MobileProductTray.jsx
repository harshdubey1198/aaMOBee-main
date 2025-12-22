import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

// Import your app icons
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
  { name: "Business Analytics Tool", slug: "apps/business-analytics", available: false, img: BusinessImage },
  { name: "BookKeeping", slug: "apps/bookkeeping", available: false, img: BookImage },
  { name: "Expense Tracker", slug: "apps/expense-tracker", available: false, img: ExpenseImage },
];

const MobileProductTray = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "launched" && app.available) || (filter === "coming" && !app.available);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-3" style={{ background: "#4e2e1f", minHeight: "100vh", color: "#fff" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">Explore Apps</h5>
        <button
          className="btn btn-sm btn-outline-light"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Search */}
      <div className="position-relative mb-3">
        <input
          type="text"
          placeholder="Search apps..."
          className="form-control rounded-pill"
          style={{ background: "#7e4f34", border: "none", color: "#fff" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch style={{ position: "absolute", right: 20, top: 12, color: "#ccc" }} />
      </div>

      {/* Filter Buttons */}
      {dropdownOpen && (
        <div className="d-flex justify-content-between mb-3">
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn btn-sm ${filter === 'launched' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setFilter('launched')}>Launched</button>
          <button className={`btn btn-sm ${filter === 'coming' ? 'btn-light' : 'btn-outline-light'}`} onClick={() => setFilter('coming')}>Coming</button>
        </div>
      )}

      {/* Product Cards */}
      <div className="d-flex flex-column gap-3">
        {filteredApps.map((app, i) => (
          <div key={i} className="bg-light text-dark rounded p-3 d-flex align-items-center">
            <img src={app.img} alt={app.name} style={{ width: 50, height: 50, marginRight: 15 }} />
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold">{app.name}</h6>
              <small className="text-muted">{app.available ? "Available now" : "Coming soon"}</small>
            </div>
            {app.available ? (
              <Link to={`/${app.slug}`} className="btn btn-sm btn-outline-success ms-auto">
                Try Now
              </Link>
            ) : (
              <span className="badge bg-warning text-dark ms-auto">Soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProductTray;
