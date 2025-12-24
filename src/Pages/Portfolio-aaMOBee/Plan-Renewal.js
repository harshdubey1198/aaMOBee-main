import React, { useEffect, useState } from 'react';
import indianFlag from './assets/Country-Flags/in.webp';
import ukFlag from './assets/Country-Flags/gb-eng.webp';
import usaFlag from './assets/Country-Flags/us.webp';
import { useNavigate } from 'react-router-dom';
import { getAllPlans , getSettings } from '../../apiServices/service';
import axios from 'axios';
import { fetchUserCurrency } from '../../utils/fetchUserCurrency';
import CartModal from './modals/CartModal';
import { useRazorpay } from 'react-razorpay';
import { toast } from 'react-toastify';
const predefinedFeatures = [
  "Dashboard","Client Management", "Profile Management",
  "Firm Management [One Firm, One User/Role]",    
  "Firm Management [One Firm, Role/Many Users]",  
  "Firm Management [Unlimited Firms, Unlimited User/Role]", 
  "Inventory Management", "Manufacturer Inventory", "Invoicing", "Retail Billing" , "CRM Leads"
];

const PlanRenewal = () => {
    const [selectedFlag, setSelectedFlag] = useState(indianFlag);
    const [plans, setPlans] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('india');
    const [modal, setModal] = useState(false); 
    const { isLoading, Razorpay } = useRazorpay();
    const [currency, setCurrency] = useState('INR');
    const navigate = useNavigate();
    
    const updateFlag = (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const flagSrc = selectedOption.getAttribute('data-flag');
      setSelectedFlag(flagSrc);
    };
    const [activeGateway, setActiveGateway] = useState(null);
    // console.log(activeGateway);
    const [cart, setCart] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showCart, setShowCart] = useState(false);

    const fetchPlans = async () => {
      try {
        const response = await getAllPlans();
        // console.log(response || []);
        if (response) {
          setPlans(response);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

   useEffect(() => {
  fetchPlans();

  // setSelectedCountry("dubai");
  // setCurrency("AED");
  // localStorage.setItem("planCountry", "dubai");
  // localStorage.setItem("planCurrency", "AED");

  axios.get("https://ipapi.co/json/")
    .then((res) => {
      const countryCode = res.data.currency; 
      if (countryCode === "AED") {
        setSelectedCountry("dubai");
        setCurrency("AED");
        localStorage.setItem("planCountry", "dubai");
        localStorage.setItem("planCurrency", "AED");
      }
      if (countryCode === "INR") {
        setSelectedCountry("india");
        setCurrency("INR");
        localStorage.setItem("planCountry", "india");
        localStorage.setItem("planCurrency", "INR");
      }
      // add more if needed...
    })
    .catch(err => console.error("IP detection failed", err));
  

  const fetchGateway = async () => {
    try {
      const res = await getSettings();
      if (res?.data?.length > 0) {
        const pg = res.data[0].paymentGateways;

        // ✅ Prefer Stripe if both are active
        if (pg.stripe?.status) {
          setActiveGateway("stripe");
        } else if (pg.razorpay?.status) {
          setActiveGateway("razorpay");
        } else {
          console.warn("⚠️ No active payment gateway found");
          setActiveGateway(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch gateway", err);
    }
  };

  fetchGateway();
}, []);
// useEffect(() => {
//   if (activeGateway) {
//     // console.log("🟢 Active Payment Gateway:", activeGateway);
//   }
// }, [activeGateway]);

  const handlePlanSelection = async (planId) => {
  try {
    const storedEmail = localStorage.getItem("planemail");
    const storedPrice = localStorage.getItem("planPrice");
    const amount = Number(storedPrice);
    const currency = "INR"; // or your selected currency

    // ✅ Directly handle FREE (0-amount) plans
    if (amount === 0) {
      try {
        const freePlanResponse = await axios.post(
          `${process.env.REACT_APP_URL}/payment/razorpay/create-order`,
          {
            email: storedEmail,
            planId,
            currency,
            amount: 0,
          }
        );
          // console.log(freePlanResponse);
          
        if (
          freePlanResponse.message === "Razorpay order created" ||
          freePlanResponse.data?.message?.includes("Free plan activated")
        ) {
          toast.success("Free plan activated successfully!");
          navigate('/login');
          return; 
        } else {
          // toast.error("Failed to activate free plan. Try again.");
          return;
        }
      } catch (err) {
        console.error("Free plan activation failed:", err);
        toast.error("Something went wrong while activating free plan.");
        return;
      }
    }

    // ✅ Razorpay case
    if (activeGateway === "razorpay") {
      // console.log(activeGateway);
      const orderResponse = await axios.post(
        `${process.env.REACT_APP_URL}/payment/razorpay/create-order`,
        {
          email: storedEmail,
          planId,
          currency,
          amount,
        }
      );
console.log(orderResponse);

      // 🔹 if backend still returns free plan
      if (!orderResponse.data?.orderId && amount === 0) {
        toast.success("Free plan activated successfully!");
        window.location.href = "https://aamobee.com/login";
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: (orderResponse.response?.amount || orderResponse.amount) * 100,
        currency: orderResponse.response.currency,
        order_id: orderResponse.response.orderId,
        name: "aaMOBee",
        description: "Plan Renewal",
        handler: async function (response) {
          try {
            await axios.post(
              `${process.env.REACT_APP_URL}/payment/razorpay/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            toast.success("Renewal successful & verified!");
            window.location.href = "https://aamobee.com/login";
          } catch (err) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: { email: storedEmail },
      };
      const rzp = new Razorpay(options);
      rzp.open();
      
      // ✅ Stripe case
    } else if (activeGateway === "stripe") {
      // console.log(activeGateway);
      const checkoutResponse = await axios.post(
        `${process.env.REACT_APP_URL}/payment/create-checkout-session`,
        {
          email: storedEmail,
          planId,
          currency,
          amount,
        }
      );
      if (checkoutResponse.data.checkoutUrl) {
        window.location.href = checkoutResponse.data.checkoutUrl;
      } else {
        toast.error("Failed to retrieve Stripe checkout URL.");
      }
    }
  } catch (error) {
    console.error("Error creating order:", error);
    // toast.error("Unable to process payment.");
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
              <div className="offers-section">
                {plan.prices.find(p => p.country === selectedCountry)?.offers?.map(offer => {
                  const countryPricing = plan.prices.find(p => p.country === selectedCountry);
                  const savings = countryPricing && offer.originalPrice ? Math.round(((offer.originalPrice - offer.discountedPrice)/offer.originalPrice)*100) : 0;
                  return (
                    <div key={offer._id} className="offer-line">
                      <span className="offer-duration">{offer.durationValue} {offer.durationType}</span>
                      {savings > 0 && <span className="offer-save">Save {savings}%</span>}
                      <div className="price-column">
                        <span className="offer-price">{currency} {offer.discountedPrice}</span>
                        {offer.originalPrice !== offer.discountedPrice && (
                          <span className="offer-original"><del>{currency} {offer.originalPrice}</del></span>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                <button 
                  onClick={() => {
                    setCart(plan);
                    const countryPricing = plan.prices.find(p => p.country === selectedCountry);
                    setSelectedOffer(countryPricing?.offers[0]);
                    setShowCart(true);
                  }} 
                  className="cta"
                >
                  Start Renewal
                </button>

              </div>
            ))
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
          currencySymbol={currency}
          handlePlanSelection={handlePlanSelection}
          userCountry={selectedCountry}
        />

      </div>
    );
};

export default PlanRenewal;
