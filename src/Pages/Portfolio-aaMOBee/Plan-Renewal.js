import React, { useEffect, useState } from 'react';
import indianFlag from './assets/Country-Flags/in.webp';
import ukFlag from './assets/Country-Flags/gb-eng.webp';
import usaFlag from './assets/Country-Flags/us.webp';
import { useNavigate } from 'react-router-dom';
import { getAllPlans } from '../../apiServices/service';
import axios from 'axios';
import { fetchUserCurrency } from '../../utils/fetchUserCurrency';
const predefinedFeatures = [
  "Dashboard","Client Management", "Profile Management",
  "Firm Management [One Firm, One User/Role]",    // Economy
  "Firm Management [One Firm, Role/Many Users]",  // Premium
  "Firm Management [Unlimited Firms, Unlimited User/Role]", // Elite
  "Inventory Management", "Manufacturer Inventory", "Invoicing", "Retail Billing" , "CRM Leads"
];

const PlanRenewal = () => {
    const [selectedFlag, setSelectedFlag] = useState(indianFlag);
    const [plans, setPlans] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('india');
    const [modal, setModal] = useState(false); 
    const [currency, setCurrency] = useState({ code: 'INR', symbol: '₹' });
    const navigate = useNavigate();
    const updateFlag = (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const flagSrc = selectedOption.getAttribute('data-flag');
      setSelectedFlag(flagSrc);
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

    // const fetchUserCurrency = async () => {
    //   try {
    //       const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_API_KEY}`);
    //       const userCurrency = response.currency.code || { code: 'INR', symbol: '₹' };
    //       setCurrency(userCurrency);
    //       localStorage.setItem('planCurrency', JSON.stringify(userCurrency));
    //       console.log(userCurrency);
    //   } catch (error) {
    //       console.error('Error fetching user location:', error);
    //   }
    // };
    useEffect(() => {
      fetchPlans();
      const getCurrency = async () => {
        const userCurrency = await fetchUserCurrency();
        setCurrency(userCurrency);
      };
      getCurrency();
    }, []);
    
    const handlePlanSelection = async (planId) => {
      try {
        const storedEmail = localStorage.getItem('planemail');
        const response = await axios.post(`${process.env.REACT_APP_URL}/payment/create-checkout-session`, {
          email: storedEmail,
          planId: planId, 
          currency: currency, 
        });

        if (response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          console.error('Failed to retrieve checkout URL.');
        }
      } catch (error) {
        console.error('Error creating checkout session:', error);
      }
    };
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
    const currencySymbol = getCurrencySymbol();
    return (
      <div className="pricing-div" style={{background:"linear-gradient(to right, rgb(224, 236, 255), rgb(254, 252, 234))", margin:"0", padding:"30px 50px 0 50px",minHeight:"100vh"}}>
        <h2>Renew Your Subscription Plan</h2>
        <span className="subheading">Continue enjoying premium features without interruption</span>
       

        <div className="pricing-container">
          {Array.isArray(plans) && plans.length > 0 ? (
            plans.map((plan) => (
              <div key={plan._id} className={`pricing-card ${plan.title === 'Gold' ? 'most-popular new-launch' : ''}`}>
                <div className="card-title">{plan.title.toUpperCase()}</div>
                <div className="card-subtitle">{plan.caption}</div>
                 {/* <ul className="features my-2">
                      {predefinedFeatures
                        .filter(feature => plan.features.includes(feature))
                        .map((feature, index) => (
                          <li key={`available-${index}`} className="feature-available">
                            {feature}
                          </li>
                        ))}

                      {predefinedFeatures
                        .filter(feature => !plan.features.includes(feature))
                        .map((feature, index) => (
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
            {/* <div className="price d-flex align-items-center justify-content-center gap-1" style={{fontSize:"19px"}}>
                <span style={{fontWeight:"normal"}}> {currencySymbol}</span> {(plan.price).toFixed(2)}
                <span>/</span>
                <span className='badge bg-success' style={{fontSize:"12px"}}>{plan.days} Days</span>   
                </div> */}
          <div className="price d-flex align-items-center justify-content-center gap-1" style={{ fontSize: "19px" }}>
            {plan.price === 0 ? (
              <span className='badge bg-success' style={{ fontSize: "12px" }}>
                {plan.days} Days 
              </span>
              ) : (
                <>
                  <span style={{ fontWeight: "normal" }}>{currencySymbol}</span>
                  {(plan.price).toFixed(2)}
                  <span>/</span>
                  <span className='badge bg-success' style={{ fontSize: "12px" }}>
                    {plan.days} Days
                  </span>
                </>
              )}
            </div>
                  
                  {/* show max firms field but with best naming convention & its count  */}
                <div className="d-flex justify-content-center align-items-center ">
                  {plan.maxFirms > 0 ? (
                    <span className="badge bg-primary">
                      Max Firms: {plan.maxFirms} {plan.maxFirms === 1 ? 'Firm' : 'Firms'}
                    </span>
                  ) : (
                    <span className="badge bg-secondary">Unlimited Firms</span>
                  )}
                </div>
                <button onClick={() => handlePlanSelection(plan._id)} className="cta">
                  Start Renewal
                </button>
              </div>
            ))
          ) : (
            <div>No plans available</div>
          )}
        </div>
      </div>
    );
};

export default PlanRenewal;
