// import React from 'react'
import ufOne from "../assets/uf-img-1.webp";
import ufTwo from "../assets/uf-img-2.webp";
import ufThree from "../assets/uf-img-3.webp";
import ufFive from "../assets/uf-img-5.webp";
function UserFavourites({ openProductTray }) {
  return (
    <div className="user-favourites">
      <div className="uf-heading">
        Do it all,<br />and then some more!
      </div>
      <div className="uf-small-title">User favorites:</div>

      <div className="uf-boxes">
        {/* Receivable */}
        <div className="uf-box">
          <h3>Receivable</h3>
          <p>
            Raise tax-compliant, professional invoices and quotes in no time. Offer multiple payment options, automate invoices and reminders, and send online payment links.
          </p>
          <div className="uf-card">
            <img src={ufOne} alt="Receivable" className="uf-img"
             //  loading="lazy"
              />
          </div>
        </div>

        {/* Payables */}
        <div className="uf-box">
          <h3>Payables</h3>
          <p>
            Raise tax-compliant, professional invoices and quotes in no time. Offer multiple payment options, automate invoices and reminders, and send online payment links.
          </p>
          <div className="uf-card">
            <img src={ufTwo} alt="Payables" className="uf-img" 
            //  loading="lazy" 
            />
          </div>
        </div>

        {/* Inventory */}
        <div className="uf-box">
          <h3>Inventory</h3>
          <p>
            Raise tax-compliant, professional invoices and quotes in no time...
          </p>
          <div className="uf-card">
            <img src={ufThree} alt="Inventory" className="uf-img"
             //  loading="lazy"
              />
          </div>
        </div>
      </div>

      <div className="uf-boxes gtc">
        {/* Reports */}
        <div className="uf-box">
          <h3>Reports</h3>
          <p>
            Get actionable insights on your cash flow, taxes, profit <br />
            and loss, and sales on demand. Opt to get selected <br />
            reports periodically sent to yourself and your team.
          </p>
          <div className="uf-card">
            {/* Placeholder for potential report image or content */}
          </div>
        </div>

        {/* Projects */}
        <div className="uf-box">
          <h3>Projects</h3>
          <p>
            Raise tax-compliant, professional invoices and quotes in no time. Offer multiple payment options, automate invoices and reminders, and send online payment links.
          </p>
          <div className="uf-card">
            <img src={ufFive} alt="Projects" className="uf-img"
             //  loading="lazy"
              />
          </div>
        </div>
      </div>

     <a onClick={openProductTray} className="uf-btn" style={{ cursor: "pointer" }}>
  Explore Features <i className="fa fa-angle-right"></i>
</a>

    </div>
  )
}

export default UserFavourites
