import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, } from "reactstrap";
import threeDImage from "../assets/3d-image.webp";
import establishedIcon from "../assets/established-icon.webp";
import growingIcon from "../assets/growing-icon.webp";
import startUpRocket from "../assets/startup-rocket.webp";
import threeLines from "../assets/three-lines.webp";
import invertedThreeLines from "../assets/three-lines-inverted.webp";
import { getAllPlans } from "../../../apiServices/service";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import QueryForm from "./queryForm";

gsap.registerPlugin(ScrollTrigger);

function Bookkeeping() {
  const [modal, setModal] = useState(false);
  const [ queryModal , setQueryModal] = useState(false);

  const [plans, setPlans] = useState([]);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState();
  const toggleModal = () => setModal(!modal);
  const navigate = useNavigate();

  const toggleQueryModal = () => setQueryModal(!queryModal);
  const fetchPlans = async () => {
    try {
      const response = await getAllPlans();
      if (Array.isArray(response)) {
        setPlans(response);
      } else if (response && Array.isArray(response)) {
        setPlans(response);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    gsap.to(".mask-line", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".reveal-text",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  const handlePlanSelection = (setPlanId, setEmail) => {
    localStorage.setItem("planId", setPlanId);
    localStorage.setItem("emailForRegister", setEmail);

    // console.log("Plan selected:", setPlanId);
    toggleModal();
    setTimeout(() => {
      navigate("/register");
    }, 3000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const planId = document.getElementById("planId").value;
    const message = document.getElementById("message").value;

    // Ensure a plan is selected
    if (!planId) {
      alert("Please select a plan.");
      return;
    }

    const data = {
      name,
      email,
      planId,
      message,
    };

    handlePlanSelection(planId, email);
  };

  return (
    <div className="services-container" id="bookkeeping">
      {/* <span className="service-heading">
        <img
          className="headingimg"
          //  loading="lazy"
          src={threeLines}
          alt="Three lines"
        />
        List of Bookkeeping Services We’re Offer
        <img
          src={invertedThreeLines}
          //  loading="lazy"
          alt="Inverted three lines"
          className="headingimg"
        />
      </span> */}
      <span className="service-heading reveal-text">
        <img
          className="headingimg"
          //  loading="lazy"
          src={threeLines}
          alt="Three lines"
        />
        <span className="mask-line">
          List of Bookkeeping Services We Offer
        </span>
        <img
          src={invertedThreeLines}
          //  loading="lazy"
          alt="Inverted three lines"
          className="headingimg"
        />
      </span>

      <div className="service-outbox">
        <div className="service-box">
          <div className="sb-h1">
            <img
              src={startUpRocket}
              //  loading="lazy"
              alt="Startup rocket"
              className="sb-img"
            />
            <span className="sb-heading">Start-Up</span>
          </div>
          <ul className="sb-ul">
            <li>Manual product & stock entry—no technical setup needed</li>
            <li>Track raw materials and finished goods usage</li>
            <li>Real-time inventory updates on sales and purchases</li>
            <li>Simple dashboard to view stock levels</li>
            <li>Ideal for retail shops, service providers & small traders</li>
            <li>Affordable at just ₹125/month</li>
            
            
          </ul>
          <button className="sb-quote btn btn-primary" onClick={toggleModal}>
            Get a Quote
          </button>
        </div>

        <div className="service-box">
          <div className="sb-h2">
            <span className="sb-heading">Growing</span>
            <img
              src={growingIcon}
              //  loading="lazy"
              alt="Growing icon"
              className="sb-img"
            />
          </div>
          <ul className="sb-ul">
            <li>Includes all Start-Up features</li>
            <li>Auto-adjust stock when finished goods are created</li>
            <li>Multi-category item handling & real-time stock balance</li>
            <li>Inventory summaries, item-wise reports, and sales tracking</li>
            <li>Useful for manufacturers, food businesses, and wholesalers</li>
            
          </ul>
          <button className="sb-quote btn btn-primary" onClick={toggleModal}>
            Get a Quote
          </button>
        </div>

        <div className="service-box">
          <div className="sb-h3">
            <span className="sb-heading">Established</span>
            <img
              src={establishedIcon}
              //  loading="lazy"
              alt="Established icon"
              className="sb-img"
            />
          </div>
          <ul className="sb-ul">
            <li>All Growing features included</li>
            <li>Cross-industry compatibility</li>
            <li>Advanced inventory management with audit trail</li>
            <li>Designed for large-scale usage with scalable features</li>
            <li>Works seamlessly across firms, currencies, and tax systems</li>
            <li>Forecasting, auto-purchase suggestions</li>
          </ul>
          <button className="sb-quote btn btn-primary" onClick={toggleModal}>
            Get a Quote
          </button>
        </div>
      </div>

      <div className="cloud-solution">
        <div className="cld-heading">
          The company that leaders trust to help them grow and thrive.
        </div>
        <div className="subheading">Who we are</div>
        <div className="cld-p1">Cloud solutions for every business</div>
        <div className="cld-p2">
          As the market leader in enterprise application software, we’re helping
          companies of all sizes and in all industries run better by redefining
          ERP.
        </div>
        <a className="cld-btn" href="#">
          Get Started with Cloud <i className="fa fa-angle-right"></i>
        </a>
        <img
          src={threeDImage}
          alt="3D illustration"
          //  loading="lazy"
          className="cloud-img"
        />
      </div>

      <QueryForm isOpen={modal} toggle={toggleModal} style={{zIndex: "1199" , maxWidth:"400px"}} /> 
    </div>


  );
}

export default Bookkeeping;
