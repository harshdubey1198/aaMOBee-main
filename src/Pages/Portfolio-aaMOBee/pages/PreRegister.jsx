import React, { useEffect, useState } from 'react';
import indianFlag from '../assets/Country-Flags/in.webp';
import ukFlag from '../assets/Country-Flags/gb-eng.webp';
import usaFlag from '../assets/Country-Flags/us.webp';
import malaysiaFlag from '../assets/Country-Flags/malaysia.webp';
import dubaiFlag from '../assets/Country-Flags/dubai.webp';
import indonesiaFlag from '../assets/Country-Flags/indonesia.webp';
import saudiFlag from '../assets/Country-Flags/saudi.webp';

import { getAllPlans } from '../../../apiServices/service';
import { useNavigate } from 'react-router-dom';
import HeaderWithDashboard from '../components/headerWithDashboard';
import CartModal from '../modals/CartModal';

const predefinedFeatures = [
  "Dashboard","Client Management", "Profile Management",
  "Firm Management [One Firm, One User/Role]",    // Economy
  "Firm Management [One Firm, Role/Many Users]",  // Premium
  "Firm Management [Unlimited Firms, Unlimited User/Role]", // Elite
  "Inventory Management", "Manufacturer Inventory", "Invoicing", "Retail Billing" , "CRM Leads"
];

function PreRegister() {
  const [selectedFlag, setSelectedFlag] = useState(indianFlag);
  const [cart, setCart] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("india");
  const [userCurrency, setUserCurrency] = useState("INR");
  const [plans, setPlans] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const navigate = useNavigate();
  const calculateSavings = (original, discounted) => {
      if (original === discounted) return 0;
      return Math.round(((original - discounted) / original) * 100);
    };
  const updateFlag = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const flagSrc = selectedOption.getAttribute("data-flag");
    const country = selectedOption.value;

    setSelectedFlag(flagSrc);
    setSelectedCountry(country);

    // set correct currency code
    switch (country) {
      case "usa":
        setUserCurrency("USD");
        break;
      case "uk":
        setUserCurrency("GBP");
        break;
      case "malaysia":
        setUserCurrency("MYR");
        break;
      case "dubai":
        setUserCurrency("AED");
        break;
      case "indonesia":
        setUserCurrency("IDR");
        break;
      case "saudi":
        setUserCurrency("SAR");
        break;
      case "india":
      default:
        setUserCurrency("INR");
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await getAllPlans();
      if (response) setPlans(response);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePlanSelection = (planId, price) => {
    localStorage.setItem("planId", planId);
    localStorage.setItem("planPrice", price.toString());
    localStorage.setItem("planCurrency", userCurrency); // ✅ store currency code
    navigate("/register");
  };

  return (
    <>
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} />

      <div className="pricing-div"
        style={{
          background: "linear-gradient(to right, #e0ecff, #fefcea)",
          padding: "50px 50px 10px 50px",
          margin: "60px 0 0 0",
          minHeight: "calc(100vh - 80px)"
        }}
      >
        <h2>One Platform. All Your Business Needs.</h2>
        <span className="subheading">
          From Inventory to Invoicing, HRMS to Bookkeeping — explore aaMOBee plans built for every business.
        </span>

        {/* 🌍 Country Selector */}
        <div className="country-selector mt-4 mb-4">
          <select
            name="country"
            id="country"
            className="p-2 rounded"
            onChange={updateFlag}
            style={{
              minWidth: "160px",
              border: "1px solid #ffb25a",
              paddingLeft: "40px"
            }}
          >
            <option value="india" data-flag={indianFlag}>India</option>
            {/* <option value="usa" data-flag={usaFlag}>USA</option> */}
            {/* <option value="uk" data-flag={ukFlag}>UK</option> */}
            {/* <option value="malaysia" data-flag={malaysiaFlag}>Malaysia</option> */}
            <option value="dubai" data-flag={dubaiFlag}>Dubai</option>
            {/* <option value="indonesia" data-flag={indonesiaFlag}>Indonesia</option> */}
            {/* <option value="saudi" data-flag={saudiFlag}>Saudi Arabia</option> */}
          </select>
          <div id="flag-container" style={{ position: "absolute", marginLeft: "-35px", marginTop: "5px" }}>
            <img id="flag" src={selectedFlag} alt="Flag" style={{ width: "30px", height: "20px" }} />
          </div>
        </div>

        {/* Plans */}
        <div className="pricing-container">
          {Array.isArray(plans) && plans.length > 0 ? (
            plans.map((plan) => {
              // country-specific pricing
              const countryPricing = plan.prices.find((p) => p.country === selectedCountry);
              if (!countryPricing) return null;

              return (
                <div key={plan._id} className={`pricing-card ${plan.title === "Gold" ? "most-popular new-launch" : ""}`}>
                  <div className="card-title">{plan.title.toUpperCase()}</div>
                  <div className="card-subtitle mb-2">{plan.caption}</div>

                  <ul className="features">
                    {predefinedFeatures
                      .filter((feature) => plan.features.includes(feature))
                      .map((feature, index) => (
                        <li key={`available-${index}`} className="feature-available">
                          {feature}
                        </li>
                      ))}
                  </ul>

                  {/* <div className="price d-flex align-items-center justify-content-center gap-1" style={{ fontSize: "19px" }}>
                    <span style={{ fontWeight: "normal" }}>{countryPricing.currency}</span>
                    {countryPricing.basePrice}
                    <span>/</span>
                    <span className="badge bg-success" style={{ fontSize: "12px" }}>
                      {plan.days} Days
                    </span>
                  </div> */}
                
                {/* Offers Section */}
                <div className="offers-section">
                  {countryPricing.offers?.map(offer => {
                    const savings = calculateSavings(offer.originalPrice, offer.discountedPrice);
                    return (
                      <div key={offer._id} className="offer-line">
                        <span className="offer-duration">{offer.durationValue} {offer.durationType}</span>
                        {savings > 0 && <span className="offer-save">Save {savings}%</span>}
                        <div className="price-column">
                          <span className="offer-price">{userCurrency} {offer.discountedPrice}</span>
                          {offer.originalPrice !== offer.discountedPrice && (
                            <span className="offer-original"><del>{userCurrency} {offer.originalPrice}</del></span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <button
                      onClick={() => {
                        setCart(plan);
                        setSelectedOffer(countryPricing.offers[0]);
                        setShowCart(true);
                      }}
                      className="cta"
                    >
                      {countryPricing.basePrice === 0 ? "Start My Free Trial" : "Buy Plan"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No plans available</div>
          )}
        </div>

        <CartModal
          showCart={showCart}
          setShowCart={setShowCart}
          cart={cart}
          selectedOffer={selectedOffer}
          setSelectedOffer={setSelectedOffer}
          currencySymbol={userCurrency}
          handlePlanSelection={handlePlanSelection}
          userCountry={selectedCountry}
        />
      </div>
    </>
  );
}

export default PreRegister;
