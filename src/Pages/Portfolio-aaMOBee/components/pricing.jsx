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


const EXCHANGE_RATE_API_KEY = "3b09377b1ca2cdb3c7d1fb54b374873d";
const EXCHANGE_RATE_API_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGE_RATE_API_KEY}`;
const predefinedFeatures = [
  "Dashboard", "Client Management", "Profile Management",
  "Firm Management [One Firm, One User/Role]",    // Economy
  "Firm Management [One Firm, Role/Many Users]",  // Premium
  "Firm Management [Unlimited Firms, Unlimited User/Role]", // Elite
  "Inventory Management", "Manufacturer Inventory", "Invoicing", "Retail Billing", "CRM Leads"
];


function Pricing() {
  const [selectedFlag, setSelectedFlag] = useState(indianFlag);

  const [exchangeRates, setExchangeRates] = useState({});

  const [selectedCountry, setSelectedCountry] = useState('india');
  const [plans, setPlans] = useState([]);
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const navigate = useNavigate();
  const updateFlag = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const flagSrc = selectedOption.getAttribute('data-flag');
    const country = selectedOption.value;
    setSelectedFlag(flagSrc);
    setSelectedCountry(country);
  };

  const fetchPlans = async () => {
    try {
      const response = await getAllPlans();
      console.log(response || []);
      if (response) {
        setPlans(response);
      }

    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  console.log(plans);
  useEffect(() => {
    fetchPlans();
  }, []);



  const handlePlanSelection = (planId, price) => {
    localStorage.setItem("planId", planId);
    localStorage.setItem("planPrice", price.toString());
    toggleModal();
    navigate("/register");
  };


  const fetchExchangeRates = async () => {
    try {
      const res = await fetch(EXCHANGE_RATE_API_URL);
      const data = await res.json();
      console.log("Exchange Rates:", data);
      if (data && data.rates) {
        setExchangeRates(data.rates); // Store rates like USD, GBP
      }
    } catch (err) {
      console.error("Error fetching exchange rates", err);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchExchangeRates(); // Fetch both at once
  }, []);


  const getCurrencySymbol = () => {
    switch (selectedCountry) {
      case 'usa':
        return '$';
      case 'uk':
        return '£';
      case 'malaysia':
        return 'RM';
      case 'dubai':
        return 'AED';
      case 'indonesia':
        return 'Rp';
      case 'saudi':
        return 'SAR';
      case 'india':
      default:
        return '₹';
    }
  };

  const getConversionRate = () => {
    switch (selectedCountry) {
      case 'usa':
        return exchangeRates.USD || 1;
      case 'uk':
        return exchangeRates.GBP || 1;
      case 'malaysia':
        return exchangeRates.MYR || 1;
      case 'dubai':
        return exchangeRates.AED || 1;
      case 'indonesia':
        return exchangeRates.IDR || 1;
      case 'saudi':
        return exchangeRates.SAR || 1;
      case 'india':
      default:
        return 1;
    }
  };


  const currencySymbol = getCurrencySymbol();
  const conversionRate = getConversionRate();

  return (
    <div className="pricing-div">
      <h2>The Perfect Balance of Features and Affordability</h2>
      <span className="subheading">Pricing</span>
      <span className="toggler-plan">
        Monthly
        <label className="switch mb-0">
          <input type="checkbox" />
          <span className="slider round"></span>
        </label>
        <span className="save-upto">(Save up to 30%)</span>
        <span className="country-selector1">
          <select
            name="country"
            id="country"
            className="p-2 rounded bg-none"
            onChange={updateFlag}
            style={{
              minWidth: "100px"
            }}
          >
            <option value="india" data-flag={indianFlag}>India</option>
            {/* <option value="usa" data-flag={usaFlag} >USA</option>
            <option value="uk" data-flag={ukFlag} >UK</option>
            <option value="malaysia" data-flag={malaysiaFlag} >Malaysia</option>
            <option value="dubai" data-flag={dubaiFlag} >Dubai</option>
            <option value="indonesia" data-flag={indonesiaFlag} >Indonesia</option>
            <option value="saudi" data-flag={saudiFlag} >Saudi Arabia</option> */}

          </select>
          <div id="flag-container" style={{ position: 'absolute', left: '-35px' }}>
            <img id="flag" src={selectedFlag} alt="Flag" style={{ width: '30px', height: '20px' }} />
          </div>
        </span>
      </span>

      <div className="pricing-container">
        {Array.isArray(plans) && plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan._id} className={`pricing-card ${plan.title === 'Gold' ? 'most-popular new-launch' : ''}`}>
              <div className="card-title">{plan.title.toUpperCase()}</div>
              <div className="card-subtitle mb-2">{plan.caption}</div>
              {/* <ul className="features">
              {predefinedFeatures
                .filter(feature => plan.features.includes(feature))
                .map((feature, index) => (
                  <li key={`available-${index}`} className="feature-available">
                    {feature}
                  </li>
                ))}

              {[
                ...new Set(
                  predefinedFeatures
                    .filter(
                      feature =>
                        !plan.features.includes(feature) &&
                        !plan.features.some(selected =>
                          selected.split('[')[0].trim() === feature.split('[')[0].trim()
                        )
                    )
                    .map(f => f)
                )
              ].map((feature, index) => (
                <li key={`missing-${index}`} className="feature-missing">
                  {feature}
                </li>
              ))}
            </ul> */}
              <ul className="features">
                {predefinedFeatures
                  .filter(feature => plan.features.includes(feature))
                  .map((feature, index) => (
                    <li key={`available-${index}`} className="feature-available">
                      <>
                        {feature.split('[')[0].trim()}
                        {feature.includes('[') && (
                          <span className="bracket">
                            [{feature.substring(feature.indexOf('[') + 1, feature.indexOf(']'))}]
                          </span>
                        )}
                      </>
                    </li>
                  ))}

                {[...new Set(
                  predefinedFeatures
                    .filter(feature =>
                      !plan.features.includes(feature) &&
                      !plan.features.some(selected =>
                        selected.split('[')[0].trim() === feature.split('[')[0].trim()
                      )
                    )
                )].map((feature, index) => (
                  <li key={`missing-${index}`} className="feature-missing">
                    <>
                      {feature.split('[')[0].trim()}
                      {feature.includes('[') && (
                        <span className="bracket">
                          [{feature.substring(feature.indexOf('[') + 1, feature.indexOf(']'))}]
                        </span>
                      )}
                    </>
                  </li>
                ))}
              </ul>

              <div className="price d-flex align-items-center justify-content-center gap-1" style={{ fontSize: "19px" }}>
                {plan.price === 0 ? (
                  <span className='badge bg-success' style={{ fontSize: "12px" }}>
                    {plan.days} Days
                  </span>
                ) : (
                  <>
                    <span style={{ fontWeight: "normal" }}>{currencySymbol}</span>
                    {(plan.price * conversionRate).toFixed(2)}
                    <span>/</span>
                    <span className='badge bg-success' style={{ fontSize: "12px" }}>
                      {plan.days} Days
                    </span>
                  </>
                )}
              </div>


              {/* show max firms field but with best naming convention & its count  */}
              {plan.price === 0 ? (
                null
              ) : <div className="d-flex justify-content-center align-items-center">
                {plan.maxFirms > 0 ? (
                  <span className="badge bg-primary">
                    Max Firms: {plan.maxFirms} {plan.maxFirms === 1 ? 'Firm' : 'Firms'}
                  </span>
                ) : (
                  <span className="badge bg-secondary">Unlimited Firms</span>
                )}
              </div>}

              <div className='d-flex justify-content-center align-items-center'>
                <button onClick={() => handlePlanSelection(plan._id, plan.price)} className="cta">
                  {plan.price === 0 ? 'Start My Free Trial' : 'Buy Plan'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No plans available</div>
        )}
      </div>
    </div>
  );
}

export default Pricing;
