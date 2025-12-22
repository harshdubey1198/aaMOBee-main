import React from 'react';
import sirEnhanced from '../assets/sir_enhanced.webp';
import aamobeeLogo from '../assets/aamobeee1121 1 (1).webp';

function RiseaaMOBee() {
  return (
    <div className="rise-aamobee">
      <div className="rise-div1">
        <h1>Preparing aaMOBee for the rise of India</h1>
        <p className="subheading">CEO, Magnifying India Pvt Ltd</p>
        <p>
          aaMOBee is a powerful, cloud-based platform built to streamline and digitize business operations for growing Indian enterprises.
          From managing Inventory, Invoicing, CRM Leads, Client Engagement, and Retail Billing to Bookkeeping, HRMS, Payroll, Project Management, Product Catalogs,
          and Business Analytics — aaMOBee offers one unified solution for all.
          Whether you're tracking expenses, managing leaves, or generating invoices, aaMOBee makes everything accessible and efficient, all in one place.
        </p>
        <a href="#" className="ra-btn">
          More on Forbes
        </a>
      </div>

      <img
        src={sirEnhanced}
        alt="India Map"
        className="ceo rise-div2"
      />
      <div className="rise-logo">
        <img
          src={aamobeeLogo}
          alt="aaMOBee Logo"
          className="rise-img"
          //  loading="lazy"
        />
      </div>
    </div>
  );
}

export default RiseaaMOBee;
