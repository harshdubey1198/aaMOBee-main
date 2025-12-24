import React, { useEffect, useState } from "react";
import indianFlag from "../assets/Country-Flags/in.webp";
import { getAllPlans } from "../../../apiServices/service";
import { useNavigate } from "react-router-dom";
import CartModal from "../modals/CartModal";
import axios from "axios";

const predefinedFeatures = [
  "Dashboard",
  "Client Management",
  "Profile Management",
  "Firm Management [One Firm, One User/Role]",
  "Firm Management [One Firm, Role/Many Users]",
  "Firm Management [Unlimited Firms, Unlimited User/Role]",
  "Inventory Management",
  "Manufacturer Inventory",
  "Invoicing",
  "Retail Billing",
  "CRM Leads",
];

function Pricing() {
  const [isLoading, setIsLoading] = useState();
  const [selectedFlag, setSelectedFlag] = useState(indianFlag);
  const [cart, setCart] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [userCurrency, setUserCurrency] = useState("");
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const fetchUserCountry = async () => {
    try {
      const res = await axios.get("https://ipapi.co/json/");
      const currencyCode = res.data.currency;

      if (currencyCode === "AED") {
        setSelectedCountry("dubai");
        setUserCurrency("AED");
      } else {
        setSelectedCountry("india");
        setUserCurrency("INR");
      }
    } catch {
      setSelectedCountry("india");
      setUserCurrency("INR");
    }
  };

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPlans();
      if (response) setPlans(response);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCountry();
    fetchPlans();
  }, []);

  const handlePlanSelection = (planId, price) => {
    localStorage.setItem("planId", planId);
    localStorage.setItem("planPrice", price.toString());
    localStorage.setItem("planCurrency", userCurrency);
    navigate("/register");
  };

  const calculateSavings = (original, discounted) => {
    if (original === discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
  };

  return (
    <div className="pricing-div">
      <h2>The Perfect Balance of Features and Affordability</h2>
      <span className="subheading">Pricing</span>

      <div className="pricing-container">
        {Array.isArray(plans) && plans.length > 0 ? (
          plans.map((plan) => {
            const countryPricing = plan.prices.find(
              (p) => p.country === selectedCountry
            );
            if (!countryPricing) return null;

            return (
              <div
                key={plan._id}
                className={`pricing-card ${
                  plan.title === "Gold" ? "most-popular new-launch" : ""
                }`}
              >
                <div className="card-title">{plan.title.toUpperCase()}</div>
                <div className="card-subtitle mb-2">{plan.caption}</div>

                <ul className="features">
                  {predefinedFeatures
                    .filter((feature) => plan.features.includes(feature))
                    .map((feature, index) => (
                      <li key={index} className="feature-available">
                        <>
                          {feature.split("[")[0].trim()}
                          {feature.includes("[") && (
                            <span className="bracket">
                              [
                              {feature.substring(
                                feature.indexOf("[") + 1,
                                feature.indexOf("]")
                              )}
                              ]
                            </span>
                          )}
                        </>
                      </li>
                    ))}
                </ul>

                <div className="offers-section">
                  {countryPricing.offers?.map((offer) => {
                    const savings = calculateSavings(
                      offer.originalPrice,
                      offer.discountedPrice
                    );
                    return (
                     <div key={offer._id} className="offer-line">
                        <span className="offer-duration">
                          {offer.durationValue} {offer.durationType}
                        </span>
                        
                            {savings > 0 && (
                              <span className="offer-save">Save {savings}%</span>
                            )}
                        <div className="price-column">
                            <span className="offer-price">
                              {userCurrency} {offer.discountedPrice}
                            </span>
                            {offer.originalPrice !== offer.discountedPrice && (
                              <span className="offer-original">
                                <del>
                                  {userCurrency} {offer.originalPrice}
                                </del>
                              </span>
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
                    {countryPricing.basePrice === 0
                      ? "Start My Free Trial"
                      : "View Plans"}
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

      {/* <style jsx>{`
        
      `}</style> */}
    </div>
  );
}

export default Pricing;
