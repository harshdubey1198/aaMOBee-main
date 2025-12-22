import React from 'react';
import playStore from "../assets/play-store.webp";
import appleStore from "../assets/apple-store.webp";
import { Link } from "react-router-dom";
// import '../assets/styles.css';
function Footer() {
  return (
    <div className="footer-section" id="footer">
      <div className="head-signup">
        <h2 className="footer-heading" style={{ color: 'white' }}>Ready to do your best work?</h2>
        <span className="footer-subheading">Let's get you started.</span>
        <Link to="/choose-plan/signup" className="footer-signup-btn">
          Sign Up Now <i className="fa fa-angle-right"></i>
        </Link>
      </div>

      <div className="columner">
        {/* About Section */}
        <div className="column-footer col-xl-3 col-md-3 col-sm-12">
          <h6 className="text-white">About</h6>
          <ul>
            <li><a onClick={() => window.scrollToProducts?.()} style={{ cursor: "pointer" }}>Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#smallbusiness">For Small Businesses</a></li>
            <li><a href="#accountants">For Accountants & Bookkeepers</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
          <div className="email-us-container">
            <a href="mailto:info@markaziasolutions.com" className="email-text">Email us</a>
            <div className="email-icon">
              <i className="fas fa-paper-plane"></i>
            </div>
          </div>
        </div>

        {/* Apps & Extensions */}
        <div className="column-footer col-xl-3 col-md-3 col-sm-12">
          <h6 className="text-white">Apps and Extensions</h6>
          <ul>
            <li><Link to="/apps/invoicing">Invoicing</Link></li>
            <li><Link to="/inventory-management-software">Inventory Management</Link></li>
            <li><Link to="/apps/crm-leads">CRM Leads</Link></li>
            <li><Link to="/apps/client-management">Client Management</Link></li>
            <li><Link to="/apps/retail-billing">Retail Billing</Link></li>
            <li><Link >HRMS              </Link></li>
            <li><Link >Payroll           </Link></li>
            <li><Link >BookKeeping       </Link></li>
            <li><Link >Business Analytics</Link></li>
            {/* <li><Link to="/apps/project-management">Project Management</Link></li> */}
            {/* <li><Link to="/apps/product-management">Product Management</Link></li> */}
            {/* <li><Link to="/apps/expense-tracker">Expense Tracker</Link></li> */}
            {/* <li><Link to="/apps/leave-management">Leave Management</Link></li> */}
            {/* <li><Link to="/apps/lms">LMS</Link></li> */}
            {/* <li><Link to="/apps/cms">CMS</Link></li> */}
          </ul>
        </div>

        {/* By Industry */}
        <div className="column-footer col-xl-3 col-md-3 col-sm-12">
          <h6 className="text-white">By Industry</h6>
          <ul>
            <li><a href="#retail">Retail</a></li>
            <li><a href="#pharma">Pharma</a></li>
            <li><a href="#fmcg">FMCG</a></li>
            <li><a href="#auto">Auto Parts</a></li>
            <li><a href="#fb">F & B</a></li>
            <li><a href="#hardware">Computer Hardware</a></li>
            <li><a href="#furniture">Furniture</a></li>
            <li><a href="#publishing">Book Publishing</a></li>
            <li><a href="#electrical">Electrical</a></li>
          </ul>
        </div>

        {/* Guides */}
        <div className="column-footer col-xl-3 col-md-3 col-sm-12">
          <h6 className="text-white">Guides</h6>
          <ul>
            <li><a href="#gst-guide">GST Guide</a></li>
            <li><a href="#inventory-guide">Inventory Guide</a></li>
            <li><a href="#accounting-guide">Accounting Guide</a></li>
            <li><a href="#shortcut-keys">aaMOBee Shortcut Keys</a></li>
            <li><a href="#software-products">aaMOBee Software Products</a></li>
            <li><a href="#download">aaMOBee Software</a></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/refund-policy">Refund Policy</Link></li>
          </ul>

        </div>
      </div>
      <hr className="hr" />

      <div className="footer-copyright" style={{
        display: 'flex',
        justifyContent: 'space-between', // pushes items to opposite sides
        alignItems: 'center',
        padding: '5px',
        margin: '20px 50px 20px 50px'
      }}>
        {/* <div className="downloader-apps">
          <img src={playStore} alt="Play Store" loading="lazy" />
          <img src={appleStore} alt="Apple Store" loading="lazy" />
        </div> */}
        <span className="copyright-text">© 2024 aaMOBee: ALL RIGHTS RESERVED</span>
        <div className="social-icons">
          <a href="https://www.facebook.com/aamobeeofficial" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.linkedin.com/company/aamobeeofficial/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="https://www.instagram.com/aamobeeofficial/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://x.com/aamobeeofficial" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.youtube.com/@aamobeeofficial" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
